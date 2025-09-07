import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCreateResourceMutation } from '@/apis/services/resourceApi';
import { FiSave, FiX } from 'react-icons/fi';

interface CreateResourceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const CreateResourceForm: React.FC<CreateResourceFormProps> = ({
  onSuccess,
  onCancel,
  isSubmitting,
  setIsSubmitting,
}) => {
  const { theme } = useSelector((state: RootState) => state.ui);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
  });

  const [createResource] = useCreateResourceMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createResource({
        name: formData.name,
        displayName: formData.displayName,
        description: formData.description,
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to create resource:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <div
        className={`rounded-2xl border shadow-xl ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Form Header */}
        <div
          className={`px-8 py-6 border-b ${
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Resource Details
          </h2>
          <p
            className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Fill in the details below to create a new resource
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-2">
            <label
              className={`block text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Resource Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:bg-slate-600 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500'
              } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
              placeholder="e.g., users, orders, products"
            />
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Use lowercase with underscores (e.g., users, orders, products)
            </p>
          </div>

          <div className="space-y-2">
            <label
              className={`block text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Display Name *
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:bg-slate-600 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500'
              } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
              placeholder="e.g., Users, Orders, Products"
            />
          </div>

          <div className="space-y-2">
            <label
              className={`block text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:bg-slate-600 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500'
              } focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
              placeholder="Describe what this resource represents..."
            />
          </div>

          {/* Actions */}
          <div
            className={`flex items-center justify-end gap-4 pt-8 border-t ${
              theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
            }`}
          >
            <button
              type="button"
              onClick={onCancel}
              className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white border border-slate-600 hover:border-slate-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <FiSave
                className={`w-4 h-4 ${
                  isSubmitting
                    ? 'animate-spin'
                    : 'group-hover:scale-110 transition-transform duration-200'
                }`}
              />
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResourceForm;
