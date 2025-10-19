import React, { useState } from 'react';
import { PermissionGuard } from '@/components/PermissionGuard';
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiRefreshCw,
  FiDownload,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from 'react-icons/fi';
import DataPagination from '@/components/data-pagination';

// Mock data interface
interface OrderHistory {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: 'delivered' | 'cancelled' | 'refunded' | 'returned';
  paymentStatus: 'paid' | 'refunded' | 'failed';
  orderDate: string;
  deliveryDate: string;
  items: number;
  shippingAddress: string;
  refundAmount?: number;
  returnReason?: string;
}

interface OrderHistoryTableProps {
  onViewOrder: (orderId: string) => void;
  onRefundOrder: (orderId: string) => void;
}

const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({
  onViewOrder,
  onRefundOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [limit, setLimit] = useState(10);

  // Mock data - replace with actual API call
  const mockOrders: OrderHistory[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      totalAmount: 299.99,
      status: 'delivered',
      paymentStatus: 'paid',
      orderDate: '2024-01-10T10:30:00Z',
      deliveryDate: '2024-01-15T14:20:00Z',
      items: 3,
      shippingAddress: '123 Main St, New York, NY 10001',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      totalAmount: 149.5,
      status: 'refunded',
      paymentStatus: 'refunded',
      orderDate: '2024-01-08T14:20:00Z',
      deliveryDate: '2024-01-12T10:15:00Z',
      items: 1,
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
      refundAmount: 149.5,
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      totalAmount: 89.99,
      status: 'cancelled',
      paymentStatus: 'refunded',
      orderDate: '2024-01-05T09:15:00Z',
      deliveryDate: '',
      items: 2,
      shippingAddress: '789 Pine St, Chicago, IL 60601',
      refundAmount: 89.99,
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      customerName: 'Alice Brown',
      customerEmail: 'alice@example.com',
      totalAmount: 199.99,
      status: 'returned',
      paymentStatus: 'refunded',
      orderDate: '2024-01-03T16:45:00Z',
      deliveryDate: '2024-01-08T11:30:00Z',
      items: 1,
      shippingAddress: '321 Elm St, Miami, FL 33101',
      refundAmount: 199.99,
      returnReason: 'Product defect',
    },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'returned':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDateRangeFilter = (orderDate: string) => {
    const order = new Date(orderDate);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - order.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 7) return 'last_week';
    if (daysDiff <= 30) return 'last_month';
    if (daysDiff <= 90) return 'last_quarter';
    return 'older';
  };

  // Filter orders based on search and filters
  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    const matchesDateRange =
      dateRange === 'all' || getDateRangeFilter(order.orderDate) === dateRange;

    return matchesSearch && matchesStatus && matchesPayment && matchesDateRange;
  });

  // Paginate filtered results
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredOrders.length / limit);

  const renderPagination = () => {
    if (filteredOrders.length === 0) return null;

    return (
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={filteredOrders.length}
        itemsPerPage={limit}
      />
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Order History
            </h2>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
              Complete history of all orders
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 pb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </form>
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
              <option value="returned">Returned</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="last_week">Last Week</option>
              <option value="last_month">Last Month</option>
              <option value="last_quarter">Last Quarter</option>
              <option value="older">Older</option>
            </select>
          </div>
        </div>
      </div>

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
                  Delivery Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order: OrderHistory) => (
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
                          {order.items} item{order.items > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {order.customerName}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.customerEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(order.totalAmount)}
                        </span>
                        {order.refundAmount && (
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Refunded: {formatCurrency(order.refundAmount)}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                    {order.returnReason && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {order.returnReason}
                      </p>
                    )}
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
                      <FiCalendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(order.orderDate)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(order.deliveryDate)}
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
                      {order.status === 'delivered' &&
                        order.paymentStatus === 'paid' && (
                          <PermissionGuard action="edit" subject="orders">
                            <button
                              onClick={() => onRefundOrder(order.id)}
                              className="p-2 rounded-lg transition-colors text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/30"
                              title="Process Refund"
                            >
                              <FiRefreshCw className="w-4 h-4" />
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

      {/* Pagination */}
      <div className="px-6 pb-6">{renderPagination()}</div>
    </div>
  );
};

export default OrderHistoryTable;
