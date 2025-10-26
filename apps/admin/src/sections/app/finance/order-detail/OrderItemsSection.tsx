import React from 'react';
import { FiPackage } from 'react-icons/fi';
import { AdminOrderItem } from '@/apis/services/orderApi';

interface OrderItemsSectionProps {
  items: AdminOrderItem[];
  totalItems: number;
}

const OrderItemsSection: React.FC<OrderItemsSectionProps> = ({
  items,
  totalItems,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiPackage className="w-5 h-5" />
          Order Items ({totalItems})
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-lg"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <FiPackage className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {item.variant.product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.variant.name} • SKU: {item.variant.sku}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(item.totalPrice)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(item.price)} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderItemsSection;
