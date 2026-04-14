'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Users,
  Plus,
  Shield,
  Search,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Save,
  UserPlus,
  ArrowLeft,
  Key,
  ShieldCheck,
  UserCog,
  UserCheck,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import api from '@/lib/api';

type AdminUser = {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'technician' | 'agent';
  status: 'active' | 'inactive';
};

export default function UsersSettingsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: 'technician' as any,
    password: '',
    status: 'active' as any
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin-users');
      if (res.data.success) setUsers(res.data.data);
    } catch (e) {
      // Mocking for now if endpoint not ready
      setUsers([
        { id: '1', username: 'admin_tony', email: 'admin@gembok.com', role: 'admin', status: 'active' },
        { id: '2', username: 'tech_budi', email: 'budi@gembok.com', role: 'technician', status: 'active' },
        { id: '3', username: 'agent_saka', email: 'saka@gembok.com', role: 'agent', status: 'inactive' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setForm({ username: '', email: '', role: 'technician', password: '', status: 'active' });
    setModalType('add');
  };

  const handleEdit = (u: AdminUser) => {
    setSelectedUser(u);
    setForm({ username: u.username, email: u.email, role: u.role, password: '', status: u.status });
    setModalType('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (modalType === 'add') {
        await api.post('/admin-users', form);
        toast.success('Pengguna berhasil ditambahkan');
      } else {
        await api.put(`/admin-users/${selectedUser?.id}`, form);
        toast.success('Informasi pengguna diperbarui');
      }
      setModalType(null);
      fetchUsers();
    } catch (err: any) {
      toast.error('Gagal memproses data: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white"><Shield className="w-7 h-7" /></div>
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
               <p className="text-slate-500 font-medium">Manage administrative staff and portal access permissions.</p>
            </div>
         </div>
         <button onClick={handleAdd} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 flex items-center gap-2 hover:bg-slate-800 transition-all">
            <UserPlus size={20} /> Add Staff
         </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-8 pb-4 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900">System Users</h2>
            <button onClick={fetchUsers} className="p-2 text-slate-400 hover:text-slate-900 transition-all"><RefreshCw size={20} className={loading ? 'animate-spin' : ''} /></button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-slate-50/50">
                  <tr>
                     <th className="text-left py-4 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Username</th>
                     <th className="text-left py-4 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Email</th>
                     <th className="text-left py-4 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Role</th>
                     <th className="text-left py-4 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Status</th>
                     <th className="text-right py-4 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {users.map(u => (
                    <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="py-5 px-8 flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${u.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>{u.username.charAt(0).toUpperCase()}</div>
                          <span className="text-sm font-black text-slate-800">{u.username}</span>
                       </td>
                       <td className="py-5 px-8 text-sm font-medium text-slate-400">{u.email}</td>
                       <td className="py-5 px-8">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-50 text-purple-600' : u.role === 'technician' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>{u.role}</span>
                       </td>
                       <td className="py-5 px-8">
                          {u.status === 'active' ? <CheckCircle className="text-emerald-500 w-5 h-5" /> : <XCircle className="text-slate-300 w-5 h-5" />}
                       </td>
                       <td className="py-5 px-8 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                             <button onClick={() => handleEdit(u)} className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 shadow-sm transition-all"><Edit size={16} /></button>
                             <button className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-600 shadow-sm transition-all"><Trash2 size={16} /></button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {modalType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full p-10 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">{modalType === 'add' ? 'New Staff Access' : 'Update Access'}</h2>
                 <button onClick={() => setModalType(null)} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Username</label>
                    <input required type="text" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" placeholder="e.g. tony_stark" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Email</label>
                       <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" placeholder="staff@gembok.com" />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Access Role</label>
                       <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value as any})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm">
                          <option value="admin">Administrator</option>
                          <option value="technician">Technician</option>
                          <option value="agent">Agent / Sales</option>
                       </select>
                    </div>
                 </div>
                 {modalType === 'add' && (
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Initial Password</label>
                      <input required type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" placeholder="Min 8 characters..." />
                   </div>
                 )}
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</span>
                    <button type="button" onClick={() => setForm({...form, status: form.status === 'active' ? 'inactive' : 'active'})} className={`w-12 h-6 rounded-full p-1 transition-all ${form.status === 'active' ? 'bg-slate-900' : 'bg-slate-300'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full transition-all ${form.status === 'active' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                 </div>
                 <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 mt-4">
                    <Save size={20} /> {saving ? 'SAVING...' : 'SAVE USER'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
