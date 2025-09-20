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
            roleResources: {
              include: {
                resource: {
                  select: {
                    name: true,
                  },
                },
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
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
                        roleResources: {
                          include: {
                            resource: {
                              select: {
                                name: true,
                              },
                            },
                            permission: {
                              select: {
                                name: true,
                              },
                            },
                          },
                        },
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

    // Extract permissions and roles
    let permissions: string[] = [];
    let roles: any[] = [];

    // If user has a main role, use it
    if (user.role) {
      roles.push(user.role);
      if (user.role.roleResources) {
        permissions = user.role.roleResources.map(
          (rr) => `${rr.resource.name}:${rr.permission.name}`
        );
      }
    } else {
      // If no main role, get roles from team memberships
      const teamRoles = user.userTeams.flatMap((ut) =>
        ut.team.teamRoles.map((tr) => tr.role)
      );

      roles = teamRoles;

      // Extract permissions from team roles
      const teamPermissions = teamRoles.flatMap((role) =>
        role.roleResources.map(
          (rr) => `${rr.resource.name}:${rr.permission.name}`
        )
      );
      permissions = teamPermissions;
    }

    // Add permissions and roles to user object, remove userTeams
    (user as any).permissions = permissions;
    (user as any).roles = roles.map((r) => r.name);
    delete (user as any).userTeams;

    return user;
  }
}
