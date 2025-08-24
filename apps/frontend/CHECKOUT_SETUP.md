# Checkout Feature Setup Guide

## Prerequisites

1. **Stripe Account**: You need a Stripe account to process payments
2. **Backend Running**: Ensure the backend is running and accessible

## Environment Configuration

Create a `.env` file in the frontend directory with the following variables:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
```

## Backend Environment Configuration

In your backend `.env` file, add:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

## Stripe Keys

1. **Test Keys** (for development):
   - Publishable Key: Starts with `pk_test_`
   - Secret Key: Starts with `sk_test_`

2. **Live Keys** (for production):
   - Publishable Key: Starts with `pk_live_`
   - Secret Key: Starts with `sk_live_`

## How to Use

1. **Navigate to Checkout**: Users can go to `/checkout?cartId=<cart_id>`
2. **Fill Form**: Users fill in their information (guest users) or it's pre-filled (authenticated users)
3. **Payment**: Users enter their card details using Stripe Elements
4. **Order Creation**: Order is created only after successful payment
5. **Success**: Users are redirected to order success page

## Features

- ✅ Guest checkout (no login required)
- ✅ User checkout (pre-filled information)
- ✅ Stripe payment integration
- ✅ Professional UI/UX
- ✅ Responsive design
- ✅ Order tracking
- ✅ Cart clearing after successful order

## Security Features

- Payment is processed before order creation
- Stripe handles all sensitive payment data
- No credit card information stored on our servers
- Payment verification before order confirmation

## Testing

Use Stripe's test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

## Troubleshooting

1. **Stripe not loading**: Check your publishable key
2. **Payment failing**: Verify your secret key in backend
3. **CORS issues**: Ensure backend allows frontend domain
4. **Cart not found**: Verify cart ID in URL query parameter
