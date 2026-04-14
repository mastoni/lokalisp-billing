'use client';

import { useState, useEffect } from 'react';
import { 
  Wrench, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  MoreVertical,
  Zap,
  Ticket,
  ClipboardList,
  User,
  RefreshCw,
  LogOut,
  Calendar,
  MessageCircle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

type SupportTicket = {
  id: string;
  ticket_code: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  subject: string;
  description: string;
  created_at: string;
};

export default function TechnicianDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, scheduled: 0, active: 0, completed: 0 });
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateNotes, setUpdateNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/technician/dashboard');
      if (res.data.success) {
        setStats(res.data.data.stats);
        setTickets(res.data.data.tickets);
      }
    } catch (e: any) {
      toast.error('Gagal mengambil data operasional');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newStatus) return;

    try {
      toast.loading('Memperbarui status...', { id: 'update-ticket' });
      const res = await api.put(`/technician/tickets/${selectedTicket.id}`, {
        status: newStatus,
        notes: updateNotes
      });
      if (res.data.success) {
        toast.success('Status tiket diperbarui', { id: 'update-ticket' });
        setShowUpdateModal(false);
        setUpdateNotes('');
        fetchData();
      }
    } catch (e) {
      toast.error('Gagal memperbarui tiket', { id: 'update-ticket' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-indigo-100">
      {/* Header Area */}
      <div className="bg-slate-900 pt-16 pb-32 px-6 relative overflow-hidden">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/20"><Wrench size={24} /></div>
                  <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Technician <span className="text-indigo-400">Hub</span></h1>
               </div>
               <p className="text-slate-400 font-medium">Selamat datang kembali. Anda memiliki {stats.active} tugas aktif hari ini.</p>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={fetchData} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all">
                  <RefreshCw className={loading ? 'animate-spin' : ''} size={20} />
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16">
         {/* Stats Grid */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard icon={Ticket} label="Tiket Open" value={stats.pending} color="bg-rose-500" />
            <StatCard icon={Calendar} label="Terjadwalkan" value={stats.scheduled} color="bg-amber-500" />
            <StatCard icon={Activity} label="Sedang Jalan" value={stats.active} color="bg-indigo-500" />
            <StatCard icon={CheckCircle2} label="Selesai" value={stats.completed} color="bg-emerald-500" />
         </div>

         {/* Tickets List */}
         <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden min-h-[500px]">
            <div className="p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-50">
               <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Support Tickets</h2>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Daftar tugas pemeliharaan & perbaikan</p>
               </div>
               <div className="flex gap-2">
                  <button className="px-6 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">SEMUA</button>
                  <button className="px-6 py-2 rounded-xl bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">PENDING</button>
               </div>
            </div>

            <div className="p-6 md:p-10 space-y-6">
               {loading ? (
                 [...Array(3)].map((_, i) => <div key={i} className="h-32 bg-slate-50 rounded-3xl animate-pulse"></div>)
               ) : tickets.length === 0 ? (
                 <div className="py-20 text-center flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-6"><ClipboardList size={40} /></div>
                    <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Belum ada tiket tugas saat ini</p>
                 </div>
               ) : (
                 tickets.map((t) => (
                   <div key={t.id} className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 group hover:bg-white hover:shadow-2xl hover:border-indigo-100 transition-all duration-500">
                      <div className="flex flex-col lg:flex-row justify-between gap-8">
                         <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                               <span className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black tracking-widest uppercase">{t.ticket_code}</span>
                               <PriorityBadge priority={t.priority} />
                               <StatusBadge status={t.status} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors uppercase italic">{t.subject}</h3>
                            <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-6">{t.description}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div className="flex items-center gap-3 text-slate-600">
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400"><User size={16} /></div>
                                  <span className="text-xs font-bold">{t.customer_name}</span>
                               </div>
                               <div className="flex items-center gap-3 text-slate-600">
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400"><Phone size={16} /></div>
                                  <span className="text-xs font-bold">{t.customer_phone}</span>
                               </div>
                               <div className="flex items-center gap-3 text-slate-600 sm:col-span-2">
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400"><MapPin size={16} /></div>
                                  <span className="text-xs font-bold leading-tight">{t.customer_address}</span>
                               </div>
                            </div>
                         </div>
                         <div className="lg:w-48 flex flex-col justify-between items-end gap-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{new Date(t.created_at).toLocaleDateString()}</span>
                            <button 
                              onClick={() => { setSelectedTicket(t); setNewStatus(t.status); setShowUpdateModal(true); }}
                              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                            >
                               UPDATE STATUS <ChevronRight size={16} />
                            </button>
                         </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full p-10 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Update <span className="text-indigo-600">Ticket</span></h2>
                 <button onClick={() => setShowUpdateModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={24} /></button>
              </div>

              <div className="space-y-8">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Pilih Status Baru</label>
                    <div className="grid grid-cols-2 gap-3">
                       {['assigned', 'in_progress', 'resolved', 'closed'].map((s) => (
                         <button 
                           key={s}
                           type="button"
                           onClick={() => setNewStatus(s)}
                           className={`py-3 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${newStatus === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-200'}`}
                         >
                           {s.replace('_', ' ')}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Catatan Teknisi</label>
                    <textarea 
                      rows={4}
                      value={updateNotes}
                      onChange={(e) => setUpdateNotes(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm resize-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                      placeholder="e.g. ONT diganti, koneksi normal..."
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <button className="py-5 bg-slate-50 text-slate-400 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-100" onClick={() => setShowUpdateModal(false)}>BATAL</button>
                    <button className="py-5 bg-indigo-600 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-slate-900" onClick={handleUpdateStatus}>SIMPAN</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center">
       <div className={`w-12 h-12 rounded-2xl ${color} text-white flex items-center justify-center mb-4 shadow-lg shadow-current/20`}><Icon size={24} /></div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">{label}</p>
       <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const configs: any = {
    critical: 'bg-rose-100 text-rose-600',
    high: 'bg-orange-100 text-orange-600',
    medium: 'bg-indigo-100 text-indigo-600',
    low: 'bg-slate-100 text-slate-600',
  };
  return <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase ${configs[priority] || configs.low}`}>{priority}</span>;
}

function StatusBadge({ status }: { status: string }) {
   const configs: any = {
      open: 'text-slate-400',
      assigned: 'text-amber-500',
      in_progress: 'text-indigo-500',
      resolved: 'text-emerald-500 text-black font-black',
      closed: 'text-slate-300',
   };
   return (
     <div className="flex items-center gap-1.5 ml-2">
        <div className={`w-1.5 h-1.5 rounded-full bg-current ${configs[status]}`}></div>
        <span className={`text-[9px] font-black tracking-widest uppercase ${configs[status]}`}>{status.replace('_', ' ')}</span>
     </div>
   );
}
