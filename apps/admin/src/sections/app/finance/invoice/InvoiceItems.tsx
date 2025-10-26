import React from 'react';
import { Transaction } from '@/apis/services/transactionApi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface InvoiceItemsProps {
  transaction: Transaction;
}

const InvoiceItems: React.FC<InvoiceItemsProps> = ({ transaction }) => {
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const items = transaction.order?.items || [];

  return (
    <div className="mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Item</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.variant?.product?.name ||
                        item.variant?.name ||
                        'Product'}
                    </p>
                    {item.variant?.name && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.variant.name}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.price, transaction.currency)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(
                    item.price * item.quantity,
                    transaction.currency
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceItems;
