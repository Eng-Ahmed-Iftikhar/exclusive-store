# Real-Time Notification System with WebSockets

## Overview

This is a comprehensive real-time notification system built with NestJS, Socket.io, and Prisma. It provides live notifications for admin users about important events like orders, products, payments, users, and system activities.

## Architecture

### Components

1. **NotificationGateway** (`notification.gateway.ts`)

   - WebSocket server using Socket.io
   - Handles client connections/disconnections
   - Manages user authentication and room subscriptions
   - Emits real-time notifications to connected clients

2. **NotificationService** (`notification.service.ts`)

   - Database operations for notifications
   - CRUD operations with pagination and filtering
   - Helper methods for creating specific notification types

3. **NotificationEventService** (`notification-event.service.ts`)

   - Event-based notification triggers
   - Helper methods for common notification scenarios
   - Emits events that are captured by the listener

4. **NotificationListener** (`notification.listener.ts`)

   - Listens to notification events
   - Persists notifications to database
   - Sends notifications via WebSocket gateway

5. **NotificationController** (`notification.controller.ts`)
   - REST API endpoints for notifications
   - Protected by JWT authentication

## Features

### Notification Types

- **Order**: New orders, status changes, cancellations
- **Product**: New products, updates, stock alerts
- **Payment**: Payment received, failed, refunded
- **User**: New registrations, email verifications
- **Review**: New product reviews
- **Stock**: Low stock, out of stock alerts
- **System**: System errors and warnings
- **Security**: Security alerts and suspicious activities

### Notification Categories

- **Info**: General information
- **Success**: Successful operations
- **Warning**: Warning messages
- **Error**: Error notifications
- **Critical**: Critical issues requiring immediate attention

### Priority Levels

- **Low**: Can be reviewed later
- **Normal**: Standard notifications
- **High**: Important, should be addressed soon
- **Urgent**: Critical, requires immediate attention

## WebSocket Events

### Client → Server

#### `authenticate`

Authenticate the WebSocket connection

```typescript
socket.emit('authenticate', {
  userId: 'user-id',
  role: 'admin', // or 'superadmin'
});
```

#### `get-notifications`

Fetch notifications with pagination

```typescript
socket.emit(
  'get-notifications',
  {
    page: 1,
    limit: 20,
  },
  (response) => {
    console.log(response.data); // Array of notifications
  }
);
```

#### `mark-as-read`

Mark specific notifications as read

```typescript
socket.emit('mark-as-read', {
  notificationIds: ['notif-1', 'notif-2'],
});
```

#### `mark-all-as-read`

Mark all notifications as read

```typescript
socket.emit('mark-all-as-read');
```

### Server → Client

#### `notification`

Receive a new notification

```typescript
socket.on('notification', (notification) => {
  console.log('New notification:', notification);
  // Display notification in UI
});
```

#### `unread-count`

Receive updated unread count

```typescript
socket.on('unread-count', (data) => {
  console.log('Unread count:', data.unreadCount);
  // Update badge in UI
});
```

## REST API Endpoints

All endpoints require JWT authentication.

### `GET /notifications`

Get paginated notifications with filters

```typescript
Query parameters:
- page: number (default: 1)
- limit: number (default: 20)
- type: NotificationType
- category: NotificationCategory
- isRead: boolean
- priority: NotificationPriority
```

### `GET /notifications/stats`

Get notification statistics

### `GET /notifications/unread-count`

Get unread notification count

### `GET /notifications/:id`

Get specific notification

### `POST /notifications/mark-as-read`

Mark notifications as read

```typescript
Body: {
  notificationIds: string[]
}
```

### `POST /notifications/mark-all-as-read`

Mark all notifications as read

### `DELETE /notifications/:id`

Delete a notification

### `POST /notifications/delete-multiple`

Delete multiple notifications

## Integration with Modules

### Orders Module

**Order Created**

```typescript
this.notificationEventService.notifyOrderCreated(order.id, order.orderNumber, customerName);
```

**Order Status Changed**

```typescript
this.notificationEventService.notifyOrderStatusChanged(orderId, orderNumber, oldStatus, newStatus);
```

**Order Cancelled**

```typescript
this.notificationEventService.notifyOrderCancelled(orderId, orderNumber, reason);
```

**Payment Received**

```typescript
this.notificationEventService.notifyPaymentReceived(orderId, orderNumber, amount, currency);
```

**Payment Failed**

```typescript
this.notificationEventService.notifyPaymentFailed(orderId, orderNumber, reason);
```

### Products Module

**Product Created**

```typescript
this.notificationEventService.notifyProductCreated(productId, productName);
```

**Low Stock Alert**

```typescript
this.notificationEventService.notifyLowStock(productId, productName, quantity);
```

**Out of Stock Alert**

```typescript
this.notificationEventService.notifyOutOfStock(productId, productName);
```

### Auth Module

**User Registered**

```typescript
this.notificationEventService.notifyUserRegistered(userId, userName, userEmail);
```

**User Verified**

```typescript
this.notificationEventService.notifyUserVerified(userId, userName, userEmail);
```

### Reviews Module

**New Review**

```typescript
this.notificationEventService.notifyNewReview(reviewId, productId, productName, rating, userName);
```

## Frontend Integration (Coming Soon)

### Installation

```bash
npm install socket.io-client
```

### Basic Setup

```typescript
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3000/notifications', {
  auth: {
    token: 'your-jwt-token',
  },
});

// Authenticate
socket.emit('authenticate', {
  userId: 'current-user-id',
  role: 'admin',
});

// Listen for notifications
socket.on('notification', (notification) => {
  // Display notification in UI
  console.log('New notification:', notification);
});

// Listen for unread count updates
socket.on('unread-count', (data) => {
  // Update badge
  console.log('Unread:', data.unreadCount);
});
```

### React Hook Example

```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useNotifications(token: string, userId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const newSocket = io('http://localhost:3000/notifications', {
      auth: { token },
    });

    newSocket.emit('authenticate', { userId, role: 'admin' });

    newSocket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    newSocket.on('unread-count', (data) => {
      setUnreadCount(data.unreadCount);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, userId]);

  const markAsRead = (notificationIds: string[]) => {
    socket?.emit('mark-as-read', { notificationIds });
  };

  const markAllAsRead = () => {
    socket?.emit('mark-all-as-read');
  };

  return {
    socket,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
```

## Database Schema

```prisma
model Notification {
  id            String    @id @default(cuid())
  type          String    // order, user, product, payment, review, stock, system, security
  category      String    // info, success, warning, error, critical
  title         String
  message       String
  actionUrl     String?   // Link to related resource
  actionLabel   String?   // Button label
  recipientId   String?   // Specific user (null = broadcast)
  recipientRole String?   // Target role
  isRead        Boolean   @default(false)
  readAt        DateTime?
  priority      String    @default("normal") // low, normal, high, urgent
  metadata      Json?     // Additional data
  icon          String?   // Icon identifier
  entityType    String?   // Related entity type
  entityId      String?   // Related entity ID
  expiresAt     DateTime? // Auto-archive date
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  recipient     User?     @relation("NotificationRecipient", fields: [recipientId], references: [id], onDelete: Cascade)

  @@index([recipientId, isRead])
  @@index([type, category])
  @@index([createdAt])
  @@index([priority])
  @@map("notifications")
}
```

## Environment Variables

```env
# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# WebSocket configuration (optional)
WS_PORT=3000
WS_PATH=/socket.io
```

## Testing WebSocket Connection

### Using Postman

1. Create a new WebSocket request
2. Connect to: `ws://localhost:3000/notifications`
3. Add auth header: `{ "token": "your-jwt-token" }`
4. Send authenticate event with user data

### Using Browser Console

```javascript
const socket = io('http://localhost:3000/notifications', {
  auth: { token: 'your-jwt-token' },
});

socket.emit('authenticate', {
  userId: 'user-123',
  role: 'admin',
});

socket.on('notification', (notification) => {
  console.log('Notification:', notification);
});

socket.on('unread-count', (data) => {
  console.log('Unread:', data.unreadCount);
});
```

## Next Steps

1. ✅ Backend WebSocket gateway implementation
2. ✅ Database schema and service layer
3. ✅ Integration with Orders module
4. ✅ Integration with Products module
5. ⏳ Integration with Auth module
6. ⏳ Integration with Reviews module
7. ⏳ Frontend notification component
8. ⏳ Frontend WebSocket integration
9. ⏳ Push notifications (browser)
10. ⏳ Email notifications for critical alerts

## Security Considerations

- WebSocket connections require JWT authentication
- Users can only see notifications intended for them or broadcast messages
- Role-based access control for notification targeting
- Connection tracking and rate limiting (to be implemented)
- Secure token transmission via auth handshake

## Performance Optimization

- Efficient room-based broadcasting (user-specific and role-specific)
- Pagination for historical notifications
- Indexed database queries
- Automatic cleanup of expired notifications
- Connection pooling and socket management

## Troubleshooting

### WebSocket Not Connecting

- Check CORS configuration in gateway
- Verify JWT token is valid
- Ensure WebSocket port is not blocked
- Check server logs for connection errors

### Notifications Not Appearing

- Verify authentication was successful
- Check user is in correct room
- Verify notification targeting (recipientId/recipientRole)
- Check browser console for WebSocket errors

### High Memory Usage

- Run cleanup task for expired notifications
- Implement notification archiving
- Monitor connected clients count
- Consider implementing connection limits
