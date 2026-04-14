'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FileText,
  Download,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  RefreshCw,
  X,
  CreditCard,
  FileDown
} from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

type Invoice = {
  id: string;
  invoice_number: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  created_at: string;
  billing_period_start: string;
  billing_period_end: string;
};

export default function CustomerInvoices() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [downloading, setDownloading] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/portal/me/invoices');
      if (res.data.success) {
        setInvoices(res.data.data || []);
      }
    } catch (err: any) {
      toast.error('Gagal memuat invoice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePayNow = (invoice: Invoice) => {
    toast.success('Mengarahkan ke pembayaran...');
    // Real app would redirect to Midtrans or other gateway
    // router.push(`/customers/payments/checkout/${invoice.id}`);
    router.push('/customers/payments'); 
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    setDownloading(true);
    toast.loading('Menyiapkan file PDF...', { id: 'pdf-download' });
    
    // Simulate API call for PDF generation
    setTimeout(() => {
      toast.success('Invoice berhasil diunduh', { id: 'pdf-download' });
      setDownloading(false);
      
      // Create mockup download
      const content = `INVOICE: ${invoice.invoice_number}\nAmount: Rp ${invoice.amount}\nPeriod: ${invoice.billing_period_start} - ${invoice.billing_period_end}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoice.invoice_number}.txt`; e // Simplified as .txt for now
      a.click();
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tagihan Saya</h1>
          <p className="text-slate-500 font-medium tracking-tight">Cek status dan history pembayaran internet Anda</p>
        </div>
        <button 
          onClick={fetchInvoices}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-purple-600 transition-all shadow-sm"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))
        ) : invoices.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200"><FileText size={32} /></div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Belum ada tagihan terbit</p>
          </div>
        ) : (
          invoices.map((inv) => (
            <div 
              key={inv.id} 
              onClick={() => setSelectedInvoice(inv)}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all cursor-pointer group"
            >
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${
                       inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                     }`}>
                        <FileText size={24} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{inv.invoice_number}</p>
                        <p className="text-lg font-black text-slate-900">Rp {Number(inv.amount).toLocaleString()}</p>
                        <p className="text-xs font-medium text-slate-500">Periode: {new Date(inv.billing_period_start).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <StatusBadge status={inv.status} />
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-8">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Detail Tagihan</h2>
                    <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                       <X className="w-6 h-6 text-slate-400" />
                    </button>
                 </div>

                 <div className="space-y-6">
                    <div className="p-8 bg-slate-50 rounded-[2rem] text-center border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Tagihan</p>
                       <p className="text-4xl font-black text-slate-900 tracking-tight">Rp {Number(selectedInvoice.amount).toLocaleString()}</p>
                       <div className="mt-4 inline-block">
                          <StatusBadge status={selectedInvoice.status} />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Invoice</p>
                          <p className="text-xs font-bold text-slate-700">{selectedInvoice.invoice_number}</p>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Jatuh Tempo</p>
                          <p className="text-xs font-bold text-slate-700">{new Date(selectedInvoice.due_date).toLocaleDateString()}</p>
                       </div>
                    </div>

                    <div className="space-y-3 px-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                          <span className="text-slate-400">Periode</span>
                          <span className="text-slate-900">{new Date(selectedInvoice.billing_period_start).toLocaleDateString()} - {new Date(selectedInvoice.billing_period_end).toLocaleDateString()}</span>
                       </div>
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                          <span className="text-slate-400">Terbit</span>
                          <span className="text-slate-900">{new Date(selectedInvoice.created_at).toLocaleDateString()}</span>
                       </div>
                    </div>

                    {selectedInvoice.status !== 'paid' && (
                      <button 
                        onClick={() => handlePayNow(selectedInvoice)}
                        className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-purple-600 transition-all shadow-xl shadow-purple-200 flex items-center justify-center gap-2"
                      >
                         <CreditCard size={20} /> BAYAR SEKARANG
                      </button>
                    )}

                    <button 
                      onClick={() => handleDownloadPDF(selectedInvoice)}
                      disabled={downloading}
                      className="w-full border-2 border-slate-100 text-slate-600 py-4 rounded-[2rem] font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                       {downloading ? <RefreshCw className="animate-spin" size={18} /> : <FileDown size={18} />}
                       UNDUH PDF
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
    paid: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'LUNAS', icon: CheckCircle },
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'BELUM BAYAR', icon: Clock },
    overdue: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'TERLAMBAT', icon: XCircle },
    cancelled: { bg: 'bg-slate-50', text: 'text-slate-400', label: 'BATAL', icon: XCircle },
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
