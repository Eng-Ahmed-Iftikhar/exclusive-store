import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { CartService } from '../cart/cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '../config/config.service';
import { ActivityService } from '../activity/activity.service';
import {
  CreateOrderDto,
  OrderDto,
  OrderResponseDto,
  OrderStatus,
  PaymentStatus,
} from './dto/order.dto';

@Injectable()
export class OrdersService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private emailService: EmailService,
    private configService: ConfigService,
    private activityService: ActivityService
  ) {
    this.stripe = new Stripe(this.configService.stripeSecretKey, {
      apiVersion: '2025-07-30.basil',
    });
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId?: string
  ): Promise<OrderResponseDto> {
    // Get cart and validate
    const cart = await this.cartService.getCartById(createOrderDto.cartId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate costs from cart subtotal
    const subtotal = parseFloat(cart.subtotal.toString());
    const shippingCost = this.calculateShippingCost(subtotal);
    const tax = this.calculateTax(subtotal + shippingCost);
    const total = subtotal + shippingCost + tax;

    // Determine if this is a guest order
    const isGuestOrder = !userId || createOrderDto.isGuestOrder || false;

    try {
      // Step 1: Create Stripe payment intent (without payment method initially)
      const paymentIntentData: any = {
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          cartId: createOrderDto.cartId,
          isGuestOrder: isGuestOrder.toString(),
          userId: userId || 'guest',
        },
        // Add customer information if available
        receipt_email: createOrderDto.guestUserInfo?.email || undefined,
        shipping: createOrderDto.guestUserInfo
          ? {
              name: createOrderDto.guestUserInfo.name,
              address: {
                line1: createOrderDto.shippingAddress.address,
                city: createOrderDto.shippingAddress.city,
                state: createOrderDto.shippingAddress.state,
                country: createOrderDto.shippingAddress.country,
                postal_code: createOrderDto.shippingAddress.postalCode || '',
              },
            }
          : undefined,
        // Always use automatic payment methods for initial creation
        automatic_payment_methods: {
          enabled: true,
        },
      };

      const paymentIntent = await this.stripe.paymentIntents.create(
        paymentIntentData
      );

      // Log payment intent details for debugging
      console.log('Payment Intent Created:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        livemode: paymentIntent.livemode,
        environment: paymentIntent.livemode ? 'live' : 'test',
        apiKeyPrefix: this.configService.stripeSecretKey.substring(0, 7),
      });

      // Return payment intent details for frontend to handle payment
      return {
        order: undefined,
        message: 'Payment intent created. Complete payment to create order.',
        clientSecret: paymentIntent.client_secret || undefined,
        paymentIntentId: paymentIntent.id,
        orderDetails: {
          cartId: createOrderDto.cartId,
          subtotal,
          shippingCost,
          tax,
          total,
          isGuestOrder,
          guestUserInfo: createOrderDto.guestUserInfo,
          shippingAddress: createOrderDto.shippingAddress,
          billingAddress:
            createOrderDto.billingAddress || createOrderDto.shippingAddress,
          notes: createOrderDto.notes,
          userId,
        },
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(
          `Payment intent creation failed: ${error.message}`
        );
      }
      throw error;
    }
  }

  async confirmOrderAfterPayment(
    paymentIntentId: string,
    orderDetails: any
  ): Promise<OrderDto> {
    // Verify payment with Stripe and get expanded data
    const paymentIntent = (await this.stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ['charges.data.payment_method_details.card'],
      }
    )) as any; // Type assertion to handle expanded data

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment not completed');
    }

    // Get cart and validate
    const cart = await this.cartService.getCartById(orderDetails.cartId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate costs from cart subtotal
    const subtotal = parseFloat(cart.subtotal.toString());
    const shippingCost = this.calculateShippingCost(subtotal);
    const tax = this.calculateTax(subtotal + shippingCost);
    const total = subtotal + shippingCost + tax;

    // Create the order
    const order = await this.prisma.order.create({
      data: {
        userId: orderDetails.userId || null,
        guestUserInfo: orderDetails.guestUserInfo
          ? JSON.stringify(orderDetails.guestUserInfo)
          : null,
        shippingAddress: JSON.stringify(orderDetails.shippingAddress),
        billingAddress: JSON.stringify(
          orderDetails.billingAddress || orderDetails.shippingAddress
        ),
        subtotal,
        shippingCost,
        tax,
        total,
        status: 'confirmed',
        paymentStatus: 'completed',
        stripePaymentIntentId: paymentIntentId,
        notes: orderDetails.notes,
        isGuestOrder: orderDetails.isGuestOrder,
      },
    });

    // Create order items
    const orderItems = cart.items.map((item) => ({
      orderId: order.id,
      variantId: item.variantId || '',
      quantity: item.quantity,
      price: item.price,
    }));

    await this.prisma.orderItem.createMany({
      data: orderItems,
    });

    // Extract payment details from Stripe response
    const charge = paymentIntent.charges?.data?.[0];
    const cardDetails = charge?.payment_method_details?.card;

    // Create payment history record
    await this.prisma.paymentHistory.create({
      data: {
        orderId: order.id,
        userId: orderDetails.userId || null,
        stripePaymentIntentId: paymentIntentId,
        amount: total,
        currency: 'USD',
        status: 'succeeded',
        paymentMethod: paymentIntent.payment_method_types?.[0] || 'card',
        last4: cardDetails?.last4 || null,
        brand: cardDetails?.brand || null,
        receiptUrl: charge?.receipt_url || null,
      },
    });

    // Clear the cart after successful order
    await this.cartService.clearCart(orderDetails.cartId);

    // Send order confirmation email
    try {
      let userEmail = orderDetails.guestUserInfo?.email || '';
      let userName = orderDetails.guestUserInfo?.name || 'Customer';

      // If it's a logged-in user, get their information from the database
      if (orderDetails.userId && !orderDetails.isGuestOrder) {
        try {
          const user = await this.prisma.user.findUnique({
            where: { id: orderDetails.userId },
            select: { email: true, name: true },
          });
          if (user) {
            userEmail = user.email;
            userName = user.name;
          }
        } catch (userError) {
          console.error('Failed to fetch user information:', userError);
        }
      }

      if (userEmail) {
        const emailData = {
          name: userName,
          email: userEmail,
          orderId: order.id,
          orderDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          total: total,
          items: cart.items.map((item) => ({
            name:
              item.variant?.product?.name || item.variant?.name || 'Product',
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: `${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.postalCode}, ${orderDetails.shippingAddress.country}`,
        };

        await this.emailService.sendOrderConfirmationEmail(emailData);
      }
    } catch (error) {
      // Log error but don't fail the order creation
      console.error('Failed to send order confirmation email:', error);
    }

    // Return the created order
    return this.mapOrderToDto(order);
  }

  async getOrderById(orderId: string, userId?: string): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check access control
    if (order.userId && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.mapOrderToDto(order);
  }

  async getPaymentHistory(orderId: string, userId?: string): Promise<any[]> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { paymentHistory: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if user has access to this order
    if (userId && order.userId !== userId) {
      throw new ForbiddenException('Access denied to this order');
    }

    return order.paymentHistory || [];
  }

  async getOrderStatus(orderId: string): Promise<{ status: OrderStatus }> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return { status: order.status as OrderStatus };
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });

    // Log order status update activity
    await this.activityService.logOrderActivity(
      orderId,
      `status updated to ${status}`,
      order.userId || 'system'
    );

    return this.mapOrderToDto(updatedOrder);
  }

  async cancelOrder(orderId: string): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel delivered order');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
      include: { items: true },
    });

    return this.mapOrderToDto(updatedOrder);
  }

  async getOrderHistory(): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order: any) => this.mapOrderToDto(order));
  }

  async getGuestOrder(orderId: string, email: string): Promise<OrderDto> {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        guestUserInfo: {
          contains: email,
        },
      },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Guest order not found');
    }

    return this.mapOrderToDto(order);
  }

  async getUserOrders(userId: string): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                images: {
                  include: { file: true },
                },
                product: {
                  include: {
                    category: true,
                    subcategory: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders?.map((order: any) => this.mapOrderToDto(order));
  }

  async confirmPayment(
    orderId: string,
    paymentIntentId: string
  ): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.stripePaymentIntentId !== paymentIntentId) {
      throw new BadRequestException('Invalid payment intent');
    }

    // Verify payment with Stripe
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      paymentIntentId
    );

    if (paymentIntent.status === 'succeeded') {
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.COMPLETED,
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  images: {
                    include: { file: true },
                  },
                  product: {
                    include: {
                      category: true,
                      subcategory: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return this.mapOrderToDto(updatedOrder);
    } else {
      throw new BadRequestException('Payment not completed');
    }
  }

  async confirmPaymentAndCreateOrder(
    paymentIntentId: string,
    paymentMethodId: string,
    orderDetails: any,
    userId?: string
  ): Promise<OrderResponseDto> {
    try {
      // Step 1: Attach the payment method to the payment intent
      await this.stripe.paymentIntents.update(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      // Step 2: Confirm the payment intent
      const confirmedPaymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId
      );

      if (confirmedPaymentIntent.status === 'succeeded') {
        // Step 4: Payment successful, create the order
        const cart = await this.cartService.getCartById(orderDetails.cartId);

        const order = await this.createOrderRecord(
          {
            cartId: orderDetails.cartId,
            userId: orderDetails.userId,
            guestUserInfo: orderDetails.guestUserInfo,
            shippingAddress: orderDetails.shippingAddress,
            billingAddress: orderDetails.billingAddress,
            notes: orderDetails.notes,
            isGuestOrder: orderDetails.isGuestOrder,
            paymentMethod: 'card',
          },
          userId,
          cart,
          cart.subtotal,
          cart.shippingCost,
          cart.tax,
          cart.total,
          orderDetails.isGuestOrder,
          confirmedPaymentIntent.id
        );

        // Clear the cart after successful order
        await this.cartService.clearCart(orderDetails.cartId);

        // Send order confirmation email
        await this.sendOrderConfirmationEmail(order, cart, {
          cartId: orderDetails.cartId,
          isGuestOrder: orderDetails.isGuestOrder,
          paymentMethod: 'card',
          guestUserInfo: orderDetails.guestUserInfo,
          shippingAddress: orderDetails.shippingAddress,
        });

        // Log order creation activity
        await this.activityService.logOrderActivity(
          order.id,
          'created',
          userId || 'guest'
        );

        return {
          order: this.mapOrderToDto(order),
          message: 'Order created successfully',
          clientSecret: undefined,
          paymentIntentId: confirmedPaymentIntent.id,
          orderDetails: undefined,
        };
      } else if (confirmedPaymentIntent.status === 'requires_action') {
        // Payment requires additional authentication (3D Secure, etc.)
        return {
          order: undefined,
          message: 'Payment requires additional authentication',
          clientSecret: confirmedPaymentIntent.client_secret || undefined,
          paymentIntentId: confirmedPaymentIntent.id,
          orderDetails,
        };
      } else {
        throw new BadRequestException(
          `Payment failed: ${confirmedPaymentIntent.status}`
        );
      }
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(
          `Payment confirmation failed: ${error.message}`
        );
      }
      throw error;
    }
  }

  async createOrderFromPaymentIntent(
    paymentIntentId: string,
    orderDetails: any
  ): Promise<OrderDto> {
    try {
      // Verify payment intent exists and is succeeded
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status !== 'succeeded') {
        throw new BadRequestException('Payment intent is not succeeded');
      }

      // Get cart and validate
      const cart = await this.cartService.getCartById(orderDetails.cartId);

      if (!cart.items || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      // Create the order using the existing method
      const order = await this.createOrderRecord(
        {
          cartId: orderDetails.cartId,
          userId: orderDetails.userId,
          guestUserInfo: orderDetails.guestUserInfo,
          shippingAddress: orderDetails.shippingAddress,
          billingAddress: orderDetails.billingAddress,
          notes: orderDetails.notes,
          isGuestOrder: orderDetails.isGuestOrder,
          paymentMethod: 'card',
        },
        orderDetails.userId,
        cart,
        cart.subtotal,
        cart.shippingCost,
        cart.tax,
        cart.total,
        orderDetails.isGuestOrder,
        paymentIntentId
      );

      // Clear the cart after successful order
      await this.cartService.clearCart(orderDetails.cartId);

      // Send order confirmation email
      await this.sendOrderConfirmationEmail(order, cart, {
        cartId: orderDetails.cartId,
        isGuestOrder: orderDetails.isGuestOrder,
        paymentMethod: 'card',
        guestUserInfo: orderDetails.guestUserInfo,
        shippingAddress: orderDetails.shippingAddress,
      });

      return order as unknown as OrderDto;
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(
          `Failed to create order from payment intent: ${error.message}`
        );
      }
      throw error;
    }
  }

  async attachPaymentMethod(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Immediately attach the payment method to the payment intent
      await this.stripe.paymentIntents.update(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      // Immediately confirm the payment intent after attaching
      const confirmedPaymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId
      );

      if (confirmedPaymentIntent.status === 'succeeded') {
        return {
          success: true,
          message: 'Payment method attached and payment confirmed successfully',
        };
      } else if (confirmedPaymentIntent.status === 'requires_action') {
        return {
          success: true,
          message:
            'Payment method attached. Additional authentication required.',
        };
      } else {
        return {
          success: false,
          message: `Payment failed after attachment: ${confirmedPaymentIntent.status}`,
        };
      }
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        return {
          success: false,
          message: `Failed to attach payment method: ${error.message}`,
        };
      }
      return {
        success: false,
        message: 'An unexpected error occurred while attaching payment method',
      };
    }
  }

  async confirmPaymentOnly(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Step 1: Attach the payment method to the payment intent
      await this.stripe.paymentIntents.update(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      // Step 2: Confirm the payment intent
      const confirmedPaymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId
      );

      if (confirmedPaymentIntent.status === 'succeeded') {
        return {
          success: true,
          message: 'Payment confirmed successfully',
        };
      } else if (confirmedPaymentIntent.status === 'requires_action') {
        return {
          success: false,
          message: 'Payment requires additional authentication (3D Secure)',
        };
      } else {
        return {
          success: false,
          message: `Payment failed: ${confirmedPaymentIntent.status}`,
        };
      }
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        return {
          success: false,
          message: `Payment confirmation failed: ${error.message}`,
        };
      }
      return {
        success: false,
        message: 'An unexpected error occurred during payment confirmation',
      };
    }
  }

  private calculateShippingCost(subtotal: number): number {
    // Free shipping from config threshold
    if (subtotal >= this.configService.freeShippingThreshold) {
      return 0;
    }
    // Flat rate shipping from config
    return this.configService.shippingCost;
  }

  private calculateTax(subtotal: number): number {
    // Tax calculation from config rate
    return Math.round(subtotal * this.configService.taxRate * 100) / 100;
  }

  private async createOrderRecord(
    createOrderDto: CreateOrderDto,
    userId: string | undefined,
    cart: any,
    subtotal: number,
    shippingCost: number,
    tax: number,
    total: number,
    isGuestOrder: boolean,
    stripePaymentIntentId: string
  ) {
    // Create the order
    const order = await this.prisma.order.create({
      data: {
        userId: userId || null,
        guestUserInfo: createOrderDto.guestUserInfo
          ? JSON.stringify(createOrderDto.guestUserInfo)
          : null,
        shippingAddress: JSON.stringify(createOrderDto.shippingAddress),
        billingAddress: JSON.stringify(
          createOrderDto.billingAddress || createOrderDto.shippingAddress
        ),
        subtotal,
        shippingCost,
        tax,
        total,
        status: 'confirmed',
        paymentStatus: 'completed',
        stripePaymentIntentId,
        notes: createOrderDto.notes,
        isGuestOrder,
      },
    });

    // Create order items
    const orderItems = cart.items.map((item: any) => ({
      orderId: order.id,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price,
    }));

    await this.prisma.orderItem.createMany({
      data: orderItems,
    });

    // Create payment history record
    await this.prisma.paymentHistory.create({
      data: {
        orderId: order.id,
        userId: userId || null,
        stripePaymentIntentId,
        amount: total,
        currency: 'USD',
        status: 'succeeded',
        paymentMethod: 'card',
        last4: createOrderDto.cardNumber?.slice(-4) || null,
        brand: this.detectCardBrand(createOrderDto.cardNumber || ''),
        receiptUrl: null,
      },
    });

    return order;
  }

  private detectCardBrand(cardNumber: string): string | null {
    const cleanNumber = cardNumber.replace(/\s/g, '');

    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6/.test(cleanNumber)) return 'discover';

    return null;
  }

  private async sendOrderConfirmationEmail(
    order: any,
    cart: any,
    createOrderDto: CreateOrderDto
  ) {
    try {
      let userEmail = createOrderDto.guestUserInfo?.email || '';
      let userName = createOrderDto.guestUserInfo?.name || 'Customer';

      // If it's a logged-in user, get their information from the database
      if (order.userId && !createOrderDto.isGuestOrder) {
        try {
          const user = await this.prisma.user.findUnique({
            where: { id: order.userId },
            select: { email: true, name: true },
          });
          if (user) {
            userEmail = user.email;
            userName = user.name;
          }
        } catch (userError) {
          console.error('Failed to fetch user information:', userError);
        }
      }

      if (userEmail) {
        const emailData = {
          name: userName,
          email: userEmail,
          orderId: order.id,
          orderDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          total: order.total,
          items: cart.items.map((item: any) => ({
            name:
              item.variant?.product?.name || item.variant?.name || 'Product',
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: `${createOrderDto.shippingAddress.address}, ${createOrderDto.shippingAddress.city}, ${createOrderDto.shippingAddress.state} ${createOrderDto.shippingAddress.postalCode}, ${createOrderDto.shippingAddress.country}`,
        };

        await this.emailService.sendOrderConfirmationEmail(emailData);
      }
    } catch (error) {
      // Log error but don't fail the order creation
      console.error('Failed to send order confirmation email:', error);
    }
  }

  private mapOrderToDto(order: any): OrderDto {
    return {
      id: order.id,
      userId: order.userId || undefined,
      guestUserInfo: order.guestUserInfo
        ? JSON.parse(order.guestUserInfo)
        : undefined,
      shippingAddress: JSON.parse(order.shippingAddress),
      billingAddress: JSON.parse(order.billingAddress),
      items: order.items.map((item: any) => ({
        id: item.id,
        itemId: item.variantId,
        item: item.variant,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      stripePaymentIntentId: order.stripePaymentIntentId,
      notes: order.notes,
      isGuestOrder: order.isGuestOrder,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  async testStripe() {
    try {
      // Test Stripe connectivity by creating a test payment intent
      const testPaymentIntent = await this.stripe.paymentIntents.create({
        amount: 100, // $1.00
        currency: 'usd',
        metadata: {
          test: 'true',
          timestamp: new Date().toISOString(),
        },
      });

      return {
        success: true,
        message: 'Stripe connection successful',
        environment: testPaymentIntent.livemode ? 'live' : 'test',
        apiVersion: '2025-07-30.basil',
        testPaymentIntentId: testPaymentIntent.id,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        return {
          success: false,
          message: `Stripe error: ${error.message}`,
          environment: 'unknown',
          apiVersion: '2025-07-30.basil',
          error: error.message,
        };
      }
      return {
        success: false,
        message: 'Unknown error occurred',
        environment: 'unknown',
        apiVersion: '2025-07-30.basil',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
