import React from 'react';
import { FiEdit } from 'react-icons/fi';

interface OrderNotesSectionProps {
  notes?: string;
  internalNotes?: string;
}

const OrderNotesSection: React.FC<OrderNotesSectionProps> = ({
  notes,
  internalNotes,
}) => {
  if (!notes && !internalNotes) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiEdit className="w-5 h-5" />
          Notes
        </h2>
      </div>
      <div className="p-6 space-y-4">
        {notes && (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer Notes
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{notes}</p>
          </div>
        )}
        {internalNotes && (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Internal Notes
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {internalNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderNotesSection;
