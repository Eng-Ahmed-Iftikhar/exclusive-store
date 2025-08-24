import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  OrderDto,
  OrderResponseDto,
  ConfirmOrderAfterPaymentDto,
  OrderStatus,
} from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create-payment-intent')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create payment intent only (Step 1)' })
  @ApiResponse({
    status: 201,
    description: 'Payment intent created successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async createPaymentIntent(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: any
  ): Promise<OrderResponseDto> {
    // Extract user ID if authenticated
    const userId = req.user?.id;
    return this.ordersService.createOrder(createOrderDto, userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create order with payment processing' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: any
  ): Promise<OrderResponseDto> {
    // Extract user ID if authenticated
    const userId = req.user?.id;
    return this.ordersService.createOrder(createOrderDto, userId);
  }

  @Post('confirm-after-payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm order after successful payment' })
  @ApiResponse({
    status: 200,
    description: 'Order confirmed and created successfully',
    type: OrderDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async confirmOrderAfterPayment(
    @Body() confirmOrderDto: ConfirmOrderAfterPaymentDto
  ): Promise<OrderDto> {
    return this.ordersService.confirmOrderAfterPayment(
      confirmOrderDto.paymentIntentId,
      confirmOrderDto.orderDetails
    );
  }

  @Post('confirm-payment')
  @ApiOperation({ summary: 'Confirm payment and create order' })
  @ApiResponse({
    status: 201,
    description: 'Payment confirmed and order created successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Payment confirmation failed' })
  async confirmPaymentAndCreateOrder(
    @Body()
    confirmPaymentDto: {
      paymentIntentId: string;
      paymentMethodId: string;
      orderDetails: any;
    },
    @CurrentUser() user?: any
  ) {
    return this.ordersService.confirmPaymentAndCreateOrder(
      confirmPaymentDto.paymentIntentId,
      confirmPaymentDto.paymentMethodId,
      confirmPaymentDto.orderDetails,
      user?.id
    );
  }

  @Post('create-order-from-payment-intent')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create order from payment intent (Step 5)' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Payment intent not found' })
  async createOrderFromPaymentIntent(
    @Body()
    createOrderDto: {
      paymentIntentId: string;
      orderDetails: any;
    }
  ) {
    return this.ordersService.createOrderFromPaymentIntent(
      createOrderDto.paymentIntentId,
      createOrderDto.orderDetails
    );
  }

  @Post('attach-payment-method')
  @ApiOperation({ summary: 'Attach payment method to payment intent (Step 3)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['paymentIntentId', 'paymentMethodId'],
      properties: {
        paymentIntentId: {
          type: 'string',
          description: 'The Stripe payment intent ID',
        },
        paymentMethodId: {
          type: 'string',
          description: 'The Stripe payment method ID',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method attached successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Failed to attach payment method' })
  async attachPaymentMethod(
    @Body()
    attachPaymentDto: {
      paymentIntentId: string;
      paymentMethodId: string;
    }
  ) {
    return this.ordersService.attachPaymentMethod(
      attachPaymentDto.paymentIntentId,
      attachPaymentDto.paymentMethodId
    );
  }

  @Post('confirm-payment-only')
  @ApiOperation({ summary: 'Confirm payment only (Step 4)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['paymentIntentId', 'paymentMethodId'],
      properties: {
        paymentIntentId: {
          type: 'string',
          description: 'The Stripe payment intent ID',
        },
        paymentMethodId: {
          type: 'string',
          description: 'The Stripe payment method ID',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Payment confirmed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Payment confirmation failed' })
  async confirmPaymentOnly(
    @Body()
    confirmPaymentDto: {
      paymentIntentId: string;
      paymentMethodId: string;
    }
  ) {
    return this.ordersService.confirmPaymentOnly(
      confirmPaymentDto.paymentIntentId,
      confirmPaymentDto.paymentMethodId
    );
  }

  @Get(':id')
  async getOrderById(
    @Param('id') id: string,
    @CurrentUser() user?: any
  ): Promise<OrderDto> {
    return this.ordersService.getOrderById(id, user?.id);
  }

  @Get(':id/payment-history')
  async getPaymentHistory(
    @Param('id') id: string,
    @CurrentUser() user?: any
  ): Promise<any[]> {
    return this.ordersService.getPaymentHistory(id, user?.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders (authenticated users only)' })
  @ApiResponse({
    status: 200,
    description: 'User orders retrieved successfully',
    type: [OrderDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserOrders(@CurrentUser() user: any): Promise<OrderDto[]> {
    return this.ordersService.getUserOrders(user.id);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders (authenticated users only)' })
  @ApiResponse({
    status: 200,
    description: 'User orders retrieved successfully',
    type: [OrderDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserOrdersAlternative(
    @CurrentUser() user: any
  ): Promise<OrderDto[]> {
    return this.ordersService.getUserOrders(user.id);
  }

  @Get(':id/status')
  async getOrderStatus(
    @Param('id') id: string
  ): Promise<{ status: OrderStatus }> {
    return this.ordersService.getOrderStatus(id);
  }

  @Post(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus }
  ): Promise<OrderDto> {
    return this.ordersService.updateOrderStatus(id, body.status);
  }

  @Post(':id/cancel')
  async cancelOrder(@Param('id') id: string): Promise<OrderDto> {
    return this.ordersService.cancelOrder(id);
  }

  @Get('history')
  async getOrderHistory(): Promise<OrderDto[]> {
    return this.ordersService.getOrderHistory();
  }

  @Post('guest')
  async createGuestOrder(
    @Body() createOrderDto: CreateOrderDto
  ): Promise<OrderResponseDto> {
    return this.ordersService.createOrder(createOrderDto, undefined);
  }

  @Get('guest/:id')
  async getGuestOrder(
    @Param('id') id: string,
    @Body() body: { email: string }
  ): Promise<OrderDto> {
    return this.ordersService.getGuestOrder(id, body.email);
  }

  @Get('test-stripe')
  @ApiOperation({ summary: 'Test Stripe connectivity' })
  @ApiResponse({
    status: 200,
    description: 'Stripe test successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        environment: { type: 'string' },
        apiVersion: { type: 'string' },
      },
    },
  })
  async testStripe() {
    return this.ordersService.testStripe();
  }
}
