import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetUsersQueryDto, UsersListResponseDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve paginated list of users with search and filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: UsersListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getUsers(@Query() query: GetUsersQueryDto) {
    return this.usersService.getUsers(query);
  }

  @Get('customers')
  @ApiOperation({
    summary: 'Get all customers',
    description: 'Retrieve paginated list of customers only (role: customer)',
  })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
    type: UsersListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getCustomers(@Query() query: GetUsersQueryDto) {
    return this.usersService.getCustomers(query);
  }
}
