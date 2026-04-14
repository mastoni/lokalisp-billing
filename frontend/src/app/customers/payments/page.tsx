'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  CreditCard,
  ChevronRight,
  RefreshCw,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  XCircle,
  X,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

type Payment = {
  id: string;
  payment_method: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  transaction_id: string;
  created_at: string;
};

export default function CustomerPayments() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/portal/me/payments');
      if (res.data.success) {
        setPayments(res.data.data || []);
      }
    } catch (err: any) {
      toast.error('Gagal memuat history pembayaran');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleNewPayment = () => {
    toast.success('Mengarahkan ke halaman pembayaran...');
    // In a real app, redirect to a checkout page
    router.push('/customers/invoices'); 
  };

  const handleShareReceipt = async (payment: Payment) => {
    const text = `Konfirmasi Pembayaran Sembok-Bill\nID Transaksi: ${payment.transaction_id}\nJumlah: Rp ${Number(payment.amount).toLocaleString()}\nStatus: ${payment.status.toUpperCase()}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Resi Pembayaran Sembok-Bill',
          text: text,
          url: window.location.href
        });
        toast.success('Resi dibagikan!');
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Resi disalin ke clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Riwayat Bayar</h1>
          <p className="text-slate-500 font-medium">Lacak semua transaksi pembayaran Anda</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={fetchPayments}
             className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-purple-600 transition-all shadow-sm"
           >
             <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
           </button>
           <button 
             onClick={handleNewPayment}
             className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg shadow-purple-200 hover:bg-purple-600 transition-all"
           >
             <Plus className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))
        ) : payments.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100">
             <CreditCard className="w-16 h-16 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Belum ada transaksi</p>
          </div>
        ) : (
          payments.map((pay) => (
            <div 
              key={pay.id} 
              onClick={() => setSelectedPayment(pay)}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all cursor-pointer group"
            >
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${
                       pay.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                     }`}>
                        <ArrowUpRight size={24} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{pay.payment_method || 'Bank Transfer'}</p>
                        <p className="text-lg font-black text-slate-900">Rp {Number(pay.amount).toLocaleString()}</p>
                        <p className="text-xs font-medium text-slate-500">{new Date(pay.created_at).toLocaleString()}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <StatusBadge status={pay.status} />
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-8">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Detail Transaksi</h2>
                    <button onClick={() => setSelectedPayment(null)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                       <X className="w-6 h-6 text-slate-400" />
                    </button>
                 </div>

                 <div className="space-y-6">
                    <div className="p-8 bg-slate-50 rounded-[2rem] text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Jumlah Pembayaran</p>
                       <p className="text-4xl font-black text-slate-900 tracking-tight">Rp {Number(selectedPayment.amount).toLocaleString()}</p>
                       <div className="mt-4 inline-block">
                          <StatusBadge status={selectedPayment.status} />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center py-2 border-b border-slate-50">
                          <span className="text-slate-400 text-sm font-medium">Metode</span>
                          <span className="text-slate-900 font-black uppercase text-xs">{selectedPayment.payment_method || 'BANK TRANSFER'}</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-slate-50">
                          <span className="text-slate-400 text-sm font-medium">Transaction ID</span>
                          <span className="text-slate-900 font-bold text-xs">{selectedPayment.transaction_id || 'N/A'}</span>
                       </div>
                       <div className="flex justify-between items-center py-2 border-b border-slate-50">
                          <span className="text-slate-400 text-sm font-medium">Waktu</span>
                          <span className="text-slate-900 font-bold text-xs">{new Date(selectedPayment.created_at).toLocaleString()}</span>
                       </div>
                    </div>

                    {selectedPayment.status === 'completed' && (
                      <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle size={20} />
                         </div>
                         <p className="text-emerald-800 text-sm font-bold">Terima kasih! Pembayaran Anda berhasil dan telah kami terima.</p>
                      </div>
                    )}

                    <button 
                      onClick={() => handleShareReceipt(selectedPayment)}
                      className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-purple-600 transition-all flex items-center justify-center gap-3"
                    >
                       {copied ? <Check size={20} /> : <Share2 size={20} />}
                       {copied ? 'TERSALIN' : 'BAGIKAN RESI'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: any = {
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'SUKSES', icon: CheckCircle },
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'PENDING', icon: Clock },
    failed: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'GAGAL', icon: XCircle },
    processing: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'PROSES', icon: RefreshCw },
  };
  const s = config[status] || config.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black tracking-widest ${s.bg} ${s.text}`}>
       <Icon className="w-3 h-3 mr-2" />
       {s.label}
    </span>
  );
}
