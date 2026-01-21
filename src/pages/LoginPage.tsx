import { useState } from 'react';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;
import { useDispatch } from 'react-redux';
import { setAdmin } from '../features/auth/profileSlice';
import type { AppDispatch } from '../app/store';



// Define the expected response structure
interface LoginResponse {
  admin: {
    id: string;
    email: string;
    name: string;

    // Add other properties as needed
  };
  // Add other response properties if needed
}

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>(); // Use typed dispatch
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Ensure cookies are sent
      });

      const data: LoginResponse = await response.json();
      console.log("login data", data);

      if (response.ok) {
        toast.success('Login successful');
        dispatch(setAdmin(data.admin));
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      {/* Background Image - Fixed path and reduced opacity of overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url('/bg.webp')` }}
      ></div>

      <div className="relative w-full max-w-md z-20">
        {/* Login Card */}
        <div className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            {/* Logo */}
            <div className="mb-8">
              <img
                src={import.meta.env.VITE_QUIVER_LOGO}
                alt="The Quiver"
                className="h-16 w-auto mx-auto"
              />
              <h2 className="mt-4 text-xl font-bold text-gray-900">Welcome back</h2>
              <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be212c] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be212c] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl text-sm font-medium text-white bg-[#be212c] hover:bg-[#a01d26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#be212c] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;