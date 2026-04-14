'use client';

import { useState } from 'react';
import { 
  Users, 
  Search, 
  Wifi, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  WifiOff,
  Package,
  Calendar,
  Zap,
  ArrowRight,
  UserCheck,
  Globe,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function PublicCustomerLookupPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    try {
      setLoading(true);
      const res = await api.get(`/customers/public/${phone}`);
      if (res.data.success) {
        setCustomer(res.data.data);
      } else {
        toast.error('Data pelanggan tidak ditemukan');
      }
    } catch (err) {
      toast.error('Gagal mencari data. Pastikan nomor HP Anda terdaftar.');
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-rose-100">
      {/* Header / Hero */}
      <div className="bg-slate-900 py-32 px-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-600 rounded-full blur-[180px] opacity-10 animate-pulse"></div>
         </div>
         
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="flex justify-center mb-8">
               <div className="w-16 h-16 rounded-[1.8rem] bg-rose-500/20 text-rose-500 flex items-center justify-center shadow-2xl shadow-rose-500/10 border border-rose-500/30">
                  <Wifi size={32} />
               </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Cek Status Layanan</h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">Pantau status koneksi internet, paket aktif, dan masa berlaku layanan Anda kapan saja secara real-time.</p>
            
            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
               <div className="absolute inset-0 bg-rose-500/10 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all"></div>
               <div className="relative flex items-center p-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl">
                  <div className="pl-6 text-white/50"><Search size={24} /></div>
                  <input 
                    type="text" 
                    placeholder="Masukkan Nomor HP Terdaftar" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white font-bold px-4 py-4 placeholder:text-white/30"
                  />
                  <button 
                    disabled={loading}
                    className="px-8 py-4 bg-rose-600 text-white rounded-[2rem] font-black hover:bg-white hover:text-rose-600 transition-all shadow-xl flex items-center gap-2"
                  >
                    {loading ? 'MEMERIKSA...' : 'LIHAT STATUS'}
                  </button>
               </div>
            </form>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-16 pb-32 relative z-20">
         {customer ? (
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700">
               <div className="p-10 md:p-16">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                     <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[1.8rem] bg-slate-50 flex items-center justify-center text-slate-900 text-2xl font-black shadow-inner">{customer.name.charAt(0)}</div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{customer.name}</h2>
                           </div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><UserCheck size={12} className="text-rose-500" /> PELANGGAN TERVERIFIKASI</p>
                        </div>
                     </div>
                     <StatusChip status={customer.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                     <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col justify-between">
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Paket Aktif</p>
                           <h3 className="text-2xl font-black text-slate-900">{customer.subscriptionPlan}</h3>
                           <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-1"><Zap size={14} className="text-amber-500" /> Unlimited High-Speed Fiber</p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-200 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Globe size={16} className="text-indigo-500" />
                              <span className="text-xs font-black text-slate-700">IP Static Ready</span>
                           </div>
                           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest truncate">Connected</span>
                        </div>
                     </div>
                     
                     <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Informasi Keuangan</p>
                        <div className="space-y-6">
                           <div>
                              <p className="text-xs font-medium text-white/50 mb-1">Total Tagihan Berjalan</p>
                              <p className="text-3xl font-black text-white">Rp {Number(customer.balance).toLocaleString()}</p>
                           </div>
                           <button 
                             onClick={() => window.location.href = `/customers/invoices`}
                             className="w-full py-4 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-white/10"
                           >
                              Rincian Tagihan <ArrowRight size={14} />
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-center">
                     <button onClick={() => setCustomer(null)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-all"><X size={16} /> Tutup Pencarian</button>
                  </div>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <FeatureCard 
                  icon={Wifi} title="Koneksi Fiber" 
                  description="Jaringan internet stabil dengan teknologi fiber optic murni hingga ke rumah." 
               />
               <FeatureCard 
                  icon={CheckCircle} title="Transparan" 
                  description="Cek status dan tagihan Anda kapan saja tanpa biaya tambahan." 
               />
               <FeatureCard 
                  icon={Package} title="Paket Fleksibel" 
                  description="Pilihan paket yang dapat disesuaikan dengan kebutuhan harian Anda." 
               />
            </div>
         )}
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const configs: any = {
    active: { bg: 'bg-emerald-50 text-emerald-600', icon: CheckCircle, label: 'LAYANAN AKTIF' },
    suspended: { bg: 'bg-rose-50 text-rose-600', icon: WifiOff, label: 'LAYANAN TERPUTUS' },
    pending: { bg: 'bg-amber-50 text-amber-600', icon: Clock, label: 'MENUNGGU AKTIVASI' },
  };
  const config = configs[status.toLowerCase()] || configs.active;
  const Icon = config.icon;
  return (
    <div className={`flex items-center px-6 py-3 rounded-2xl ${config.bg} border border-current/10 whitespace-nowrap`}>
       <Icon className="w-4 h-4 mr-2" />
       <span className="text-[10px] font-black tracking-widest uppercase">{config.label}</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
       <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
       <div className="w-14 h-14 rounded-2xl bg-slate-50 text-rose-600 flex items-center justify-center mb-8 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 shadow-inner relative z-10"><Icon size={28} /></div>
       <h3 className="text-xl font-black text-slate-900 mb-2 relative z-10">{title}</h3>
       <p className="text-xs font-medium text-slate-500 leading-relaxed relative z-10">{description}</p>
    </div>
  );
}
