
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,

  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const Sidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) => {
  const location = useLocation();

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Applications',
      href: '/dashboard/applications',
      icon: DocumentTextIcon,
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex flex-col w-full">
          <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4">

                <span className="ml-2 text-xl font-bold text-[#be212c]">
                  J
                </span>

            </div>

            {/* Collapse Button */}
            <div className="flex justify-end px-4 mt-4">
              <button
                onClick={onToggleCollapse}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                    isActive(item.href)
                      ? 'bg-[#fee5e7] text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`flex-shrink-0 h-5 w-5 ${
                      isActive(item.href) ? 'text-[#be212c]' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {!isCollapsed && <span className="ml-2">{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src={import.meta.env.VITE_QUIVER_LOGO}
                alt="The Quiver"
              />
              <span className="ml-2 text-xl font-bold text-[#be212c]">
                The Quiver
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  isActive(item.href)
                    ? 'bg-[#fee5e7] text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`flex-shrink-0 h-5 w-5 ${
                    isActive(item.href) ? 'text-[#be212c]' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;