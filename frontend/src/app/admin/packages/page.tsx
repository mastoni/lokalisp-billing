'use client';

import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Zap,
  Wifi,
  DollarSign,
  Monitor,
  Cpu,
  RefreshCw,
  X,
  Save,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Download,
  Info,
  Users
} from 'lucide-react';
import api from '@/lib/api';

type ISPPackage = {
  id: string;
  package_name: string;
  speed: number;
  price: number;
  description: string;
  is_active: boolean;
  customer_count?: number;
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<ISPPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<ISPPackage | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    package_name: '',
    speed: 10,
    price: 0,
    description: '',
    is_active: true
  });

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/packages');
      if (res.data.success) {
        setPackages(res.data.data || []);
      }
    } catch (err: any) {
      toast.error('Gagal mengambil data paket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const filteredPackages = useMemo(() => {
    return packages.filter(p => 
      (p.package_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [packages, searchTerm]);

  const handleAdd = () => {
    setFormData({
      package_name: '',
      speed: 10,
      price: 0,
      description: '',
      is_active: true
    });
    setModalType('add');
  };

  const handleEdit = (pkg: ISPPackage) => {
    setSelectedPackage(pkg);
    setFormData({
      package_name: pkg.package_name,
      speed: pkg.speed,
      price: pkg.price,
      description: pkg.description || '',
      is_active: pkg.is_active
    });
    setModalType('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (modalType === 'add') {
        const res = await api.post('/packages', formData);
        if (res.data.success) toast.success('Paket baru ditambahkan');
      } else {
        const res = await api.put(`/packages/${selectedPackage?.id}`, formData);
        if (res.data.success) toast.success('Paket diperbarui');
      }
      setModalType(null);
      fetchPackages();
    } catch (err: any) {
      toast.error('Gagal menyimpan paket');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus paket ini?')) return;
    try {
      await api.delete(`/packages/${id}`);
      toast.success('Paket dihapus');
      fetchPackages();
    } catch (err: any) {
      toast.error('Gagal menghapus paket');
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg text-white font-black">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Packages</h1>
              <p className="text-slate-500 font-medium tracking-tight">Kelola daftar paket layanan internet (ISP)</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchPackages}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 shadow-sm hover:bg-slate-50 transition-all font-bold"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black flex items-center justify-center shadow-xl shadow-slate-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Package
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
         <div className="flex items-center px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Cari paket..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-bold w-full md:w-80" 
            />
         </div>
         <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Info size={14} /> Total {packages.length} Packages
         </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-80 bg-slate-100 rounded-[3rem] animate-pulse"></div>)
        ) : filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
             <div className={`absolute top-0 right-0 w-2 h-full ${pkg.is_active ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
             
             <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-[1.8rem] bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                   <Wifi size={32} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                   <button onClick={() => handleEdit(pkg)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Edit size={16} /></button>
                   <button onClick={() => handleDelete(pkg.id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                </div>
             </div>

             <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight line-clamp-1">{pkg.package_name}</h2>
             <div className="flex items-center gap-2 mb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <TrendingUp size={14} className="text-emerald-500" /> {pkg.speed} Mbps Upload / Download
             </div>

             <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-8">
                <p className="text-xs font-bold text-slate-500 mb-1">Monthly Cost</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(pkg.price)}</p>
             </div>

             <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center text-xs font-bold text-slate-400">
                   <Users size={14} className="mr-1" /> {pkg.customer_count || 0} Users
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase ${pkg.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                   {pkg.is_active ? 'ACTIVE' : 'DISABLED'}
                </span>
             </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full p-10 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">{modalType === 'add' ? 'New Package' : 'Edit Package'}</h2>
                 <button onClick={() => setModalType(null)} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Name</label>
                    <input required type="text" value={formData.package_name} onChange={(e) => setFormData({...formData, package_name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" placeholder="e.g. Family 20Mbps" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Speed (Mbps)</label>
                       <input required type="number" value={formData.speed} onChange={(e) => setFormData({...formData, speed: Number(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" />
                    </div>
                    <div>
                       <label className="text-[10px) font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Monthly Price</label>
                       <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm h-24 resize-none" placeholder="Enter package details..." />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Status</span>
                    <button type="button" onClick={() => setFormData({...formData, is_active: !formData.is_active})} className={`w-12 h-6 rounded-full p-1 transition-all ${formData.is_active ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full transition-all ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                 </div>
                 <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 mt-4">
                    <Save size={20} /> {saving ? 'SAVING...' : 'SAVE PACKAGE'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
