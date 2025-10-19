import React, { useState } from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import {
  FiEye,
  FiEdit,
  FiClock,
  FiCheckCircle,
  FiPackage,
  FiUser,
  FiDollarSign,
  FiFilter,
} from 'react-icons/fi';
import TableHeader from './components/TableHeader';
import SearchAndFilters from './components/SearchAndFilters';
import PaginationControls from './components/PaginationControls';
import {
  useGetLiveOrdersQuery,
  useUpdateOrderStatusMutation,
  useMarkAsDeliveredMutation,
  AdminOrder,
  AdminOrderStatus,
  AdminPaymentStatus,
} from '@/apis/services/orderApi';

interface LiveOrdersTableProps {
  onViewOrder: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onMarkAsDelivered: (orderId: string) => void;
}

const LiveOrdersTable: React.FC<LiveOrdersTableProps> = ({
  onViewOrder,
  onUpdateStatus,
  onMarkAsDelivered,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [limit, setLimit] = useState(10);

  // RTK Query hooks
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch,
  } = useGetLiveOrdersQuery({
    page: currentPage,
    limit,
    search: searchTerm || undefined,
    status:
      statusFilter !== 'all' ? (statusFilter as AdminOrderStatus) : undefined,
    paymentStatus:
      paymentFilter !== 'all'
        ? (paymentFilter as AdminPaymentStatus)
        : undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [markAsDelivered] = useMarkAsDeliveredMutation();

  // Extract data from response
  const orders = ordersResponse?.orders || [];
  const totalPages = ordersResponse?.pagination?.totalPages || 0;
  const totalItems = ordersResponse?.pagination?.total || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus({
        id: orderId,
        data: { status: status as AdminOrderStatus },
      }).unwrap();
      onUpdateStatus(orderId, status);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      await markAsDelivered(orderId).unwrap();
      onMarkAsDelivered(orderId);
    } catch (error) {
      console.error('Error marking order as delivered:', error);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Use orders directly from API response (already filtered and paginated)
  const paginatedOrders = orders;

  // Show loading state
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
              Error Loading Orders
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Failed to load orders. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
      <TableHeader
        title="Live Orders"
        description="Orders that are not yet delivered"
      />

      <SearchAndFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Search orders, customers..."
        filters={[
          {
            key: 'status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'processing', label: 'Processing' },
              { value: 'shipped', label: 'Shipped' },
              { value: 'out_for_delivery', label: 'Out for Delivery' },
            ],
            placeholder: 'All Status',
            icon: <FiFilter className="w-4 h-4" />,
          },
          {
            key: 'payment',
            value: paymentFilter,
            onChange: setPaymentFilter,
            options: [
              { value: 'paid', label: 'Paid' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
              { value: 'refunded', label: 'Refunded' },
            ],
            placeholder: 'All Payments',
            icon: <FiFilter className="w-4 h-4" />,
          },
        ]}
      />

      {/* Table */}
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-600">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Order
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Payment
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Order Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order: AdminOrder) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {order.orderNumber}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.totalItems} item
                          {order.totalItems > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {order.customer.name}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.customer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(order.totals.total)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(order.timestamps.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <PermissionGuard action="view" subject="orders">
                        <button
                          onClick={() => onViewOrder(order.id)}
                          className="p-2 rounded-lg transition-colors text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                          title="View Order"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard action="edit" subject="orders">
                        <button
                          onClick={() =>
                            handleUpdateStatus(order.id, order.status)
                          }
                          className="p-2 rounded-lg transition-colors text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                          title="Update Status"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
                      {order.status === 'out_for_delivery' && (
                        <PermissionGuard action="edit" subject="orders">
                          <button
                            onClick={() => handleMarkAsDelivered(order.id)}
                            className="p-2 rounded-lg transition-colors text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                            title="Mark as Delivered"
                          >
                            <FiCheckCircle className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        className="px-6 pb-6"
      />
    </div>
  );
};

export default LiveOrdersTable;
