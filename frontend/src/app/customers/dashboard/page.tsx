'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  Users, FileText, CreditCard, BarChart3, Settings, LogOut,
  TrendingUp, Package, Activity
} from 'lucide-react';

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, hasRole, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!hasRole(['customer'])) {
      router.push('/login');
    }
  }, [isAuthenticated, hasRole, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isAuthenticated || !hasRole(['customer'])) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Customer Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.full_name}</span>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-primary-100">Manage your subscription, invoices, and payments</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FileText className="h-8 w-8 text-blue-600" />}
            title="Active Invoice"
            value="Rp 350.000"
            subtitle="Due in 5 days"
          />
          <StatCard
            icon={<CreditCard className="h-8 w-8 text-green-600" />}
            title="Total Paid"
            value="Rp 2.450.000"
            subtitle="This year"
          />
          <StatCard
            icon={<Package className="h-8 w-8 text-purple-600" />}
            title="Current Plan"
            value="Premium 50Mbps"
            subtitle="Active until Dec 2026"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton icon={<FileText />} label="View Invoices" />
            <ActionButton icon={<CreditCard />} label="Make Payment" />
            <ActionButton icon={<Activity />} label="Usage History" />
            <ActionButton icon={<Settings />} label="Account Settings" />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">{icon}</div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition">
      <div className="h-6 w-6 text-gray-600 mr-2">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
