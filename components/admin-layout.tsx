'use client';

import { initializeFirebaseClient } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    FaBars,
    FaBox,
    FaCog,
    FaHome,
    FaImage,
    FaPalette,
    FaShoppingCart,
    FaSignOutAlt,
    FaTimes,
    FaUsers
} from 'react-icons/fa';
import AdminAuthStatus from './admin-auth-status';
import AdminProtect from './admin-protect';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

const navigationItems: NavItem[] = [
  {
    href: '/admin',
    icon: <FaHome className="w-5 h-5" />,
    label: 'Dashboard'
  },
  {
    href: '/admin/produtos',
    icon: <FaBox className="w-5 h-5" />,
    label: 'Produtos'
  },
  {
    href: '/admin/cores',
    icon: <FaPalette className="w-5 h-5" />,
    label: 'Cores'
  },
  {
    href: '/admin/banners',
    icon: <FaImage className="w-5 h-5" />,
    label: 'Banners'
  },
  {
    href: '/admin/pedidos',
    icon: <FaShoppingCart className="w-5 h-5" />,
    label: 'Pedidos',
    disabled: true
  },
  {
    href: '/admin/clientes',
    icon: <FaUsers className="w-5 h-5" />,
    label: 'Clientes',
    disabled: true
  },
  {
    href: '/admin/configuracoes',
    icon: <FaCog className="w-5 h-5" />,
    label: 'Configurações',
    disabled: true
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const { clientAuth } = initializeFirebaseClient();
    
    if (!clientAuth) {
      console.error('Auth não está inicializado');
      return;
    }
    
    try {
      await signOut(clientAuth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <AdminProtect>
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <div className="flex items-center justify-between h-16 px-6 bg-teal-600">
            <h1 className="text-xl font-bold text-white">Admin Girafa de Papel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-200"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-8 h-full overflow-y-auto pb-20">
            <div className="px-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.disabled ? '#' : item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${item.disabled 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : isActiveRoute(item.href)
                        ? 'bg-teal-100 text-teal-800 border-r-4 border-teal-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={() => {
                    if (!item.disabled) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                  {item.disabled && (
                    <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Em breve
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="px-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 hover:text-red-900 transition-colors"
                >
                  <FaSignOutAlt className="w-5 h-5 mr-3" />
                  Sair
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 min-h-screen bg-gray-50 lg:ml-64">
          {/* Top bar */}
          <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between h-16 px-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <FaBars className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-4 ml-auto">
                <AdminAuthStatus />
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="p-6 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminProtect>
  );
}
