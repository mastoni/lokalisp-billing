'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  CreditCard,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Star,
  Gift,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap
} from 'lucide-react';

// Mock data - will be replaced with API calls
const statsData = {
  totalRevenue: {
    value: 'Rp 125.450.000',
    change: '+12.5%',
    trend: 'up' as const,
  },
  monthlyRevenue: {
    value: 'Rp 45.230.000',
    change: '+8.2%',
    trend: 'up' as const,
  },
  activeCustomers: {
    value: '342',
    change: '+15',
    trend: 'up' as const,
  },
  pendingInvoices: {
    value: '89',
    change: '-5',
    trend: 'down' as const,
  },
  totalPayments: {
    value: '256',
    change: '+23',
    trend: 'up' as const,
  },
  activePackages: {
    value: '8',
    change: '0',
    trend: 'neutral' as const,
  },
};

const recentTransactions = [
  { id: 'INV-001', customer: 'Ahmad Rizki', amount: 'Rp 350.000', status: 'paid' as const, date: '2026-04-14', package: 'Premium 50Mbps' },
  { id: 'INV-002', customer: 'Siti Nurhaliza', amount: 'Rp 250.000', status: 'pending' as const, date: '2026-04-14', package: 'Standard 20Mbps' },
  { id: 'INV-003', customer: 'Budi Santoso', amount: 'Rp 450.000', status: 'paid' as const, date: '2026-04-13', package: 'Ultimate 100Mbps' },
  { id: 'INV-004', customer: 'Dewi Lestari', amount: 'Rp 150.000', status: 'overdue' as const, date: '2026-04-13', package: 'Basic 10Mbps' },
  { id: 'INV-005', customer: 'Eko Prasetyo', amount: 'Rp 350.000', status: 'paid' as const, date: '2026-04-12', package: 'Premium 50Mbps' },
  { id: 'INV-006', customer: 'Fitriani', amount: 'Rp 250.000', status: 'pending' as const, date: '2026-04-12', package: 'Standard 20Mbps' },
];

const topCustomers = [
  { name: 'Ahmad Rizki', totalPaid: 'Rp 3.500.000', months: 12, package: 'Premium 50Mbps' },
  { name: 'Budi Santoso', totalPaid: 'Rp 5.400.000', months: 12, package: 'Ultimate 100Mbps' },
  { name: 'Eko Prasetyo', totalPaid: 'Rp 4.200.000', months: 12, package: 'Premium 50Mbps' },
  { name: 'Siti Nurhaliza', totalPaid: 'Rp 3.000.000', months: 12, package: 'Standard 20Mbps' },
  { name: 'Dewi Lestari', totalPaid: 'Rp 1.800.000', months: 12, package: 'Basic 10Mbps' },
];

const packageDistribution = [
  { name: 'Basic 10Mbps', customers: 45, percentage: 13, color: 'bg-blue-500' },
  { name: 'Standard 20Mbps', customers: 98, percentage: 29, color: 'bg-green-500' },
  { name: 'Premium 50Mbps', customers: 125, percentage: 36, color: 'bg-purple-500' },
  { name: 'Ultimate 100Mbps', customers: 74, percentage: 22, color: 'bg-orange-500' },
];

const recentActivities = [
  { type: 'payment', message: 'Payment received from Ahmad Rizki', time: '2 minutes ago', icon: CheckCircle, color: 'text-green-500' },
  { type: 'invoice', message: 'Invoice INV-006 created', time: '15 minutes ago', icon: FileText, color: 'text-blue-500' },
  { type: 'customer', message: 'New customer registration: Rudi Hermawan', time: '1 hour ago', icon: Users, color: 'text-purple-500' },
  { type: 'reward', message: 'Budi Santoso redeemed 500 points', time: '2 hours ago', icon: Gift, color: 'text-orange-500' },
  { type: 'alert', message: '3 invoices overdue from last month', time: '3 hours ago', icon: AlertCircle, color: 'text-red-500' },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your ISP business.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors font-medium">
            <Activity className="w-4 h-4 inline mr-2" />
            Export Report
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg shadow-blue-500/30">
            <Zap className="w-4 h-4 inline mr-2" />
            Quick Actions
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <StatCard
          title="Total Revenue"
          value={statsData.totalRevenue.value}
          change={statsData.totalRevenue.change}
          trend={statsData.totalRevenue.trend}
          icon={DollarSign}
          gradient="from-blue-500 to-blue-600"
        />

        {/* Monthly Revenue */}
        <StatCard
          title="Monthly Revenue"
          value={statsData.monthlyRevenue.value}
          change={statsData.monthlyRevenue.change}
          trend={statsData.monthlyRevenue.trend}
          icon={TrendingUp}
          gradient="from-green-500 to-green-600"
        />

        {/* Active Customers */}
        <StatCard
          title="Active Customers"
          value={statsData.activeCustomers.value}
          change={statsData.activeCustomers.change}
          trend={statsData.activeCustomers.trend}
          icon={Users}
          gradient="from-purple-500 to-purple-600"
        />

        {/* Pending Invoices */}
        <StatCard
          title="Pending Invoices"
          value={statsData.pendingInvoices.value}
          change={statsData.pendingInvoices.change}
          trend={statsData.pendingInvoices.trend}
          icon={FileText}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Payments"
          value={statsData.totalPayments.value}
          change={statsData.totalPayments.change}
          trend={statsData.totalPayments.trend}
          icon={CreditCard}
          gradient="from-teal-500 to-teal-600"
          small
        />

        <StatCard
          title="Active Packages"
          value={statsData.activePackages.value}
          change={statsData.activePackages.change}
          trend={statsData.activePackages.trend}
          icon={Package}
          gradient="from-pink-500 to-pink-600"
          small
        />

        <StatCard
          title="Avg. Payment Rate"
          value="89.5%"
          change="+3.2%"
          trend="up"
          icon={Star}
          gradient="from-indigo-500 to-indigo-600"
          small
        />
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Revenue Overview</h2>
            <select className="px-3 py-2 bg-slate-100 border-0 rounded-lg text-sm text-slate-700">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <BarChart className="w-24 h-24 text-blue-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Revenue Chart</p>
              <p className="text-sm text-slate-500">Will be implemented with chart library</p>
            </div>
          </div>
        </div>

        {/* Package Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Package Distribution</h2>
          <div className="space-y-6">
            {packageDistribution.map((pkg) => (
              <div key={pkg.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{pkg.name}</span>
                  <span className="text-sm font-semibold text-slate-900">{pkg.customers}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className={`${pkg.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${pkg.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{pkg.percentage}%</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Total Customers</span>
              <span className="text-lg font-bold text-slate-900">342</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Transactions</h2>
            <a href="/admin/invoices" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Invoice</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Package</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">{transaction.id}</td>
                    <td className="py-3 px-4 text-sm text-slate-700">{transaction.customer}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{transaction.package}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-900">{transaction.amount}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={transaction.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 font-medium">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Top Customers by Revenue</h2>
          <a href="/admin/customers" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topCustomers.map((customer, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  <span className="text-white font-bold text-sm">#{index + 1}</span>
                </div>
                {index === 0 && <Star className="w-5 h-5 text-yellow-500" />}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1 truncate">{customer.name}</h3>
              <p className="text-xs text-slate-600 mb-2">{customer.package}</p>
              <p className="text-sm font-bold text-blue-600">{customer.totalPaid}</p>
              <p className="text-xs text-slate-500 mt-1">{customer.months} months</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  gradient,
  small = false,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
  gradient: string;
  small?: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 ${small ? '' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        {trend !== 'neutral' && (
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
            trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {change}
          </div>
        )}
      </div>
      <h3 className={`font-semibold text-slate-600 mb-1 ${small ? 'text-sm' : 'text-base'}`}>{title}</h3>
      <p className={`font-bold text-slate-900 ${small ? 'text-xl' : 'text-2xl'}`}>{value}</p>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: 'paid' | 'pending' | 'overdue' }) {
  const statusConfig = {
    paid: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      label: 'Paid',
      icon: CheckCircle,
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      label: 'Pending',
      icon: Clock,
    },
    overdue: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Overdue',
      icon: XCircle,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
}

// Bar Chart Icon (placeholder)
function BarChart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
    </svg>
  );
}
