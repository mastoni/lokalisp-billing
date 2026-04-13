'use client';

import { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Package
} from 'lucide-react';

// Mock customer data
const customersData = [
  { id: 1, name: 'Ahmad Rizki', email: 'ahmad@email.com', phone: '081234567890', address: 'Jl. Merdeka No. 123, Jakarta', package: 'Premium 50Mbps', status: 'active', joinDate: '2024-10-15', totalPaid: 'Rp 3.500.000', balance: 'Rp 0' },
  { id: 2, name: 'Budi Santoso', email: 'budi@email.com', phone: '081234567891', address: 'Jl. Sudirman No. 45, Bandung', package: 'Ultimate 100Mbps', status: 'active', joinDate: '2024-09-20', totalPaid: 'Rp 5.400.000', balance: 'Rp 0' },
  { id: 3, name: 'Siti Nurhaliza', email: 'siti@email.com', phone: '081234567892', address: 'Jl. Gatot Subroto No. 78, Surabaya', package: 'Standard 20Mbps', status: 'active', joinDate: '2025-01-10', totalPaid: 'Rp 3.000.000', balance: 'Rp 250.000' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi@email.com', phone: '081234567893', address: 'Jl. Ahmad Yani No. 234, Semarang', package: 'Basic 10Mbps', status: 'overdue', joinDate: '2025-04-05', totalPaid: 'Rp 1.800.000', balance: 'Rp 450.000' },
  { id: 5, name: 'Eko Prasetyo', email: 'eko@email.com', phone: '081234567894', address: 'Jl. Pahlawan No. 56, Yogyakarta', package: 'Premium 50Mbps', status: 'active', joinDate: '2024-11-12', totalPaid: 'Rp 4.200.000', balance: 'Rp 0' },
  { id: 6, name: 'Fitriani', email: 'fitri@email.com', phone: '081234567895', address: 'Jl. Diponegoro No. 89, Medan', package: 'Standard 20Mbps', status: 'pending', joinDate: '2025-03-18', totalPaid: 'Rp 1.500.000', balance: 'Rp 250.000' },
  { id: 7, name: 'Gunawan', email: 'gunawan@email.com', phone: '081234567896', address: 'Jl. Imam Bonjol No. 12, Makassar', package: 'Basic 10Mbps', status: 'suspended', joinDate: '2025-02-08', totalPaid: 'Rp 900.000', balance: 'Rp 600.000' },
  { id: 8, name: 'Hana Pertiwi', email: 'hana@email.com', phone: '081234567897', address: 'Jl. Kartini No. 67, Denpasar', package: 'Standard 20Mbps', status: 'active', joinDate: '2025-05-22', totalPaid: 'Rp 2.400.000', balance: 'Rp 0' },
];

const packageStats = [
  { name: 'Basic 10Mbps', customers: 45, price: 'Rp 150.000/month', color: 'bg-blue-500' },
  { name: 'Standard 20Mbps', customers: 98, price: 'Rp 250.000/month', color: 'bg-green-500' },
  { name: 'Premium 50Mbps', customers: 125, price: 'Rp 350.000/month', color: 'bg-purple-500' },
  { name: 'Ultimate 100Mbps', customers: 74, price: 'Rp 450.000/month', color: 'bg-orange-500' },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCustomers = customersData.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter ? customer.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
              <p className="text-slate-600">Manage your ISP customers and subscriptions</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors font-medium">
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value="342"
          change="+15"
          trend="up"
          icon={Users}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Active Customers"
          value="289"
          change="+12"
          trend="up"
          icon={CheckCircle}
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Pending Activation"
          value="28"
          change="+3"
          trend="up"
          icon={AlertCircle}
          gradient="from-orange-500 to-orange-600"
        />
        <StatCard
          title="Suspended"
          value="25"
          change="-5"
          trend="down"
          icon={XCircle}
          gradient="from-red-500 to-red-600"
        />
      </div>

      {/* Package Distribution */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Package Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {packageStats.map((pkg) => (
            <div
              key={pkg.name}
              className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl ${pkg.color} mb-4`}></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{pkg.name}</h3>
              <p className="text-sm text-slate-600 mb-3">{pkg.price}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Customers</span>
                <span className="text-2xl font-bold text-slate-900">{pkg.customers}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Customer List</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-4 py-2 bg-slate-100 rounded-xl">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setStatusFilter(null)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !statusFilter
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {['active', 'pending', 'overdue', 'suspended'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Package</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Balance</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-white font-bold text-sm">
                          {customer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                        <p className="text-xs text-slate-500">Joined {customer.joinDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="w-3 h-3 mr-2" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="w-3 h-3 mr-2" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{customer.package}</p>
                      <p className="text-xs text-slate-500">Total: {customer.totalPaid}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className="py-3 px-4">
                    <p className={`text-sm font-semibold ${customer.balance === 'Rp 0' ? 'text-green-600' : 'text-red-600'}`}>
                      {customer.balance}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-100 transition-colors text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  gradient: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
            trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {change}
        </div>
      </div>
      <h3 className="text-sm font-semibold text-slate-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active', icon: CheckCircle },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: AlertCircle },
    overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue', icon: XCircle },
    suspended: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Suspended', icon: XCircle },
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
