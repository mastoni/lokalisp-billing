'use client';

import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
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
  X,
  Save,
  CreditCard,
  Wifi,
  Package,
  Calendar,
  ChevronRight,
  LayoutGrid,
  List,
  Star,
  TrendingUp,
  Award,
  Crown,
  Target,
  Medal
} from 'lucide-react';
import { customerService, type Customer } from '@/services/customerService';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Modal States
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    subscriptionPlan: 'Basic 10Mbps',
    status: 'active' as 'active' | 'pending' | 'suspended' | 'inactive',
    tier: 'Bronze'
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      if (data.success) {
        setCustomers(data.data || []);
      }
    } catch (error: any) {
      toast.error('Gagal mengambil data pelanggan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter((customer) => {
      const name = customer.name || '';
      const email = customer.email || '';
      const phone = customer.phone || '';
      
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm);
      const matchesStatus = statusFilter ? customer.status === statusFilter : true;
      const matchesTier = tierFilter ? customer.tier === tierFilter : true;
      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [customers, searchTerm, statusFilter, tierFilter]);

  const stats = useMemo(() => {
    if (!customers) return { total: 0, active: 0, pending: 0, suspended: 0 };
    return {
      total: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      pending: customers.filter(c => c.status === 'pending').length,
      suspended: customers.filter(c => c.status === 'suspended' || c.status === 'overdue').length
    };
  }, [customers]);

  const handleAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      subscriptionPlan: 'Basic 10Mbps',
      status: 'active',
      tier: 'Bronze'
    });
    setEditingId(null);
    setModalType('add');
  };

  const handleEdit = (customer: any) => {
    setEditingId(customer.id);
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      subscriptionPlan: customer.subscriptionPlan || 'Basic 10Mbps',
      status: (customer.status || 'active') as any,
      tier: customer.tier || 'Bronze'
    });
    setModalType('edit');
  };

  const handleView = (customer: any) => {
    setSelectedCustomer(customer);
    setModalType('view');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pelanggan ini?')) return;
    try {
      await customerService.delete(id);
      toast.success('Pelanggan berhasil dihapus');
      fetchCustomers();
    } catch (err) {
      toast.error('Gagal menghapus pelanggan');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === 'add') {
        const res = await customerService.create(formData as any);
        if (res.success) toast.success('Pelanggan berhasil ditambahkan');
      } else if (modalType === 'edit' && editingId) {
        const res = await customerService.update(editingId, formData as any);
        if (res.success) toast.success('Data pelanggan diperbarui');
      }
      setModalType(null);
      fetchCustomers();
    } catch (error) {
      toast.error('Gagal menyimpan data');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg font-black text-white">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pelanggan</h1>
              <p className="text-slate-500 font-medium tracking-tight">Kelola database pelanggan dan layanan ISP</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchCustomers}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex-shrink-0"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black flex items-center justify-center shadow-xl shadow-slate-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total" value={stats.total} icon={Users} gradient="from-blue-500 to-blue-600" />
        <StatCard title="Aktif" value={stats.active} icon={CheckCircle} gradient="from-emerald-500 to-emerald-600" />
        <StatCard title="Pending" value={stats.pending} icon={AlertCircle} gradient="from-amber-500 to-amber-600" />
        <StatCard title="Suspen" value={stats.suspended} icon={XCircle} gradient="from-rose-500 to-rose-600" />
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl whitespace-nowrap overflow-x-auto scrollbar-hide">
               <button onClick={() => setTierFilter(null)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${!tierFilter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>ALL TIERS</button>
               {['Platinum', 'Gold', 'Silver', 'Bronze'].map(t => (
                  <button key={t} onClick={() => setTierFilter(t)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${tierFilter === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{t}</button>
               ))}
            </div>
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl whitespace-nowrap overflow-x-auto scrollbar-hide">
               <button onClick={() => setStatusFilter(null)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${!statusFilter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>ALL STATUS</button>
               {['active', 'pending', 'suspended'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${statusFilter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{s}</button>
               ))}
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="flex items-center px-4 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input type="text" placeholder="Cari pelanggan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold w-48" />
            </div>
            <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden p-1 shadow-sm">
               <button onClick={() => setViewMode('list')} className={`p-2 transition-all rounded-xl ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                  <List size={18} />
               </button>
               <button onClick={() => setViewMode('grid')} className={`p-2 transition-all rounded-xl ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                  <LayoutGrid size={18} />
               </button>
            </div>
         </div>
      </div>

      {/* Main Container */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
                  <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kontak</th>
                  <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Tier</th>
                  <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo</th>
                  <th className="text-right py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5} className="py-8 px-8"><div className="h-4 bg-slate-100 rounded-full animate-pulse w-3/4"></div></td></tr>)
                ) : filteredCustomers.length === 0 ? (
                  <tr><td colSpan={5} className="py-24 text-center font-bold text-slate-300">Belum ada data pelanggan</td></tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="group hover:bg-slate-50 transition-all">
                      <td className="py-5 px-8">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                               {customer.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900 leading-tight">{customer.name}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{customer.subscriptionPlan || 'No Plan'}</p>
                            </div>
                         </div>
                      </td>
                      <td className="py-5 px-8">
                         <p className="text-xs font-bold text-slate-700">{customer.phone}</p>
                         <p className="text-[10px] font-medium text-slate-400 line-clamp-1">{customer.email}</p>
                      </td>
                      <td className="py-5 px-8">
                         <div className="flex flex-col gap-1">
                            <StatusBadge status={customer.status} />
                            <TierBadge tier={customer.tier} />
                         </div>
                      </td>
                      <td className="py-5 px-8">
                         <p className={`text-sm font-black ${customer.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            Rp {(customer.balance || 0).toLocaleString()}
                         </p>
                      </td>
                      <td className="py-5 px-8 text-right">
                         <div className="flex items-center justify-end space-x-2 opacity-30 group-hover:opacity-100 transition-all">
                            <button onClick={() => handleView(customer)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Eye size={16} /></button>
                            <button onClick={() => handleEdit(customer)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(customer.id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {loading ? (
              [...Array(8)].map((_, i) => <div key={i} className="h-64 bg-slate-100 rounded-[3rem] animate-pulse"></div>)
           ) : filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center">
                 <div className="flex justify-between items-center w-full mb-4">
                    <StatusBadge status={customer.status} />
                    <TierBadge tier={customer.tier} />
                 </div>
                 <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <Wifi size={40} />
                 </div>
                 <h3 className="text-lg font-black text-slate-900 mb-1 line-clamp-1">{customer.name}</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{customer.subscriptionPlan || 'No Plan'}</p>
                 <div className="bg-slate-50 px-6 py-2 rounded-2xl flex items-center mb-6 border border-slate-100">
                    <p className={`text-xl font-black ${customer.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>Rp {(customer.balance || 0).toLocaleString()}</p>
                 </div>
                 <div className="flex gap-2 w-full mt-auto">
                    <button onClick={() => handleView(customer)} className="flex-1 py-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all font-black text-[10px] tracking-widest uppercase">VIEW</button>
                    <button onClick={() => handleEdit(customer)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(customer.id)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                 </div>
              </div>
           ))}
        </div>
      )}

      {/* MODALS RENDERED AT THE END OF MAIN DIV FOR RELIABLE STACKING */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
           {/* Add/Edit Modal Content */}
           {(modalType === 'add' || modalType === 'edit') && (
             <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
               <div className="p-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {modalType === 'add' ? 'Tambah Pelanggan' : 'Ubah Data'}
                    </h2>
                    <button onClick={() => setModalType(null)} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Nama Lengkap</label>
                          <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" placeholder="Contoh: Budi Santoso" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Email</label>
                              <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" placeholder="budi@email.com" />
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">No. Telepon</label>
                              <input required type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" placeholder="0812..." />
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Alamat Pemasangan</label>
                           <textarea required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm h-24 resize-none" placeholder="Jl. Raya Nomor..." />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Paket</label>
                              <select value={formData.subscriptionPlan} onChange={(e) => setFormData({...formData, subscriptionPlan: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs appearance-none">
                                 <option value="Basic 10Mbps">Basic 10Mbps</option>
                                 <option value="Family 20Mbps">Family 20Mbps</option>
                                 <option value="Premium 50Mbps">Premium 50Mbps</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Status</label>
                              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs appearance-none">
                                 <option value="active">ACTIVE</option>
                                 <option value="pending">PENDING</option>
                                 <option value="suspended">SUSPENDED</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Tier</label>
                              <select value={formData.tier} onChange={(e) => setFormData({...formData, tier: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs appearance-none">
                                 <option value="Bronze">Bronze</option>
                                 <option value="Silver">Silver</option>
                                 <option value="Gold">Gold</option>
                                 <option value="Platinum">Platinum</option>
                              </select>
                           </div>
                        </div>
                     </div>
                     <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 mt-4"><Save size={20} /> SIMPAN DATA</button>
                  </form>
               </div>
             </div>
           )}

           {/* View Modal Content */}
           {modalType === 'view' && selectedCustomer && (
             <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                 <div className="relative h-24 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-end items-start border-b border-white/10">
                    <button onClick={() => setModalType(null)} className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all"><X size={20} /></button>
                 </div>
                 <div className="px-10 pb-10">
                    <div className="relative -mt-12 mb-6">
                       <div className="w-24 h-24 rounded-[2.5rem] bg-white p-1 shadow-xl">
                          <div className="w-full h-full rounded-[2.3rem] bg-slate-50 flex items-center justify-center text-3xl font-black text-slate-900">{selectedCustomer.name.charAt(0)}</div>
                       </div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{selectedCustomer.name}</h2>
                    <div className="flex items-center gap-2 mb-8">
                       <StatusBadge status={selectedCustomer.status} />
                       <TierBadge tier={selectedCustomer.tier} />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 mb-8">
                       <DetailRow icon={Mail} label="EMAIL" value={selectedCustomer.email || '-'} />
                       <DetailRow icon={Phone} label="PHONE" value={selectedCustomer.phone} />
                       <DetailRow icon={MapPin} label="ALAMAT" value={selectedCustomer.address} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PAKET</p>
                          <p className="text-sm font-black text-slate-900">{selectedCustomer.subscriptionPlan || 'N/A'}</p>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SALDO</p>
                          <p className={`text-sm font-black ${selectedCustomer.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>Rp {(selectedCustomer.balance || 0).toLocaleString()}</p>
                       </div>
                    </div>
                 </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, gradient }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 hover:shadow-xl transition-all duration-300">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center mb-6 shadow-lg`}><Icon size={28} /></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    active: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle },
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', icon: AlertCircle },
    suspended: { bg: 'bg-rose-50', text: 'text-rose-600', icon: XCircle },
    inactive: { bg: 'bg-slate-50', text: 'text-slate-400', icon: XCircle },
  };
  const config = configs[status as any] || configs.active;
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${config.bg} ${config.text}`}>
       <config.icon className="w-3 h-3 mr-2" /> {status}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
   const tiers: any = {
      Bronze: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Target },
      Silver: { bg: 'bg-slate-50', text: 'text-slate-400', icon: Medal },
      Gold: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: Star },
      Platinum: { bg: 'bg-purple-50', text: 'text-purple-600', icon: Crown },
   };
   const config = tiers[tier] || tiers.Bronze;
   const Icon = config.icon;
   return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${config.bg} ${config.text}`}>
         <Icon className="w-3 h-3 mr-2" /> {tier}
      </span>
   );
}

function DetailRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4">
       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Icon size={18} /></div>
       <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <p className="text-sm font-bold text-slate-700">{value}</p>
       </div>
    </div>
  );
}
