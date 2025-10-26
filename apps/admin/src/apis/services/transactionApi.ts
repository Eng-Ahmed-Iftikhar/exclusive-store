import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';

// ===== TYPES =====

export enum TransactionType {
  ORDER_PAYMENT = 'order_payment',
  REFUNDED = 'refunded',
  PARTIAL_REFUND = 'partial_refund',
  FEE = 'fee',
  ADJUSTMENT = 'adjustment',
  COMMISSION = 'commission',
  CHARGEBACK = 'chargeback',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PROCESSING = 'processing',
}

export enum PaymentMethod {
  CARD = 'card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
  CRYPTOCURRENCY = 'cryptocurrency',
  CASH = 'cash',
  OTHER = 'other',
}

export interface Transaction {
  id: string;
  orderId?: string;
  userId?: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description: string;
  reference?: string;
  metadata?: any;
  paymentMethod?: PaymentMethod;
  paymentMethodDetails?: any;
  processingFee?: number;
  platformFee?: number;
  netAmount: number;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: string;
    orderNumber: string;
    total: number;
    subtotal?: number;
    shippingCost?: number;
    tax?: number;
    status: string;
    guestUserInfo?: string;
    isGuestOrder?: boolean;
    user?: {
      id: string;
      name: string;
      email: string;
    };
    items?: Array<{
      id: string;
      quantity: number;
      price: number;
      variant?: {
        id: string;
        name: string;
        product?: {
          id: string;
          name: string;
        };
      };
    }>;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TransactionListResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    type?: TransactionType;
    status?: TransactionStatus;
    paymentMethod?: PaymentMethod;
    search?: string;
    dateRange?: {
      from: string;
      to: string;
    };
  };
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  paymentMethod?: PaymentMethod;
  userId?: string;
  orderId?: string;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'amount' | 'processedAt';
  sortOrder?: 'asc' | 'desc';
}

// ===== API SLICE =====

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    // Get all transactions with filters and pagination
    getTransactions: builder.query<
      TransactionListResponse,
      TransactionQueryParams
    >({
      query: (params) => ({
        url: '/transactions',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.transactions.map(({ id }) => ({
                type: 'Transaction' as const,
                id,
              })),
              { type: 'Transaction', id: 'LIST' },
            ]
          : [{ type: 'Transaction', id: 'LIST' }],
    }),

    // Get transaction by ID
    getTransactionById: builder.query<Transaction, string>({
      query: (id) => `/transactions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transaction', id }],
    }),

    // Get transaction statistics
    getTransactionStats: builder.query<any, void>({
      query: () => '/transactions/stats',
    }),

    // Export transactions as CSV
    exportTransactionsCSV: builder.mutation<void, TransactionQueryParams>({
      query: (params) => ({
        url: '/transactions/export/csv',
        method: 'GET',
        params,
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `transactions_${
            new Date().toISOString().split('T')[0]
          }.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
      }),
    }),

    // Download invoice PDF
    downloadInvoice: builder.mutation<void, string>({
      query: (transactionId) => ({
        url: `/transactions/${transactionId}/invoice`,
        method: 'GET',
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice_${transactionId.slice(-8)}_${
            new Date().toISOString().split('T')[0]
          }.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetTransactionStatsQuery,
  useExportTransactionsCSVMutation,
  useDownloadInvoiceMutation,
} = transactionApi;
