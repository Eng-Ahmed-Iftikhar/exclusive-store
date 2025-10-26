import React from 'react';
import { FiMapPin } from 'react-icons/fi';

interface ShippingAddressSectionProps {
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  shipping?: {
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
  };
}

const ShippingAddressSection: React.FC<ShippingAddressSectionProps> = ({
  shippingAddress,
  shipping,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FiMapPin className="w-5 h-5" />
          Shipping Information
        </h2>
      </div>
      <div className="p-6 space-y-4">
        {/* Address Section */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Delivery Address
          </p>
          <p className="text-gray-900 dark:text-white">
            {shippingAddress.address}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {shippingAddress.city}, {shippingAddress.state}{' '}
            {shippingAddress.postalCode}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {shippingAddress.country}
          </p>
        </div>

        {/* Shipping Details */}
        {shipping &&
          (shipping.trackingNumber ||
            shipping.carrier ||
            shipping.estimatedDelivery ||
            shipping.actualDelivery) && (
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tracking Details
              </p>
              {shipping.trackingNumber && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tracking Number
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {shipping.trackingNumber}
                  </p>
                </div>
              )}
              {shipping.carrier && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Carrier
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {shipping.carrier}
                  </p>
                </div>
              )}
              {shipping.estimatedDelivery && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estimated Delivery
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(shipping.estimatedDelivery).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>
              )}
              {shipping.actualDelivery && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Actual Delivery
                  </p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    {new Date(shipping.actualDelivery).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default ShippingAddressSection;
