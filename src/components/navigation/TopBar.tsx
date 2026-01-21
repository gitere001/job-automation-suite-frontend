import { useState } from 'react';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { unsetAdmin } from '../../features/auth/profileSlice';
import { ChangePasswordModal } from './ChangePasswordModal'; // Add this import

const apiUrl = import.meta.env.VITE_API_URL;

const TopBar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // Add this state

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { admin } = useSelector((state: RootState) => state.auth);

  // Logout function
  const signOut = async () => {
    setIsSigningOut(true);
    try {
      await fetch(`${apiUrl}/api/v1/auth/logout`, { method: 'POST', credentials: 'include' });
      dispatch(unsetAdmin());
      toast.success('You have been signed out');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  // Add this function to handle Settings click
  const handleSettingsClick = () => {
    setIsPasswordModalOpen(true);
    setProfileOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-2"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Notifications</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">Low stock alert: Chicken breast running low</p>
                      <p className="text-xs text-red-600 mt-1">5 minutes ago</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">New order #1234 received</p>
                      <p className="text-xs text-blue-600 mt-1">10 minutes ago</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800">Table 5 payment completed</p>
                      <p className="text-xs text-green-600 mt-1">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button className="text-sm text-[#be212c] hover:text-[#a01d26] font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <UserCircleIcon className="h-8 w-8" />
              <ChevronDownIcon className="ml-1 h-4 w-4" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  {/* Admin Info */}
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    {isSigningOut ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ) : (
                      <>
                        <p className="font-medium">{admin?.name}</p>
                        <p className="text-gray-500">{admin?.role}</p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleSettingsClick}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Settings
                  </button>

                  <button
                    onClick={signOut}
                    disabled={isSigningOut}
                    className="w-full border-t border-gray-200 block px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                  >
                    {isSigningOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {(profileOpen || notificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setProfileOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}

      {/* Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </header>
  );
};

export default TopBar;