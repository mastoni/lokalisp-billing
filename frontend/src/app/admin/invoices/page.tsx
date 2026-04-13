'use client';

import { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  User,
  Send,
  Printer
} from 'lucide-react';

// Mock invoice data
const invoicesData = [
  { id: 'INV-001', customer: 'Ahmad Rizki', email: 'ahmad@email.com', package: 'Premium 50Mbps', amount: 'Rp 350.000', issueDate: '2026-04-01', dueDate: '2026-04-15', paidDate: '2026-04-10', status: 'paid' },
  { id: 'INV-002', customer: 'Budi Santoso', email: 'budi@email.com', package: 'Ultimate 100Mbps', amount: 'Rp 450.000', issueDate: '2026-04-01', dueDate: '2026-04-15', paidDate: null, status: 'pending' },
  { id: 'INV-003', customer: 'Siti Nurhaliza', email: 'siti@email.com', package: 'Standard 20Mbps', amount: 'Rp 250.000', issueDate: '2026-04-01', dueDate: '2026-04-15', paidDate: '2026-04-12', status: 'paid' },
  { id: 'INV-004', customer: 'Dewi Lestari', email: 'dewi@email.com', package: 'Basic 10Mbps', amount: 'Rp 150.000', issueDate: '2026-03-01', dueDate: '2026-03-15', paidDate: null, status: 'overdue' },
  { id: 'INV-005', customer: 'Eko Prasetyo', email: 'eko@email.com', package: 'Premium 50Mbps', amount: 'Rp 350.000', issueDate: '2026-04-01', dueDate: '2026-04-15', paidDate: '2026-04-08', status: 'paid' },
  { id: 'INV-006', customer: 'Fitriani', email: 'fitri@email.com', package: 'Standard 20Mbps', amount: 'Rp 250.000', issueDate: '2026-04-01', dueDate: '2026-04-15', paidDate: null, status: 'pending' },
  { id: 'INV-007', customer: 'Gunawan', email: 'gunawan@email.com', package: 'Basic 10Mbps', amount: 'Rp 150.000', issueDate: '2026-02-01', dueDate: '2026-02-15', paidDate: null, status: 'overdue' },
  { id: 'INV-008', customer: 'Hana Pertiwi', email: 'hana@email.com', package: 'Standard 20Mbps', amount: 'Rp 250.000', issueDate: '2026-04-01', dueDate: '2026-04-15', paidDate: '2026-04-14', status: 'paid' },
  { id: 'INV-009', customer: 'Irfan Hakim', email: 'irfan@email.com', package: 'Premium 50Mbps', amount: 'Rp 350.000', issueDate: '2026-04-01', dueDate: '2026-04-15', paidDate: null, status: 'pending' },
  { id: 'INV-010', customer: 'Jasmine Putri', email: 'jasmine@email.com', package: 'Ultimate 100Mbps', amount: 'Rp 450.000', issueDate: '2026-04-01', dueDate: '2026-04-15', paidDate: '2026-04-11', status: 'paid' },
];

const invoiceStats = {
  totalInvoices: 456,
  paidInvoices: 342,
  pendingInvoices: 89,
  overdueInvoices: 25,
  totalRevenue: 'Rp 125.450.000',
  pendingAmount: 'Rp 28.350.000',
  overdueAmount: 'Rp 4.750.000',
  collectionRate: '87.5%',
};

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredInvoices = invoicesData.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? invoice.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
              <p className="text-slate-600">Manage billing and invoice tracking</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors font-medium">
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium shadow-lg shadow-indigo-500/30">
            <Plus className="w-4 h-4 inline mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Invoices"
          value={invoiceStats.totalInvoices.toString()}
          subtitle="This month"
          icon={FileText}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Paid Invoices"
          value={invoiceStats.paidInvoices.toString()}
          subtitle={`${invoiceStats.collectionRate} collection rate`}
          icon={CheckCircle}
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Pending"
          value={invoiceStats.pendingInvoices.toString()}
          subtitle={invoiceStats.pendingAmount}
          icon={Clock}
          gradient="from-orange-500 to-orange-600"
        />
        <StatCard
          title="Overdue"
          value={invoiceStats.overdueInvoices.toString()}
          subtitle={invoiceStats.overdueAmount}
          icon={XCircle}
          gradient="from-red-500 to-red-600"
        />
      </div>

      {/* Revenue Stats */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Revenue Overview</h2>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600">+12.5%</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl">
            <p className="text-sm text-slate-600 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">{invoiceStats.totalRevenue}</p>
            <p className="text-xs text-slate-500 mt-2">Collected this month</p>
          </div>
          <div className="p-6 bg-white rounded-xl">
            <p className="text-sm text-slate-600 mb-2">Pending Amount</p>
            <p className="text-3xl font-bold text-orange-600">{invoiceStats.pendingAmount}</p>
            <p className="text-xs text-slate-500 mt-2">Awaiting payment</p>
          </div>
          <div className="p-6 bg-white rounded-xl">
            <p className="text-sm text-slate-600 mb-2">Overdue Amount</p>
            <p className="text-3xl font-bold text-red-600">{invoiceStats.overdueAmount}</p>
            <p className="text-xs text-slate-500 mt-2">Requires follow-up</p>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Invoice List</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-4 py-2 bg-slate-100 rounded-xl">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search invoices..."
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
              {['paid', 'pending', 'overdue'].map((status) => (
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
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Invoice ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Package</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Issue Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Due Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-semibold text-slate-900">{invoice.id}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{invoice.customer}</p>
                        <p className="text-xs text-slate-500">{invoice.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700">{invoice.package}</td>
                  <td className="py-3 px-4 text-sm font-bold text-slate-900">{invoice.amount}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{invoice.issueDate}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{invoice.dueDate}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                        <Printer className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-blue-100 transition-colors text-blue-600">
                        <Send className="w-4 h-4" />
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
  subtitle,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
  gradient: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-slate-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid', icon: CheckCircle },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: Clock },
    overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue', icon: AlertCircle },
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
