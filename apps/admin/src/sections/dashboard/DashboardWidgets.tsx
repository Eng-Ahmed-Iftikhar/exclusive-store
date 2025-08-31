import React from 'react';

interface DashboardWidgetsProps {
  data: any;
  theme: 'light' | 'dark';
}

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ data, theme }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Low Stock Items */}
      <div
        className={`rounded-2xl border p-6 ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          Low Stock Items
        </h3>
        <div className="space-y-3">
          {(data.lowStockItems || []).slice(0, 3).map((item: any) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'
              }`}
            >
              <div>
                <p
                  className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {item.item?.name || 'Unknown Item'}
                </p>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  SKU: {item.item?.sku || 'N/A'}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.quantity <= 5
                    ? 'bg-red-50 text-red-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {item.quantity} left
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Reviews */}
      <div
        className={`rounded-2xl border p-6 ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          Pending Reviews
        </h3>
        <div className="text-center">
          <div
            className={`text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {data.pendingReviews || 0}
          </div>
          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            reviews awaiting approval
          </p>
        </div>
      </div>

      {/* Active Flash Sales */}
      <div
        className={`rounded-2xl border p-6 ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}
      >
        <h3
          className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          Active Flash Sales
        </h3>
        <div className="text-center">
          <div
            className={`text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {data.activeFlashSales || 0}
          </div>
          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            ongoing promotions
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
