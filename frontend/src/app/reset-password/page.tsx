'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle, ArrowRight, ShieldCheck, AlertCircle, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Token tidak valid atau sudah kadaluarsa');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword: password,
      });

      if (res.data.success) {
        setSuccess(true);
        toast.success('Password berhasil direset');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mereset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Token Invalid</h1>
        <p className="text-slate-500 font-medium mb-8">Link reset password tidak valid atau sudah digunakan.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all"
        >
          Kembali ke Login
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">Password Terupdate!</h1>
        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
          Password Anda telah berhasil diubah. Silakan gunakan password baru untuk masuk ke akun Anda.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
        >
          Masuk Sekarang <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Set Password</h1>
          <p className="text-slate-500 font-medium text-sm">Create a new secure password for your account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-5 mb-2 block">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[2rem] text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 transition-all text-lg"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="relative group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-5 mb-2 block">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <RefreshCcw className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[2rem] text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 transition-all text-lg"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all shadow-xl shadow-slate-200 overflow-hidden disabled:opacity-70"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Update Password
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-10" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="w-full text-center text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest pt-2"
        >
          Cancel and return to Login
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,#f1f5f9,transparent),radial-gradient(circle_at_bottom_left,#e2e8f0,transparent)]">
      <div className="w-full max-w-lg">
        <div className="bg-white/70 backdrop-blur-2xl p-10 md:p-14 rounded-[4rem] shadow-2xl shadow-indigo-100 border border-white/50">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20">
               <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
               <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading...</p>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
        
        <p className="mt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Powered by Billing Sembok v2.0
        </p>
      </div>
    </div>
  );
}
