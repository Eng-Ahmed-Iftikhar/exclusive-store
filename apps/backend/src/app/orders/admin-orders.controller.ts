import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminOrdersService } from './admin-orders.service';
import {
  AdminOrderDto,
  AdminOrderListDto,
  AdminOrderQueryDto,
  UpdateOrderStatusDto,
  UpdateOrderShippingDto,
  UpdateOrderNotesDto,
  UpdateOrderPriorityDto,
  UpdateOrderTagsDto,
  OrderStatsDto,
} from './dto/admin-order.dto';

@ApiTags('Admin Orders')
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get orders with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: AdminOrderListDto,
  })
  async getOrders(
    @Query() query: AdminOrderQueryDto,
    @CurrentUser() user: any
  ): Promise<AdminOrderListDto> {
    return this.adminOrdersService.getOrders(query);
  }

  @Get('live')
  @ApiOperation({ summary: 'Get live orders (not delivered/cancelled)' })
  @ApiResponse({
    status: 200,
    description: 'Live orders retrieved successfully',
    type: AdminOrderListDto,
  })
  async getLiveOrders(
    @Query() query: AdminOrderQueryDto,
    @CurrentUser() user: any
  ): Promise<AdminOrderListDto> {
    return this.adminOrdersService.getOrders({
      ...query,
      liveOnly: true,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiResponse({
    status: 200,
    description: 'Order statistics retrieved successfully',
    type: OrderStatsDto,
  })
  async getOrderStats(@CurrentUser() user: any): Promise<OrderStatsDto> {
    return this.adminOrdersService.getOrderStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    type: AdminOrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderById(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<AdminOrderDto> {
    return this.adminOrdersService.getOrderById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    type: AdminOrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderStatusDto,
    @CurrentUser() user: any
  ): Promise<AdminOrderDto> {
    return this.adminOrdersService.updateOrderStatus(id, updateDto, user.id);
  }

  @Patch(':id/shipping')
  @ApiOperation({ summary: 'Update order shipping information' })
  @ApiResponse({
    status: 200,
    description: 'Order shipping information updated successfully',
    type: AdminOrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderShipping(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderShippingDto,
    @CurrentUser() user: any
  ): Promise<AdminOrderDto> {
    return this.adminOrdersService.updateOrderShipping(id, updateDto, user.id);
  }

  @Patch(':id/notes')
  @ApiOperation({ summary: 'Update order notes' })
  @ApiResponse({
    status: 200,
    description: 'Order notes updated successfully',
    type: AdminOrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderNotes(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderNotesDto,
    @CurrentUser() user: any
  ): Promise<AdminOrderDto> {
    return this.adminOrdersService.updateOrderNotes(id, updateDto, user.id);
  }

  @Patch(':id/priority')
  @ApiOperation({ summary: 'Update order priority' })
  @ApiResponse({
    status: 200,
    description: 'Order priority updated successfully',
    type: AdminOrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderPriority(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderPriorityDto,
    @CurrentUser() user: any
  ): Promise<AdminOrderDto> {
    return this.adminOrdersService.updateOrderPriority(id, updateDto, user.id);
  }

  @Patch(':id/tags')
  @ApiOperation({ summary: 'Update order tags' })
  @ApiResponse({
    status: 200,
    description: 'Order tags updated successfully',
    type: AdminOrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrderTags(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderTagsDto,
    @CurrentUser() user: any
  ): Promise<AdminOrderDto> {
    return this.adminOrdersService.updateOrderTags(id, updateDto, user.id);
  }

  @Post(':id/mark-delivered')
  @ApiOperation({ summary: 'Mark order as delivered' })
  @ApiResponse({
    status: 200,
    description: 'Order marked as delivered successfully',
    type: AdminOrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Order already delivered' })
  async markAsDelivered(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<AdminOrderDto> {
    return this.adminOrdersService.markAsDelivered(id, user.id);
  }
}
