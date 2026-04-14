'use client';

import { useState } from 'react';
import { 
  Search, 
  CreditCard, 
  SearchIcon,
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  History,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function PublicPaymentTrackingPage() {
  const [refNumber, setRefNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNumber.trim()) return;

    try {
      setLoading(true);
      const res = await api.get(`/payments/public/${refNumber}`);
      if (res.data.success) {
        setPayment(res.data.data);
      } else {
        toast.error('Data pembayaran tidak ditemukan');
      }
    } catch (err) {
      toast.error('Gagal melacak pembayaran. Periksa kembali nomor referensi.');
      setPayment(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      {/* Header / Hero */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 py-32 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
         
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="flex justify-center mb-8">
               <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/20 text-indigo-400 flex items-center justify-center animate-pulse shadow-2xl shadow-indigo-500/20 border border-indigo-500/50">
                  <ShieldCheck size={32} />
               </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Lacak Pembayaran</h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">Pantau status transaksi Anda secara real-time. Masukkan nomor referensi atau ID pembayaran Anda di bawah ini.</p>
            
            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
               <div className="absolute inset-0 bg-indigo-500/20 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all"></div>
               <div className="relative flex items-center p-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl">
                  <div className="pl-6 text-white/50"><Search size={24} /></div>
                  <input 
                    type="text" 
                    placeholder="Contoh: PAY-2026-X892" 
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white font-bold px-4 py-4 placeholder:text-white/30"
                  />
                  <button 
                    disabled={loading}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-black hover:bg-white hover:text-indigo-600 transition-all shadow-xl flex items-center gap-2"
                  >
                    {loading ? 'TRACKING...' : 'TRACK STATUS'}
                  </button>
               </div>
            </form>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-16 pb-32 relative z-20">
         {payment ? (
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
               <div className="p-10 md:p-16">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 pb-12 border-b border-slate-50">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl"><CreditCard size={28} /></div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">REFERENCE CODE</p>
                           <h2 className="text-2xl font-black text-slate-900 tracking-tight">{payment.payment_number}</h2>
                        </div>
                     </div>
                     <StatusIndicator status={payment.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                     <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ringkasan Transaksi</p>
                        <div className="space-y-4">
                           <InfoRow label="Invoice" value={payment.invoice_number} />
                           <InfoRow label="Metode" value={payment.payment_method} />
                           <InfoRow label="Tanggal" value={new Date(payment.payment_date).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })} />
                        </div>
                     </div>
                     <div className="flex flex-col justify-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jumlah Dibayar</p>
                        <p className="text-5xl font-black text-slate-900 tracking-tighter">Rp {Number(payment.amount).toLocaleString()}</p>
                        <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"><Zap size={14} /> Verifikasi Otomatis Aktif</p>
                     </div>
                  </div>

                  {payment.status === 'confirmed' ? (
                     <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200"><CheckCircle size={24} /></div>
                        <div>
                           <p className="text-sm font-black text-emerald-800">Pembayaran Terverifikasi</p>
                           <p className="text-xs font-bold text-emerald-600/70">Terima kasih. Layanan Anda telah diperbarui secara otomatis.</p>
                        </div>
                     </div>
                  ) : (
                     <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 animate-pulse"><Clock size={24} /></div>
                        <div>
                           <p className="text-sm font-black text-amber-800">Dalam Proses Verifikasi</p>
                           <p className="text-xs font-bold text-amber-600/70">Proses ini biasanya memakan waktu 1-5 menit. Silakan segarkan halaman ini.</p>
                        </div>
                     </div>
                  )}

                  <div className="mt-12 flex justify-center">
                     <button onClick={() => setPayment(null)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-all"><X size={16} /> Tutup Pelacakan</button>
                  </div>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
               <FeatureCard 
                  icon={ShieldCheck} title="Verified & Secure" 
                  description="Setiap transaksi diproses dengan sistem keamanan enkripsi tingkat tinggi." 
               />
               <FeatureCard 
                  icon={Activity} title="Real-time Tracking" 
                  description="Cek status pembayaran Anda kapan saja tanpa perlu login ke sistem." 
               />
            </div>
         )}
      </div>
    </div>
  );
}

function StatusIndicator({ status }: { status: string }) {
  const configs: any = {
    confirmed: { bg: 'bg-emerald-50/50', dot: 'bg-emerald-500', text: 'text-emerald-600', label: 'PAYMENT SUCCESS' },
    pending: { bg: 'bg-amber-50/50', dot: 'bg-amber-500', text: 'text-amber-600', label: 'VERIFICATION PENDING' },
    failed: { bg: 'bg-rose-50/50', dot: 'bg-rose-500', text: 'text-rose-600', label: 'TRANSACTION FAILED' },
  };
  const config = configs[status.toLowerCase()] || configs.pending;
  return (
    <div className={`flex items-center px-6 py-3 rounded-2xl ${config.bg} border border-current/10`}>
       <div className={`w-2.5 h-2.5 rounded-full ${config.dot} mr-3 shadow-lg shadow-current/20 animate-pulse`}></div>
       <span className={`text-[10px] font-black tracking-widest ${config.text}`}>{config.label}</span>
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-xs font-bold text-slate-400">{label}</span>
       <span className="text-sm font-black text-slate-900">{value}</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center flex flex-col items-center group hover:scale-105 transition-all">
       <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-inner"><Icon size={28} /></div>
       <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>
       <p className="text-xs font-medium text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
