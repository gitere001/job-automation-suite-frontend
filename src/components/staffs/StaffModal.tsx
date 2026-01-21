import React, { useState, useEffect } from 'react';

export interface Staff {
  id?: number;
  name: string;
  email: string;
  role: 'waiter' | 'supervisor' | 'manager' | 'finance' | 'store';
  status: 'active' | 'inactive' | 'suspended';
}

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: Omit<Staff, 'id'>) => Promise<void>;
  staff?: Staff | null;
  isEditing?: boolean;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  onSave,
  staff,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Omit<Staff, 'id'>>({
    name: '',
    email: '',
    role: 'waiter',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        role: staff.role,
        status: staff.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'waiter',
        status: 'active'
      });
    }
  }, [staff, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Staff['role'] })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="waiter">Waiter</option>
                <option value="supervisor">Supervisor</option>
                <option value="finance">Finance</option>
                <option value="store">Store</option>
              </select>
            </div>

            {isEditing && (
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Staff['status'] })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Add Staff')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};