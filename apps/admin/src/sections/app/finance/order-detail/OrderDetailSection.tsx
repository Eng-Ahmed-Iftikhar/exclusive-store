import React, { useState } from 'react';
import {
  useGetOrderByIdQuery,
  useGetOrderActivitiesQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useUpdateOrderShippingMutation,
  useUpdateOrderNotesMutation,
  AdminOrderStatus,
} from '@/apis/services/orderApi';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  FiArrowLeft,
  FiEdit,
  FiX,
  FiAlertCircle,
  FiTruck,
} from 'react-icons/fi';
import OrderItemsSection from './OrderItemsSection';
import OrderSummarySection from './OrderSummarySection';
import CustomerInfoSection from './CustomerInfoSection';
import ShippingAddressSection from './ShippingAddressSection';
import PaymentInfoSection from './PaymentInfoSection';
import OrderNotesSection from './OrderNotesSection';
import OrderActivitySection from './OrderActivitySection';

interface OrderDetailSectionProps {
  orderId: string;
  onBack: () => void;
}

const OrderDetailSection: React.FC<OrderDetailSectionProps> = ({
  orderId,
  onBack,
}) => {
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<AdminOrderStatus>(
    AdminOrderStatus.PENDING
  );
  const [cancelNotes, setCancelNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId);
  const { data: activitiesData } = useGetOrderActivitiesQuery(orderId);
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [updateShipping] = useUpdateOrderShippingMutation();
  const [updateNotes] = useUpdateOrderNotesMutation();

  const handleUpdateStatus = async () => {
    try {
      await updateStatus({
        id: orderId,
        data: { status: newStatus },
      }).unwrap();
      setUpdateStatusDialogOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder({
        id: orderId,
        data: { notes: cancelNotes },
      }).unwrap();
      setCancelDialogOpen(false);
      setCancelNotes('');
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const handleUpdateShipping = async () => {
    try {
      await updateShipping({
        id: orderId,
        data: {
          trackingNumber: trackingNumber || undefined,
          carrier: carrier || undefined,
          estimatedDelivery: estimatedDelivery || undefined,
        },
      }).unwrap();
      setShippingDialogOpen(false);
      setTrackingNumber('');
      setCarrier('');
      setEstimatedDelivery('');
    } catch (error) {
      console.error('Error updating shipping:', error);
    }
  };

  const handleUpdateNotes = async () => {
    try {
      await updateNotes({
        id: orderId,
        data: {
          notes: orderNotes || undefined,
          internalNotes: internalNotes || undefined,
        },
      }).unwrap();
      setNotesDialogOpen(false);
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'processing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
          Error Loading Order
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Failed to load order details. Please try again.
        </p>
        <Button onClick={onBack}>Back to Orders</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Placed on {formatDate(order.timestamps.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
            <span
              className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPaymentStatusColor(
                order.paymentStatus
              )}`}
            >
              {order.paymentStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions Card */}
      {order.status !== 'cancelled' && order.status !== 'delivered' && (
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            <PermissionGuard action="edit" subject="order">
              <Button
                variant="outline"
                onClick={() => {
                  setNewStatus(order.status);
                  setUpdateStatusDialogOpen(true);
                }}
              >
                <FiEdit className="w-4 h-4 mr-2" />
                Update Status
              </Button>
            </PermissionGuard>
            <PermissionGuard action="edit" subject="order">
              <Button
                variant="destructive"
                onClick={() => setCancelDialogOpen(true)}
              >
                <FiX className="w-4 h-4 mr-2" />
                Cancel Order
              </Button>
            </PermissionGuard>
            <PermissionGuard action="edit" subject="order">
              <Button
                variant="outline"
                onClick={() => {
                  setTrackingNumber(order.shipping?.trackingNumber || '');
                  setCarrier(order.shipping?.carrier || '');
                  setEstimatedDelivery(order.shipping?.estimatedDelivery || '');
                  setShippingDialogOpen(true);
                }}
              >
                <FiTruck className="w-4 h-4 mr-2" />
                Update Shipping
              </Button>
            </PermissionGuard>
            <PermissionGuard action="edit" subject="order">
              <Button
                variant="outline"
                onClick={() => {
                  setOrderNotes(order.notes || '');
                  setInternalNotes(order.internalNotes || '');
                  setNotesDialogOpen(true);
                }}
              >
                <FiEdit className="w-4 h-4 mr-2" />
                Update Notes
              </Button>
            </PermissionGuard>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - Order Items, Summary & Shipping */}
        <div className="xl:col-span-8 space-y-6">
          <OrderItemsSection
            items={order.items}
            totalItems={order.totalItems}
          />
          <OrderSummarySection totals={order.totals} />
          <ShippingAddressSection
            shippingAddress={order.shippingAddress}
            shipping={order.shipping}
          />
          {activitiesData && activitiesData.activities.length > 0 && (
            <OrderActivitySection activities={activitiesData.activities} />
          )}
        </div>

        {/* Right Column - Customer, Payment, Notes */}
        <div className="xl:col-span-4 space-y-6">
          <CustomerInfoSection customer={order.customer} />
          {order.payment && <PaymentInfoSection payment={order.payment} />}
          <OrderNotesSection
            notes={order.notes}
            internalNotes={order.internalNotes}
          />
        </div>
      </div>

      {/* Update Status Dialog */}
      <Dialog
        open={updateStatusDialogOpen}
        onOpenChange={setUpdateStatusDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the current status of this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select
                value={newStatus}
                onValueChange={(value) =>
                  setNewStatus(value as AdminOrderStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AdminOrderStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <FiAlertCircle className="w-5 h-5" />
              Cancel Order
            </DialogTitle>
            <DialogDescription>
              This will cancel the order and refund the payment to the customer.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reason (Optional)</Label>
              <Textarea
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                placeholder="Enter reason for cancellation..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Keep Order
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder}>
              Cancel Order & Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Shipping Dialog */}
      <Dialog open={shippingDialogOpen} onOpenChange={setShippingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Shipping Information</DialogTitle>
            <DialogDescription>
              Update tracking and delivery information for this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tracking Number</Label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number..."
              />
            </div>
            <div>
              <Label>Carrier</Label>
              <Input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g., UPS, FedEx, DHL..."
              />
            </div>
            <div>
              <Label>Estimated Delivery</Label>
              <Input
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShippingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateShipping}>Update Shipping</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Notes</DialogTitle>
            <DialogDescription>
              Add or update notes for this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Customer Notes</Label>
              <Textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Notes visible to customer..."
                rows={3}
              />
            </div>
            <div>
              <Label>Internal Notes</Label>
              <Textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Internal notes for admin only..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNotes}>Update Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetailSection;
