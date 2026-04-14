'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const accentClasses = {
  primary: {
    badge: 'bg-primary-100 text-primary-700',
  },
  green: {
    badge: 'bg-green-100 text-green-700',
  },
  orange: {
    badge: 'bg-orange-100 text-orange-700',
  },
} as const;

export default function RoleShell({
  title,
  accent,
  children,
}: {
  title: string;
  accent: keyof typeof accentClasses;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 gap-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-600 truncate max-w-[14rem]">
                Welcome, {user?.full_name || '-'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${accentClasses[accent].badge}`}>
                {user?.role || '-'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
