'use client';

import { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Banknote,
  Smartphone,
  Building
} from 'lucide-react';

// Mock payment data
const paymentsData = [
  { id: 'PAY-001', invoice: 'INV-001', customer: 'Ahmad Rizki', amount: 'Rp 350.000', method: 'Bank Transfer', bank: 'BCA', date: '2026-04-10', status: 'completed', reference: 'TRX123456789' },
  { id: 'PAY-002', invoice: 'INV-003', customer: 'Siti Nurhaliza', amount: 'Rp 250.000', method: 'E-Wallet', bank: 'GoPay', date: '2026-04-12', status: 'completed', reference: 'GP987654321' },
  { id: 'PAY-003', invoice: 'INV-005', customer: 'Eko Prasetyo', amount: 'Rp 350.000', method: 'Bank Transfer', bank: 'Mandiri', date: '2026-04-08', status: 'completed', reference: 'TRX987654321' },
  { id: 'PAY-004', invoice: 'INV-008', customer: 'Hana Pertiwi', amount: 'Rp 250.000', method: 'Virtual Account', bank: 'BNI', date: '2026-04-14', status: 'completed', reference: 'VA123456789' },
  { id: 'PAY-005', invoice: 'INV-010', customer: 'Jasmine Putri', amount: 'Rp 450.000', method: 'Credit Card', bank: 'Visa', date: '2026-04-11', status: 'completed', reference: 'CC456789123' },
  { id: 'PAY-006', invoice: 'INV-002', customer: 'Budi Santoso', amount: 'Rp 450.000', method: 'Bank Transfer', bank: 'BRI', date: '2026-04-14', status: 'pending', reference: 'TRX456789123' },
  { id: 'PAY-007', invoice: 'INV-006', customer: 'Fitriani', amount: 'Rp 250.000', method: 'E-Wallet', bank: 'OVO', date: '2026-04-13', status: 'pending', reference: 'OVO123789456' },
  { id: 'PAY-008', invoice: 'INV-009', customer: 'Irfan Hakim', amount: 'Rp 350.000', method: 'Virtual Account', bank: 'BNI', date: '2026-04-14', status: 'pending', reference: 'VA987123456' },
];

const paymentStats = {
  totalPayments: 256,
  completedPayments: 238,
  pendingPayments: 18,
  failedPayments: 0,
  totalRevenue: 'Rp 125.450.000',
  avgPaymentAmount: 'Rp 305.000',
  collectionRate: '92.9%',
  growthRate: '+15.3%',
};

const paymentMethods = [
  { method: 'Bank Transfer', count: 125, percentage: 49, color: 'bg-blue-500', icon: Building },
  { method: 'E-Wallet', count: 78, percentage: 30, color: 'bg-green-500', icon: Smartphone },
  { method: 'Virtual Account', count: 42, percentage: 16, color: 'bg-purple-500', icon: Wallet },
  { method: 'Credit Card', count: 11, percentage: 5, color: 'bg-orange-500', icon: CreditCard },
];

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredPayments = paymentsData.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? payment.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Payments</h1>
              <p className="text-slate-600">Track and manage payment transactions</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors font-medium">
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-lg shadow-green-500/30">
            <Plus className="w-4 h-4 inline mr-2" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Payments"
          value={paymentStats.totalPayments.toString()}
          change={paymentStats.growthRate}
          trend="up"
          icon={CreditCard}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Completed"
          value={paymentStats.completedPayments.toString()}
          change={`${paymentStats.collectionRate} rate`}
          trend="up"
          icon={CheckCircle}
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Pending"
          value={paymentStats.pendingPayments.toString()}
          change="Awaiting confirmation"
          trend="up"
          icon={Clock}
          gradient="from-orange-500 to-orange-600"
        />
        <StatCard
          title="Total Revenue"
          value={paymentStats.totalRevenue}
          change={`Avg: ${paymentStats.avgPaymentAmount}`}
          trend="up"
          icon={DollarSign}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Payment Methods Distribution */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Payment Methods Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {paymentMethods.map((pm) => (
            <div
              key={pm.method}
              className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <pm.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{pm.count}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{pm.method}</h3>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                <div
                  className={`${pm.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${pm.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-500">{pm.percentage}% of total</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Revenue Trend</h2>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600">+15.3% growth</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl">
            <p className="text-sm text-slate-600 mb-2">This Month</p>
            <p className="text-3xl font-bold text-green-600">{paymentStats.totalRevenue}</p>
            <div className="flex items-center mt-2 text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="text-sm font-semibold">+12.5%</span>
            </div>
          </div>
          <div className="p-6 bg-white rounded-xl">
            <p className="text-sm text-slate-600 mb-2">Last Month</p>
            <p className="text-3xl font-bold text-slate-900">Rp 111.230.000</p>
            <div className="flex items-center mt-2 text-slate-500">
              <span className="text-sm">Previous period</span>
            </div>
          </div>
          <div className="p-6 bg-white rounded-xl">
            <p className="text-sm text-slate-600 mb-2">Average Payment</p>
            <p className="text-3xl font-bold text-blue-600">{paymentStats.avgPaymentAmount}</p>
            <div className="flex items-center mt-2 text-blue-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="text-sm font-semibold">+8.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Payment Transactions</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-4 py-2 bg-slate-100 rounded-xl">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search payments..."
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
              {['completed', 'pending', 'failed'].map((status) => (
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
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Payment ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Invoice</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Method</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Reference</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-semibold text-slate-900">{payment.id}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{payment.customer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-700">{payment.invoice}</td>
                  <td className="py-3 px-4 text-sm font-bold text-slate-900">{payment.amount}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{payment.method}</p>
                      <p className="text-xs text-slate-500">{payment.bank}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600">{payment.reference}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{payment.date}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.status === 'pending' && (
                        <button className="p-2 rounded-lg hover:bg-green-100 transition-colors text-green-600">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
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
  change?: string;
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
        {change && (
          <div
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
              trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {trend === 'up' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {change}
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-slate-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', icon: CheckCircle },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: Clock },
    failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Failed', icon: XCircle },
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
