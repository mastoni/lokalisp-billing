'use client';

import { useState } from 'react';
import { 
  Search, 
  FileText, 
  CreditCard, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Printer,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function PublicInvoicePage() {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber.trim()) return;

    try {
      setLoading(true);
      const res = await api.get(`/invoices/public/${invoiceNumber}`);
      if (res.data.success) {
        setInvoice(res.data.data);
      } else {
        toast.error('Invoice tidak ditemukan');
      }
    } catch (err) {
      toast.error('Gagal mencari invoice. Pastikan nomor benar.');
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-purple-100">
      {/* Hero / Hero Search */}
      <div className="bg-slate-900 pt-32 pb-60 px-6 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-[120px]"></div>
         </div>
         
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Cek Tagihan Layanan</h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">Masukkan nomor invoice Anda untuk melihat rincian tagihan dan melakukan pembayaran secara langsung.</p>
            
            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
               <div className="absolute inset-0 bg-purple-500/20 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all"></div>
               <div className="relative flex items-center p-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl">
                  <div className="pl-6 text-white/50"><Search size={24} /></div>
                  <input 
                    type="text" 
                    placeholder="Contoh: INV-2026-001" 
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white font-bold px-4 py-4 placeholder:text-white/30"
                  />
                  <button 
                    disabled={loading}
                    className="px-8 py-4 bg-white text-slate-900 rounded-[2rem] font-black hover:bg-purple-500 hover:text-white transition-all shadow-xl flex items-center gap-2"
                  >
                    {loading ? 'MEMPROSES...' : 'CEK SEKARANG'}
                  </button>
               </div>
            </form>
         </div>
      </div>

      {/* Result Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-32 pb-32">
         {invoice ? (
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700">
               <div className="p-10 md:p-16">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                     <div>
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg"><FileText size={24} /></div>
                           <h2 className="text-3xl font-black text-slate-900">Invoice Details</h2>
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">NOMOR INVOICE: <span className="text-slate-900 ml-1">{invoice.invoice_number}</span></p>
                     </div>
                     <StatusBadge status={invoice.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                     <div className="space-y-6">
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diberikan Kepada</p>
                           <p className="text-xl font-black text-slate-900">{invoice.customer_name}</p>
                           <p className="text-sm font-medium text-slate-500 mt-1">{invoice.customer_phone}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Paket Layanan</p>
                           <p className="text-sm font-bold text-slate-700">{invoice.package_name}</p>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center"><Calendar size={20} /></div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batas Waktu</p>
                              <p className="text-sm font-bold text-slate-700">{new Date(invoice.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center"><CreditCard size={20} /></div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metode Bayar</p>
                              <p className="text-sm font-bold text-slate-700">Virtual Account / Gerai Retail</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tagihan</p>
                        <p className="text-5xl font-black text-slate-900 tracking-tighter">Rp {Number(invoice.amount).toLocaleString()}</p>
                     </div>
                     {invoice.status === 'pending' && (
                        <button 
                           onClick={() => window.location.href = `/pay/${invoice.invoice_number}`}
                           className="w-full md:w-auto px-10 py-5 bg-purple-600 text-white rounded-3xl font-black text-lg hover:bg-slate-900 transition-all shadow-xl shadow-purple-200 flex items-center justify-center gap-3"
                        >
                           BAYAR SEKARANG <ArrowRight size={20} />
                        </button>
                     )}
                  </div>
               </div>

               <div className="bg-slate-900 p-8 flex flex-col sm:flex-row items-center justify-center gap-10">
                  <button onClick={() => window.print()} className="text-white/50 hover:text-white transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2"><Printer size={16} /> Print Invoice</button>
                  <button onClick={() => toast.success('Mulai mengunduh...')} className="text-white/50 hover:text-white transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2"><Download size={16} /> Download PDF</button>
                  <button onClick={() => setInvoice(null)} className="text-white/50 hover:text-rose-400 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2"><X size={16} /> Close View</button>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <InfoCard 
                  icon={Clock} title="Cepat & Mudah" 
                  description="Cukup masukkan nomor invoice atau nomor pelanggan untuk melihat tagihan terbaru." 
               />
               <InfoCard 
                  icon={CreditCard} title="Banyak Metode" 
                  description="Mendukung pembayaran via Transfer Bank, E-Wallet, dan Gerai Retail terdekat." 
               />
               <InfoCard 
                  icon={CheckCircle} title="Hasil Instan" 
                  description="Verifikasi pembayaran dilakukan secara otomatis dan layanan langsung aktif." 
               />
            </div>
         )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    paid: { bg: 'bg-emerald-50 text-emerald-600', label: 'SUDAH LUNAS', icon: CheckCircle },
    pending: { bg: 'bg-amber-50 text-amber-600', label: 'MENUNGGU PEMBAYARAN', icon: Clock },
    cancelled: { bg: 'bg-slate-100 text-slate-400', label: 'DIBATALKAN', icon: AlertCircle },
  };
  const config = configs[status.toLowerCase()] || configs.pending;
  const Icon = config.icon;
  return (
    <div className={`flex items-center px-6 py-3 rounded-full text-[10px] font-black tracking-widest uppercase ${config.bg} border border-current/10`}>
       <Icon className="w-4 h-4 mr-2" /> {config.label}
    </div>
  );
}

function InfoCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
       <div className="w-16 h-16 rounded-2xl bg-slate-50 text-purple-600 flex items-center justify-center mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500"><Icon size={32} /></div>
       <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
       <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
    </div>
  );
}
