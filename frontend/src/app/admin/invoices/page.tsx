'use client';

import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
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
  Printer,
  RefreshCw,
  X,
  Save,
  ChevronRight
} from 'lucide-react';
import api from '@/lib/api';

type Invoice = {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  package_name: string;
  amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  paid_date?: string;
  address?: string;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Create Form State
  const [formData, setFormData] = useState({
    customerId: '',
    amount: 0,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoiceRes, customerRes] = await Promise.all([
        api.get('/invoices'),
        api.get('/customers')
      ]);
      if (invoiceRes.data.success) setInvoices(invoiceRes.data.data);
      if (customerRes.data.success) setCustomers(customerRes.data.data);
    } catch (error: any) {
      toast.error('Gagal mengambil data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        (invoice.invoice_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? invoice.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter(i => i.status === 'paid').length;
    const pending = invoices.filter(i => i.status === 'pending').length;
    const overdue = invoices.filter(i => i.status === 'overdue').length;
    
    const revenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + Number(i.amount), 0);
    const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + Number(i.amount), 0);
    const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + Number(i.amount), 0);

    return {
      total, paid, pending, overdue, revenue, pendingAmount, overdueAmount,
      rate: total > 0 ? ((paid / total) * 100).toFixed(1) : '0'
    };
  }, [invoices]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/invoices', formData);
      if (res.data.success) {
        toast.success('Tagihan berhasil dibuat');
        setShowCreateModal(false);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membuat tagihan');
    }
  };

  const handleSendReminder = async (id: string) => {
    try {
      toast.promise(
        api.post(`/invoices/${id}/remind`),
        {
          loading: 'Mengirim pengingat...',
          success: 'Pengingat berhasil dikirim!',
          error: 'Gagal mengirim pengingat'
        }
      );
    } catch (err) {}
  };

  const handlePrint = (invoice: Invoice) => {
    toast.success('Mempersiapkan dokumen cetak...');
    // In a real app, this would open a printer-friendly PDF or print view
    window.print();
  };

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg text-white font-black">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tagihan</h1>
              <p className="text-slate-500 font-medium">Monitoring and management of customer billing</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchData}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex-shrink-0"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black flex items-center justify-center shadow-xl shadow-slate-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tagihan" value={stats.total.toString()} subtitle="Bulan ini" icon={FileText} gradient="from-blue-500 to-blue-600" />
        <StatCard title="Sudah Bayar" value={stats.paid.toString()} subtitle={`${stats.rate}% Collection rate`} icon={CheckCircle} gradient="from-emerald-500 to-emerald-600" />
        <StatCard title="Menunggu" value={stats.pending.toString()} subtitle={`Rp ${stats.pendingAmount.toLocaleString()}`} icon={Clock} gradient="from-amber-500 to-amber-600" />
        <StatCard title="Terlambat" value={stats.overdue.toString()} subtitle={`Rp ${stats.overdueAmount.toLocaleString()}`} icon={XCircle} gradient="from-rose-500 to-rose-600" />
      </div>

      {/* Revenue Card */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-sm font-black text-white/50 uppercase tracking-[0.2em] mb-4">Total Revenue</h2>
          <div className="flex items-end gap-3 mb-8">
            <span className="text-5xl font-black tracking-tighter">Rp {stats.revenue.toLocaleString()}</span>
            <div className="mb-2 flex items-center bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-black">
              <TrendingUp className="w-3 h-3 mr-1" /> ONLINE
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10">
               <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Awaiting</p>
               <p className="text-xl font-bold">Rp {stats.pendingAmount.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10">
               <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Overdue</p>
               <p className="text-xl font-bold text-rose-400">Rp {stats.overdueAmount.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10">
               <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Next Month Estim.</p>
               <p className="text-xl font-bold text-emerald-400">Rp {(stats.revenue * 1.05).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/20 to-transparent"></div>
        <FileText className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <h2 className="text-2xl font-black text-slate-900">Database Tagihan</h2>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <div className="flex items-center px-4 py-3 bg-slate-50 rounded-2xl border border-transparent focus-within:border-slate-200 transition-all shadow-sm">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder="Cari nomor invoice atau pelanggan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-bold w-full md:w-64"
                />
              </div>
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setStatusFilter(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${!statusFilter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  SEMUA
                </button>
                {['paid', 'pending', 'overdue'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase ${statusFilter === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
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
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor Invoice</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Package</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="text-right py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="py-8 px-8"><div className="h-4 bg-slate-100 rounded-full animate-pulse w-3/4"></div></td></tr>)
              ) : filteredInvoices.length === 0 ? (
                <tr><td colSpan={6} className="py-24 text-center font-bold text-slate-300">Data tidak ditemukan</td></tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="py-5 px-8 text-sm font-black text-slate-900">#{invoice.invoice_number}</td>
                    <td className="py-5 px-8">
                       <p className="text-sm font-bold text-slate-700">{invoice.customer_name}</p>
                       <p className="text-[10px] font-medium text-slate-400">{new Date(invoice.issue_date).toLocaleDateString()}</p>
                    </td>
                    <td className="py-5 px-8 text-sm font-medium text-slate-500">{invoice.package_name || '-'}</td>
                    <td className="py-5 px-8 text-sm font-black text-slate-900">Rp {Number(invoice.amount).toLocaleString()}</td>
                    <td className="py-5 px-8 flex items-center h-16">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-60 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleView(invoice)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><Eye size={18} /></button>
                        <button onClick={() => handlePrint(invoice)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all"><Printer size={18} /></button>
                        <button onClick={() => handleSendReminder(invoice.id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Send size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
              <form onSubmit={handleCreateInvoice} className="p-8">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Buat Tagihan Baru</h2>
                    <button type="button" onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                       <X className="w-6 h-6 text-slate-400" />
                    </button>
                 </div>
                 
                 <div className="space-y-5">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Pilih Pelanggan</label>
                       <select 
                         required
                         value={formData.customerId}
                         onChange={(e) => {
                            const c = customers.find(cust => cust.id === e.target.value);
                            setFormData({...formData, customerId: e.target.value, amount: c?.balance || 0});
                         }}
                         className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none"
                       >
                          <option value="">-- Pilih --</option>
                          {customers.map(c => <option key={c.id} value={c.id}>{c.name} (Saldo: Rp {c.balance.toLocaleString()})</option>)}
                       </select>
                    </div>

                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Nominal Tagihan</label>
                       <div className="relative">
                          <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            required
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                            placeholder="0"
                          />
                       </div>
                    </div>

                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Batas Waktu Pembayaran</label>
                       <div className="relative">
                          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            required
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                          />
                       </div>
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 mt-4">
                       <Save size={20} />
                       GENERATE INVOICE
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="p-10">
                <div className="flex justify-between items-start mb-12">
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="text-indigo-600" size={32} />
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">INVOICE</h2>
                      </div>
                      <p className="text-sm font-bold text-slate-400">#{selectedInvoice.invoice_number}</p>
                   </div>
                   <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24} /></button>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tagihan Kepada</p>
                      <p className="text-xl font-black text-slate-900 mb-1">{selectedInvoice.customer_name}</p>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed">{selectedInvoice.address || 'Alamat tidak terdaftar'}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Status Pembayaran</p>
                      <div className="flex justify-end"><StatusBadge status={selectedInvoice.status} /></div>
                      <p className="text-sm font-bold text-slate-400 mt-4">Diterbitkan: {new Date(selectedInvoice.issue_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                   </div>
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-8 mb-8 border border-slate-100">
                   <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
                      <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Deskripsi Layanan</span>
                      <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total</span>
                   </div>
                   <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-lg font-black text-slate-900">{selectedInvoice.package_name || 'Internet Service'}</p>
                        <p className="text-xs font-medium text-slate-400">Layanan Internet Bulanan</p>
                      </div>
                      <span className="text-xl font-black text-slate-900">Rp {Number(selectedInvoice.amount).toLocaleString()}</span>
                   </div>
                </div>

                <div className="flex justify-between items-center px-8">
                   <div className="text-slate-400 text-xs font-medium italic italic">Jatuh tempo: {new Date(selectedInvoice.due_date).toLocaleDateString()}</div>
                   <div className="flex gap-3">
                      <button onClick={() => handlePrint(selectedInvoice)} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Printer size={16} /> PRINT
                      </button>
                      <button onClick={() => handleSendReminder(selectedInvoice.id)} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                        <Send size={16} /> SEND
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, gradient }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 hover:shadow-xl transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br ${gradient} shadow-lg text-white`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
      {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    paid: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'LUNAS', icon: CheckCircle },
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'PENDING', icon: Clock },
    overdue: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'OVERDUE', icon: AlertCircle },
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
