import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RoleSelfModificationGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const roleId = request.params.id;

    if (!user || !roleId) {
      return true; // Let other guards handle authentication
    }

    // Only apply restriction to admin users
    if (user.role?.name !== 'admin') {
      return true;
    }

    // Check if admin is trying to modify their own role
    const userRecord = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { roleId: true },
    });

    if (userRecord?.roleId === roleId) {
      throw new ForbiddenException('Cannot modify your own role');
    }

    return true;
  }
}
