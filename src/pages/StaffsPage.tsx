import { useState, useEffect } from 'react';
import { StaffTableSkeleton } from '../components/staffs/Skeleton';
import { ErrorComponent } from '../components/staffs/ErrorComponent';
import { EmptyState } from '../components/staffs/EmptyState';
import { StaffModal } from '../components/staffs/StaffModal';
import type { Staff } from '../components/staffs/StaffModal';
import toast from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;

interface ApiStaff {
  id: number;
  name: string;
  email: string;
  role: 'waiter' | 'supervisor' | 'manager' | 'finance' | 'store';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

function StaffsPage() {
  const [staff, setStaff] = useState<ApiStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<ApiStaff | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Row-specific loading states
  const [resetingPasswordId, setResetingPasswordId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiUrl}/api/v1/admins/branch-staff`, {
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch staff');

      const data = await response.json();
      setStaff(data.staff || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(member => {
    const roleMatch = roleFilter === 'all' || member.role === roleFilter;
    const statusMatch = statusFilter === 'all' || member.status === statusFilter;
    return roleMatch && statusMatch;
  });

  const handleAddStaff = async (staffData: Omit<Staff, 'id'>) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/admins/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(staffData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Show exact backend error
        toast.error(data?.message || 'Failed to add staff');
        return;
      }

      // Success
      toast.success(data.message || 'Staff added successfully');
      await fetchStaff();

    } catch (error) {
      // Network or unexpected error
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    }
  };


  const handleEditStaff = async (staffData: Omit<Staff, 'id'>) => {
    if (!editingStaff) return;

    try {
      const response = await fetch(`${apiUrl}/api/v1/admins/update/${editingStaff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(staffData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Show exact error message from backend
        toast.error(data?.message || 'Failed to update staff');
        return;
      }

      // Success
      toast.success('Staff updated successfully');
      await fetchStaff();
      setIsModalOpen(false);
      setEditingStaff(null);

    } catch (error) {
      // Network or unexpected error
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    }
  };


  const handleDeleteStaff = async (staffId: number) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      setDeletingId(staffId);
      const response = await fetch(`${apiUrl}/api/v1/admins/delete/${staffId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        // Show exact error message from backend
        toast.error(data?.message || 'Failed to delete staff');
        return;
      }
      await fetchStaff();
      if (editingStaff?.id === staffId) {
        setEditingStaff(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  const handleResetPassword = async (staffId: number) => {
    if (!confirm('Are you sure you want to reset this staff member\'s password?')) return;

    try {
      setResetingPasswordId(staffId);
      const response = await fetch(`${apiUrl}/api/v1/admins/reset-password/${staffId}`, {
        method: 'PUT',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        // Show exact error message from backend
        toast.error(data?.message || 'Failed to reset password');
        return;
      }
      toast.success('Password reset successfully');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setResetingPasswordId(null);
    }
  };

  const openEditModal = (staff: ApiStaff) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  if (loading) return <StaffTableSkeleton />;
  if (error) return <ErrorComponent message={error} onRetry={fetchStaff} />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Add Staff
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          <option value="all">All Roles</option>
          <option value="waiter">Waiter</option>
          <option value="supervisor">Supervisor</option>
          <option value="finance">Finance</option>
          <option value="store">Store</option>
          <option value="manager">Manager</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {filteredStaff.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.status === 'active' ? 'bg-green-100 text-green-800' :
                        member.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 text-center">
                      <button
                        onClick={() => openEditModal(member)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleResetPassword(member.id)}
                        className="text-orange-600 hover:text-orange-900 text-sm"
                      >
                        {resetingPasswordId === member.id ? 'Resetting...' : 'Reset Password'}
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(member.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        {deletingId === member.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <StaffModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={editingStaff ? handleEditStaff : handleAddStaff}
        staff={editingStaff}
        isEditing={!!editingStaff}
      />
    </div>
  );
}

export default StaffsPage;
