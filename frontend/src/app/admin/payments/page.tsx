'use client';

import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Download,
  Calendar,
  User,
  DollarSign,
  RefreshCw,
  X,
  Save,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Activity,
  FileText
} from 'lucide-react';
import api from '@/lib/api';

type Payment = {
  id: string;
  payment_number: string;
  invoice_number: string;
  customer_name: string;
  amount: number;
  payment_method: string;
  status: string;
  payment_date: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Modal States
  const [showNewModal, setShowNewModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [saving, setSaving] = useState(false);

  // New Payment Form
  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: 0,
    paymentMethod: 'CASH',
    paymentDate: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payRes, invRes] = await Promise.all([
        api.get('/payments'),
        api.get('/invoices?status=pending')
      ]);
      if (payRes.data.success) setPayments(payRes.data.data);
      if (invRes.data.success) setInvoices(invRes.data.data);
    } catch (error: any) {
      toast.error('Gagal mengambil data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        (p.payment_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? p.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = payments.reduce((acc, p) => acc + Number(p.amount), 0);
    const confirmed = payments.filter(p => p.status === 'confirmed').length;
    const pending = payments.filter(p => p.status === 'pending').length;
    const today = payments.filter(p => p.payment_date.split('T')[0] === new Date().toISOString().split('T')[0])
                         .reduce((acc, p) => acc + Number(p.amount), 0);
    return { total, confirmed, pending, today };
  }, [payments]);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.post('/payments', formData);
      if (res.data.success) {
        toast.success('Pembayaran berhasil dicatat');
        setShowNewModal(false);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mencatat pembayaran');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      const res = await api.post(`/payments/${id}/confirm`);
      if (res.data.success) {
        toast.success('Pembayaran dikonfirmasi');
        fetchData();
      }
    } catch (err: any) {
      toast.error('Gagal mengkonfirmasi pembayaran');
    }
  };

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg text-white font-black">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pembayaran</h1>
              <p className="text-slate-500 font-medium">History and manual processing of customer payments</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
             onClick={fetchData} 
             className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all font-bold"
          >
             <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowNewModal(true)}
            className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black flex items-center justify-center shadow-xl shadow-slate-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Payment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Collected" value={`Rp ${stats.total.toLocaleString()}`} change="+Rp 2.4jt" trend="up" icon={DollarSign} color="from-purple-500 to-indigo-600" />
        <StatCard title="Hari Ini" value={`Rp ${stats.today.toLocaleString()}`} change="Real-time" trend="up" icon={TrendingUp} color="from-emerald-500 to-teal-600" />
        <StatCard title="Confirmed" value={stats.confirmed.toString()} subtitle="Verified payments" icon={CheckCircle} color="from-blue-500 to-cyan-600" />
        <StatCard title="Pending" value={stats.pending.toString()} subtitle="Verification required" icon={Clock} color="from-amber-500 to-orange-600" />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <h2 className="text-2xl font-black text-slate-900">Database Transaksi</h2>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <div className="flex items-center px-4 py-3 bg-slate-50 rounded-2xl border border-transparent focus-within:border-slate-200 transition-all shadow-sm">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder="Cari transaksi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-bold w-full md:w-64"
                />
              </div>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                 <button onClick={() => setStatusFilter(null)} className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${!statusFilter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>SEMUA</button>
                 <button onClick={() => setStatusFilter('confirmed')} className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${statusFilter === 'confirmed' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>CONFIRMED</button>
                 <button onClick={() => setStatusFilter('pending')} className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${statusFilter === 'pending' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'}`}>PENDING</button>
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
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tgl Proses</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="text-right py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="py-8 px-8"><div className="h-4 bg-slate-100 rounded-full animate-pulse w-3/4"></div></td></tr>)
              ) : filteredPayments.length === 0 ? (
                <tr><td colSpan={6} className="py-24 text-center font-bold text-slate-300">Belum ada data pembayaran</td></tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="py-5 px-8">
                       <p className="text-sm font-black text-slate-900">{payment.payment_number}</p>
                       <p className="text-[10px] font-medium text-slate-400">Inv: #{payment.invoice_number}</p>
                    </td>
                    <td className="py-5 px-8">
                       <p className="text-sm font-bold text-slate-700">{payment.customer_name}</p>
                       <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{payment.payment_method}</p>
                    </td>
                    <td className="py-5 px-8 text-sm font-black text-slate-900 border-l-4 border-transparent group-hover:border-purple-500 transition-all">Rp {Number(payment.amount).toLocaleString()}</td>
                    <td className="py-5 px-8 text-sm font-medium text-slate-500">{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td className="py-5 px-8"><StatusBadge status={payment.status} /></td>
                    <td className="py-5 px-8 text-right">
                       <div className="flex items-center justify-end space-x-2 opacity-30 group-hover:opacity-100 transition-all">
                          <button onClick={() => handleView(payment)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Eye size={18} /></button>
                          {payment.status === 'pending' && (
                             <button onClick={() => handleConfirm(payment.id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><CheckCircle size={18} /></button>
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

      {/* New Payment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full p-10 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">Catat Pembayaran</h2>
                 <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={24} /></button>
              </div>
              <form onSubmit={handleCreatePayment} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Pilih Invoice Pending</label>
                    <select 
                      required
                      value={formData.invoiceId}
                      onChange={(e) => {
                         const inv = invoices.find(i => i.id === e.target.value);
                         setFormData({...formData, invoiceId: e.target.value, amount: inv?.amount || 0});
                      }}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm appearance-none"
                    >
                       <option value="">-- PILIH --</option>
                       {invoices.map(i => <option key={i.id} value={i.id}>{i.invoice_number} - {i.customer_name} (Rp {Number(i.amount).toLocaleString()})</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Nominal Bayar</label>
                       <input required type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Metode</label>
                       <select value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm">
                          <option value="CASH">CASH</option>
                          <option value="BANK_TRANSFER">TRANSFER BANK</option>
                          <option value="VOUCHER">VOUCHER</option>
                       </select>
                    </div>
                 </div>
                 <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-purple-600 transition-all shadow-xl shadow-purple-100 flex items-center justify-center gap-2 mt-4">
                    <Save size={20} /> {saving ? 'SAVING...' : 'SIMPAN PEMBAYARAN'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full p-10 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 leading-none mb-2">Riwayat</h2>
                    <p className="text-sm font-bold text-slate-400">Bukti Pembayaran #{selectedPayment.payment_number}</p>
                 </div>
                 <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={24} /></button>
              </div>

              <div className="space-y-8 mb-12">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center"><User size={28} /></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</p><p className="text-xl font-black text-slate-900">{selectedPayment.customer_name}</p></div>
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p><StatusBadge status={selectedPayment.status} /></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Metode</p><p className="text-sm font-black text-slate-900">{selectedPayment.payment_method}</p></div>
                 </div>
                 <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Dibayar</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">Rp {Number(selectedPayment.amount).toLocaleString()}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => { toast.success('Mencetak struk...'); window.print(); }} className="py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"><Printer size={16} /> Print</button>
                 <button onClick={() => toast.success('Mengunduh resi...')} className="py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"><Download size={16} /> Resi PDF</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={28} />
        </div>
        <div className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{change}</div>
      </div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'CONFIRMED', icon: CheckCircle },
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'PENDING', icon: Clock },
    failed: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'FAILED', icon: XCircle },
  };
  const config = configs[status] || configs.pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest ${config.bg} ${config.text}`}>
       <Icon className="w-3 h-3 mr-2" /> {config.label}
    </span>
  );
}
