'use client';

import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
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
  Building,
  RefreshCw
} from 'lucide-react';
import api from '@/lib/api';

type Payment = {
  id: string;
  payment_number: string;
  invoice_id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  method: string;
  bank?: string;
  reference_number?: string;
  payment_date: string;
  status: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payments');
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (error: any) {
      toast.error('Failed to fetch payments: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        (payment.payment_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.reference_number || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? payment.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const totalCount = payments.length;
    const completed = payments.filter(p => p.status === 'completed').length;
    const pending = payments.filter(p => p.status === 'pending').length;
    const revenue = payments.filter(p => p.status === 'completed').reduce((acc, p) => acc + Number(p.amount), 0);

    return {
      totalCount,
      completed,
      pending,
      revenue,
      rate: totalCount > 0 ? ((completed / totalCount) * 100).toFixed(1) : '0'
    };
  }, [payments]);

  const approvePayment = async (id: string) => {
    try {
      const res = await api.patch(`/payments/${id}/status`, { status: 'completed' });
      if (res.data.success) {
        toast.success('Pembayaran berhasil dikonfirmasi!');
        fetchPayments();
      }
    } catch (e: any) {
      toast.error('Gagal konfirmasi: ' + e.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg text-white font-black">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payments</h1>
              <p className="text-slate-500 font-medium">Review and confirm customer payment transactions</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchPayments}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black flex items-center justify-center shadow-xl shadow-slate-200">
            <Plus className="w-5 h-5 mr-2" />
            New Payment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Transaksi"
          value={stats.totalCount.toString()}
          trend="up"
          change="+0"
          icon={CreditCard}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Berhasil"
          value={stats.completed.toString()}
          trend="up"
          change={`${stats.rate}% Rate`}
          icon={CheckCircle}
          gradient="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Pending"
          value={stats.pending.toString()}
          trend="up"
          change="Menunggu konfirmasi"
          icon={Clock}
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="Total Revenue"
          value={`Rp ${stats.revenue.toLocaleString()}`}
          trend="up"
          change="Hari ini"
          icon={TrendingUp}
          gradient="from-indigo-500 to-indigo-600"
        />
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <h2 className="text-2xl font-black text-slate-900">Histori Pembayaran</h2>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <div className="flex items-center px-4 py-3 bg-slate-50 rounded-2xl border border-transparent focus-within:border-slate-200 transition-all shadow-sm">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder="Cari ID, Nama, atau Referensi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-bold w-full md:w-64"
                />
              </div>
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
                <button
                  onClick={() => setStatusFilter(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    !statusFilter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  SEMUA
                </button>
                {['completed', 'pending', 'failed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase ${
                      statusFilter === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Pembayaran</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jumlah</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metode</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="text-right py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="py-8 px-8"><div className="h-4 bg-slate-100 rounded-full animate-pulse w-3/4"></div></td></tr>
                ))
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Data tidak ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="py-5 px-8 text-xs font-black text-slate-500 uppercase">#{payment.id.split('-')[0]}</td>
                    <td className="py-5 px-8">
                       <span className="text-sm font-bold text-slate-700">{payment.customer_name}</span>
                    </td>
                    <td className="py-5 px-8 text-sm font-black text-slate-900">Rp {Number(payment.amount).toLocaleString()}</td>
                    <td className="py-5 px-8">
                       <p className="text-xs font-bold text-slate-700">{payment.method}</p>
                       <p className="text-[10px] font-medium text-slate-400 uppercase">{payment.bank || '-'}</p>
                    </td>
                    <td className="py-5 px-8 text-xs font-medium text-slate-500">{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td className="py-5 px-8">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><Eye size={18} /></button>
                        {payment.status === 'pending' && (
                          <button 
                            onClick={() => approvePayment(payment.id)}
                            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon, gradient }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 hover:shadow-xl transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br ${gradient} shadow-lg text-white`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className={`px-3 py-1 rounded-xl text-[10px] font-black ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {change}
        </div>
      </div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-2xl font-black text-slate-900 mb-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'BERHASIL', icon: CheckCircle },
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'PENDING', icon: Clock },
    failed: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'GAGAL', icon: XCircle },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black tracking-widest ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3 mr-2" />
      {config.label}
    </span>
  );
}
