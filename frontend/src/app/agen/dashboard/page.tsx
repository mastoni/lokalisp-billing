'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  Building2, Users, FileText, CreditCard, LogOut,
  TrendingUp, BarChart3, DollarSign
} from 'lucide-react';

export default function AgenDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, hasRole, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!hasRole(['agen'])) {
      router.push('/login');
    }
  }, [isAuthenticated, hasRole, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isAuthenticated || !hasRole(['agen'])) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Agen Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.full_name}</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
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
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Agent Portal</h2>
          <p className="text-green-100">Manage your customers and sales operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="h-8 w-8 text-blue-600" />}
            title="Total Customers"
            value="89"
            subtitle="+5 this month"
          />
          <StatCard
            icon={<DollarSign className="h-8 w-8 text-green-600" />}
            title="Monthly Revenue"
            value="Rp 15.450.000"
            subtitle="+12% from last month"
          />
          <StatCard
            icon={<FileText className="h-8 w-8 text-yellow-600" />}
            title="Pending Invoices"
            value="23"
            subtitle="Rp 5.750.000"
          />
          <StatCard
            icon={<TrendingUp className="h-8 w-8 text-purple-600" />}
            title="Active Subscriptions"
            value="76"
            subtitle="85% retention rate"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton icon={<Users />} label="Manage Customers" />
            <ActionButton icon={<FileText />} label="Create Invoice" />
            <ActionButton icon={<CreditCard />} label="Record Payment" />
            <ActionButton icon={<BarChart3 />} label="View Reports" />
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h3 className="text-xl font-bold mb-4">Recent Customers</h3>
          <div className="space-y-4">
            <CustomerItem
              name="Ahmad Rizki"
              plan="Premium 50Mbps"
              status="Active"
              joined="2026-04-10"
            />
            <CustomerItem
              name="Siti Nurhaliza"
              plan="Standard 20Mbps"
              status="Active"
              joined="2026-04-08"
            />
            <CustomerItem
              name="Budi Santoso"
              plan="Basic 10Mbps"
              status="Pending"
              joined="2026-04-14"
            />
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
    <button className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition">
      <div className="h-6 w-6 text-gray-600 mr-2">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}

function CustomerItem({ name, plan, status, joined }: {
  name: string;
  plan: string;
  status: string;
  joined: string;
}) {
  const statusColor = {
    Active: 'text-green-600 bg-green-50',
    Pending: 'text-yellow-600 bg-yellow-50',
    Inactive: 'text-red-600 bg-red-50',
  }[status] || 'text-gray-600 bg-gray-50';

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-1">
          <span className="text-sm font-semibold text-gray-900">{name}</span>
          <span className="text-sm text-gray-600">•</span>
          <span className="text-sm text-gray-600">{plan}</span>
        </div>
        <p className="text-sm text-gray-600">Joined: {joined}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
