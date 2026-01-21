// App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import StaffsPage from './pages/StaffsPage';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './app/store';
import { fetchAdminProfile, selectAuthError, unsetAdmin } from './features/auth/profileSlice';
import toast from 'react-hot-toast';

function App() {
  // Wrap the main content in Router
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toastShown = useRef(false); // Prevent multiple toasts
  const location = useLocation();

  const { isAuthenticated, isLoading, admin } = useSelector((state: RootState) => state.auth);
  const { error, isAuthError } = useSelector(selectAuthError);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch admin profile if not authenticated
  useEffect(() => {
    if (!isLoggingOut && !isAuthenticated && !isLoading && !admin && location.pathname !== '/') {
      dispatch(fetchAdminProfile());
    }
  }, [dispatch, isAuthenticated, isLoading, admin, isLoggingOut, location.pathname]);

  // Handle auth errors
  useEffect(() => {
    if (isAuthError && !toastShown.current && !isLoggingOut && location.pathname !== '/') {
      toast.error(error || 'Unauthorized! Please login.');
      dispatch(unsetAdmin());
      navigate('/');
      toastShown.current = true; // mark toast as shown
    }
  }, [isAuthError, error, dispatch, navigate, isLoggingOut, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/*" element={<LayoutRoutes />} />
    </Routes>
  );
}

// LayoutRoutes handles nested protected routes
function LayoutRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/inventory/stock" element={<Dashboard />} />
        <Route path="/dashboard/staff" element={<StaffsPage />} />
        {/* Add other protected routes here */}
      </Routes>
    </Layout>
  );
}

export default App;
