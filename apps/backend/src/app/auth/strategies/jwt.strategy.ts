import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '../../config/config.service';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });

    // Update the secret after super() call
    (this as unknown as { secretOrKey: string }).secretOrKey =
      this.configService.jwtSecret;
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
          },
        },
        userTeams: {
          include: {
            team: {
              include: {
                teamRoles: {
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
                },
              },
            },
          },
        },
        isEmailVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // If user has no main role, get roles from team memberships
    if (!user.role) {
      const teamRoles = user.userTeams.flatMap((ut) =>
        ut.team.teamRoles.map((tr) => tr.role)
      );

      // Add team roles to user object
      (
        user as {
          teamRoles?: {
            id: string;
            name: string;
            displayName: string;
            description: string | null;
          }[];
        }
      ).teamRoles = teamRoles;
    }

    return user;
  }
}
