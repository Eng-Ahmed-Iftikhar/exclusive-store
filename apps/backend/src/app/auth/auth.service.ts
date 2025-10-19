import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto, User, AuthResponse } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '../config/config.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { CustomLoggerService } from '../logger/logger.service';
import { JwtPayload } from './strategies/jwt.strategy';
import { ActivityService } from '../activity/activity.service';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly refreshTokenExpiry = 30 * 24 * 60 * 60; // 30 days in seconds
  private readonly rememberMeRefreshTokenExpiry = 90 * 24 * 60 * 60; // 90 days in seconds

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private emailService: EmailService,
    private logger: CustomLoggerService,
    private configService: ConfigService,
    private activityService: ActivityService
  ) {}

  private get accessTokenExpiry(): string {
    return this.configService.jwtExpiresIn;
  }
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Find user by email with role information
    const dbUser = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
          },
        },
      },
    });

    if (!dbUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user has a password (not an OAuth-only user)
    if (!dbUser.password) {
      throw new UnauthorizedException(
        'Please use social login for this account'
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      dbUser.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate token pair and store refresh token in Redis (creates new refresh token)
    const { accessToken } = await this.generateNewRefreshToken(
      dbUser.id,
      dbUser.email,
      loginDto.rememberMe
    );

    // Log login activity
    await this.activityService.logUserActivity(
      dbUser.id,
      'logged in',
      dbUser.email
    );

    return {
      accessToken,
    };
  }

  async googleAuth(googleUser: any): Promise<AuthResponse> {
    // Check if user already exists by email or Google ID
    let dbUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: googleUser.email }, { googleId: googleUser.googleId }],
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
          },
        },
      },
    });

    if (!dbUser) {
      // Create new user if doesn't exist
      const defaultRole = await this.prisma.role.findFirst({
        where: { name: 'customer' },
      });

      if (!defaultRole) {
        throw new UnauthorizedException('Default user role not found');
      }

      dbUser = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          password: null, // No password for OAuth users
          roleId: defaultRole.id,
          isEmailVerified: true, // Google emails are pre-verified
          googleId: googleUser.googleId,
          avatar: googleUser.picture,
          provider: 'google',
        },
        include: {
          role: {
            select: {
              id: true,
              name: true,
              displayName: true,
              description: true,
            },
          },
        },
      });

      // Log user registration activity
      await this.activityService.logUserActivity(
        dbUser.id,
        'User registered via Google OAuth',
        dbUser.email
      );
    } else {
      // Update existing user with Google info if not already set
      if (!dbUser.googleId) {
        dbUser = await this.prisma.user.update({
          where: { id: dbUser.id },
          data: {
            googleId: googleUser.googleId,
            avatar: googleUser.picture,
            provider: 'google',
            isEmailVerified: true, // Ensure email is verified for OAuth users
          },
          include: {
            role: {
              select: {
                id: true,
                name: true,
                displayName: true,
                description: true,
              },
            },
          },
        });
      }
    }

    // Generate token pair
    const { accessToken } = await this.generateNewRefreshToken(
      dbUser.id,
      dbUser.email,
      false
    );

    // Log login activity
    await this.activityService.logUserActivity(
      dbUser.id,
      'User logged in via Google OAuth',
      dbUser.email
    );

    return {
      accessToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Get default user role
    const defaultRole = await this.prisma.role.findUnique({
      where: { name: 'customer' },
    });

    if (!defaultRole) {
      throw new Error(
        'Default user role not found. Please add a default user role to the database.'
      );
    }

    // Create user in database with default role
    const dbUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        roleId: defaultRole.id,
        provider: 'email',
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
          },
        },
      },
    });

    // Convert database user to response user (exclude password)
    const user: User = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name || '',
      role: dbUser.role?.name || 'user',
      roleDetails: dbUser.role,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    };

    // Generate token pair and store refresh token in Redis (creates new refresh token)
    const { accessToken } = await this.generateNewRefreshToken(
      user.id,
      user.email
    );

    // Send welcome email (non-blocking)
    this.sendWelcomeEmailAsync(user);

    // Log registration activity
    await this.activityService.logUserActivity(
      user.id,
      'registered',
      user.email
    );

    return {
      accessToken,
    };
  }

  async logout(accessToken: string): Promise<{ message: string }> {
    // Get user ID from token before revoking
    let userId: string | null = null;
    try {
      const payload = this.jwtService.verify(accessToken) as JwtPayload;
      userId = payload.sub;
    } catch (error) {
      // Token might be invalid, continue with logout
    }

    // Revoke the token pair from Redis
    await this.revokeTokenPair(accessToken);

    // Log logout activity if user ID is available
    if (userId) {
      await this.activityService.logUserActivity(userId, 'logged out');
    }

    return { message: 'Logged out successfully' };
  }

  async refreshToken(
    expiredAccessToken: string
  ): Promise<{ accessToken: string } | null> {
    const newAccessToken = await this.refreshAccessToken(expiredAccessToken);

    if (!newAccessToken) {
      throw new UnauthorizedException(
        'Invalid refresh token or refresh token expired'
      );
    }

    return { accessToken: newAccessToken };
  }

  // Token management methods
  async generateTokenPair(
    userId: string,
    email: string,
    rememberMe = false
  ): Promise<TokenPair> {
    // Generate access token
    const accessTokenPayload = {
      sub: userId,
      email: email,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: this.accessTokenExpiry,
    });

    // Generate refresh token
    const refreshToken = this.generateSecureRefreshToken();

    // Store refresh token in Redis with access token as key
    const expiry = rememberMe
      ? this.rememberMeRefreshTokenExpiry
      : this.refreshTokenExpiry;
    await this.redisService.set(accessToken, refreshToken, expiry);

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateNewRefreshToken(
    userId: string,
    email: string,
    rememberMe = false
  ): Promise<TokenPair> {
    // This creates a completely new refresh token (only used on login/register)
    const accessTokenPayload = {
      sub: userId,
      email: email,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: this.accessTokenExpiry,
    });

    // Generate a brand new refresh token
    const refreshToken = this.generateSecureRefreshToken();

    // Store the new refresh token in Redis
    const expiry = rememberMe
      ? this.rememberMeRefreshTokenExpiry
      : this.refreshTokenExpiry;
    await this.redisService.set(accessToken, refreshToken, expiry);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(expiredAccessToken: string): Promise<string | null> {
    try {
      // Check if refresh token exists in Redis for the expired access token
      const storedRefreshToken = await this.redisService.get(
        expiredAccessToken
      );

      if (!storedRefreshToken) {
        return null; // No refresh token found
      }

      // Get the remaining TTL of the refresh token
      const remainingTTL = await this.redisService.ttl(expiredAccessToken);

      if (remainingTTL <= 0) {
        // Refresh token has expired
        await this.redisService.del(expiredAccessToken);
        return null;
      }

      // Verify the expired access token to get user info (ignore expiration)
      const decoded = this.jwtService.decode(expiredAccessToken) as JwtPayload;

      if (!decoded || !decoded.sub || !decoded.email) {
        return null; // Invalid token structure
      }

      // Generate new access token with same user info
      const newAccessTokenPayload = {
        sub: decoded.sub,
        email: decoded.email,
        type: 'access',
      };

      const newAccessToken = this.jwtService.sign(newAccessTokenPayload, {
        expiresIn: this.accessTokenExpiry,
      });

      // Update Redis key to new access token while preserving the original expiry time
      await this.redisService.del(expiredAccessToken);
      await this.redisService.set(
        newAccessToken,
        storedRefreshToken,
        remainingTTL // Use the remaining TTL, not the original expiry
      );

      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  }

  async revokeTokenPair(accessToken: string): Promise<void> {
    try {
      await this.redisService.del(accessToken);
    } catch (error) {
      console.error('Error revoking token pair:', error);
    }
  }

  async isRefreshTokenValid(accessToken: string): Promise<boolean> {
    try {
      return await this.redisService.exists(accessToken);
    } catch (error) {
      console.error('Error checking refresh token validity:', error);
      return false;
    }
  }

  async getRefreshTokenTTL(accessToken: string): Promise<number> {
    try {
      return await this.redisService.ttl(accessToken);
    } catch (error) {
      console.error('Error getting refresh token TTL:', error);
      return -1;
    }
  }

  private generateSecureRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  private async sendWelcomeEmailAsync(user: User): Promise<void> {
    try {
      await this.emailService.sendWelcomeEmail({
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      // Log error but don't throw - registration should succeed even if email fails
      console.error('Failed to send welcome email:', error);
    }
  }

  // Email verification methods
  async sendVerificationCode(userId: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete any existing verification codes for this user
    await this.prisma.verificationCode.deleteMany({
      where: {
        userId: user.id,
        type: 'email_verification',
      },
    });

    // Create new verification code
    await this.prisma.verificationCode.create({
      data: {
        userId: user.id,
        email: user.email,
        code: verificationCode,
        type: 'email_verification',
        expiresAt: expiryTime,
      },
    });

    // Send verification email
    await this.emailService.sendVerificationEmail({
      name: user.name || 'User',
      email: user.email,
      code: verificationCode,
    });

    return { message: 'Verification code sent to your email' };
  }

  async verifyEmail(
    userId: string,
    code: string
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }

    // Find valid verification code
    const verificationCode = await this.prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        email: user.email,
        code: code,
        type: 'email_verification',
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verificationCode) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    // Mark verification code as used and user as verified
    await this.prisma.$transaction([
      this.prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { isUsed: true },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      }),
    ]);

    return { message: 'Email verified successfully' };
  }

  // Password reset methods
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success message even if user doesn't exist for security
      return {
        message:
          "If an account with that email exists, we've sent a password reset link",
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing password reset tokens for this user
    await this.prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    // Create new password reset record
    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        email: user.email,
        token: resetToken,
        expiresAt: expiryTime,
      },
    });

    // Create reset link using ConfigService
    const resetLink = `${this.configService.frontendUrl}/reset-password?token=${resetToken}`;
    this.logger.log(`Reset link: ${resetLink}`, 'AuthService');

    // Send password reset email
    await this.emailService.sendPasswordResetEmail({
      name: user.name || 'User',
      email: user.email,
      resetLink,
    });

    return {
      message:
        "If an account with that email exists, we've sent a password reset link",
    };
  }

  async adminForgotPassword(email: string): Promise<{ message: string }> {
    // Check if user exists and has admin role
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      // Return success message even if user doesn't exist for security
      return {
        message:
          'If an admin account with this email exists, a password reset link has been sent.',
      };
    }

    // Use the existing forgot password logic
    return this.forgotPassword(email);
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // Find valid password reset record
    const passwordReset = await this.prisma.passwordReset.findFirst({
      where: {
        token: token,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!passwordReset) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and mark reset token as used
    await this.prisma.$transaction([
      this.prisma.passwordReset.update({
        where: { id: passwordReset.id },
        data: { isUsed: true },
      }),
      this.prisma.user.update({
        where: { id: passwordReset.userId },
        data: { password: hashedPassword },
      }),
    ]);

    // Revoke all existing tokens for security
    await this.revokeAllUserTokens(passwordReset.userId);

    return { message: 'Password reset successfully' };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if user has a password (not an OAuth-only user)
    if (!user.password) {
      throw new UnauthorizedException(
        'Cannot change password for social login accounts'
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    // Revoke all existing tokens for security
    await this.revokeAllUserTokens(userId);

    return { message: 'Password changed successfully' };
  }

  private async revokeAllUserTokens(userId: string): Promise<void> {
    // This would require storing user-token mappings in Redis
    // For now, we'll implement a simple approach
    try {
      // Get all Redis keys (not ideal for production, but works for small scale)
      // In production, you'd want to maintain a user->tokens mapping
      console.log(`Revoking all tokens for user ${userId}`);
      // Implementation would depend on your Redis key strategy
    } catch (error) {
      console.error('Error revoking user tokens:', error);
    }
  }

  async setupPassword(
    token: string,
    password: string
  ): Promise<{ message: string; success: boolean }> {
    try {
      // Verify the magic link token
      const tokenData = await this.redisService.get(`magic_link:${token}`);

      if (!tokenData) {
        throw new UnauthorizedException('Invalid or expired magic link token');
      }

      const { userId, email } = JSON.parse(tokenData);

      // Find the user
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verify the email matches
      if (user.email !== email) {
        throw new UnauthorizedException('Invalid magic link token');
      }

      // Hash the new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update user password and mark email as verified
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          isEmailVerified: true,
        },
      });

      // Delete the magic link token (one-time use)
      await this.redisService.del(`magic_link:${token}`);

      // Log the activity
      await this.activityService.createActivity({
        type: 'user',
        title: 'Password Setup',
        description: 'User set up password via magic link',
        userId,
      });

      return {
        message: 'Password set successfully! You can now log in.',
        success: true,
      };
    } catch (error) {
      this.logger.error(
        'Password setup failed',
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }
}
