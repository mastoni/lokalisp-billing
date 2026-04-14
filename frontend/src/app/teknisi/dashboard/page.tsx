'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  Wrench, Users, FileText, CheckCircle, LogOut,
  AlertTriangle, Clock, Settings
} from 'lucide-react';

export default function TeknisiDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, hasRole, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!hasRole(['teknisi'])) {
      router.push('/login');
    }
  }, [isAuthenticated, hasRole, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isAuthenticated || !hasRole(['teknisi'])) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-primary-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Teknisi Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.full_name}</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
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
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Technical Operations</h2>
          <p className="text-orange-100">Manage devices, installations, and maintenance tasks</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<AlertTriangle className="h-8 w-8 text-red-600" />}
            title="Pending Issues"
            value="12"
            subtitle="3 urgent"
          />
          <StatCard
            icon={<Clock className="h-8 w-8 text-yellow-600" />}
            title="Scheduled Tasks"
            value="8"
            subtitle="For this week"
          />
          <StatCard
            icon={<Users className="h-8 w-8 text-blue-600" />}
            title="Assigned Customers"
            value="45"
            subtitle="Under maintenance"
          />
          <StatCard
            icon={<CheckCircle className="h-8 w-8 text-green-600" />}
            title="Completed Tasks"
            value="156"
            subtitle="This month"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton icon={<AlertTriangle />} label="View Issues" />
            <ActionButton icon={<Wrench />} label="Manage Devices" />
            <ActionButton icon={<Users />} label="Customer List" />
            <ActionButton icon={<FileText />} label="Maintenance Logs" />
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h3 className="text-xl font-bold mb-4">Recent Support Tickets</h3>
          <div className="space-y-4">
            <TicketItem
              id="TK-001"
              customer="Ahmad Rizki"
              issue="Connection timeout issues"
              priority="High"
              status="Open"
            />
            <TicketItem
              id="TK-002"
              customer="Siti Nurhaliza"
              issue="Slow internet speed"
              priority="Medium"
              status="In Progress"
            />
            <TicketItem
              id="TK-003"
              customer="Budi Santoso"
              issue="Router configuration"
              priority="Low"
              status="Scheduled"
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
    <button className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition">
      <div className="h-6 w-6 text-gray-600 mr-2">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}

function TicketItem({ id, customer, issue, priority, status }: {
  id: string;
  customer: string;
  issue: string;
  priority: string;
  status: string;
}) {
  const priorityColor = {
    High: 'text-red-600 bg-red-50',
    Medium: 'text-yellow-600 bg-yellow-50',
    Low: 'text-green-600 bg-green-50',
  }[priority] || 'text-gray-600 bg-gray-50';

  const statusColor = {
    Open: 'text-blue-600 bg-blue-50',
    'In Progress': 'text-orange-600 bg-orange-50',
    Scheduled: 'text-purple-600 bg-purple-50',
  }[status] || 'text-gray-600 bg-gray-50';

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-1">
          <span className="text-sm font-semibold text-gray-900">{id}</span>
          <span className="text-sm text-gray-600">•</span>
          <span className="text-sm font-medium text-gray-700">{customer}</span>
        </div>
        <p className="text-sm text-gray-600">{issue}</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor}`}>
          {priority}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
