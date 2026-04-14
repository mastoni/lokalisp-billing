'use client';

import { useState, useEffect } from 'react';
import { 
  Check, 
  ChevronRight, 
  Wifi, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  ArrowRight,
  Globe,
  Rocket,
  Search,
  Users,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

type Package = {
  id: string;
  package_name: string;
  description: string;
  price: number;
  speed: string;
};

export default function LandingPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get('/packages');
        if (res.data) {
          setPackages(res.data.filter((p: any) => p.is_active));
        }
      } catch (e) {
        console.error('Failed to fetch packages');
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl border-b border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-600/20">
              <Wifi className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white italic uppercase">Sembok<span className="text-indigo-500">Bill</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
            <a href="#features" className="hover:text-indigo-400 transition-colors">Layanan</a>
            <a href="#pricing" className="hover:text-indigo-400 transition-colors">Paket</a>
            <a href="#stats" className="hover:text-indigo-400 transition-colors">Statistik</a>
            <Link href="/login" className="px-6 py-2.5 bg-white text-slate-950 rounded-full hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5">LOGIN PORTAL</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] -mr-96 -mt-96 opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -ml-40 -mb-40 opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Terbaik di Wilayah Anda</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
              Internet Cepat <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Tanpa Batas</span>
            </h1>
            <p className="max-w-xl text-lg text-slate-400 font-medium leading-relaxed">
              Nikmati pengalaman menjelajah internet dengan kecepatan cahaya. Stabil, Aman, dan Terpercaya untuk kebutuhan rumah maupun bisnis Anda. "Jangan Ambil Pusing", biarkan kami yang urus koneksi Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#pricing" className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
                PILIH PAKET SEKARANG <ChevronRight size={18} />
              </a>
              <Link href="/customers" className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                CEK STATUS <Search size={18} />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative group">
             <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700"></div>
             <div className="relative w-full aspect-square bg-gradient-to-br from-indigo-500/20 to-slate-900 border border-white/10 rounded-[4rem] overflow-hidden flex items-center justify-center backdrop-blur-3xl shadow-2xl shadow-indigo-900/50">
                <Rocket className="text-white w-32 h-32 animate-bounce" />
                <div className="absolute bottom-10 left-10 p-6 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Kecepatan S.D</p>
                   <p className="text-4xl font-black text-white italic">100<span className="text-sm not-italic opacity-50 ml-1">Mbps</span></p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={ShieldCheck} 
              title="Keamanan Utama" 
              desc="Setiap koneksi dilindungi dengan firewall tingkat tinggi untuk menjamin privasi data Anda." 
            />
            <FeatureCard 
              icon={Zap} 
              title="Ultra Low Latency" 
              desc="Sangat cocok untuk gaming online, video conference, dan streaming 4K tanpa buffering." 
            />
            <FeatureCard 
              icon={Headphones} 
              title="Support 24/7" 
              desc="Tim teknisi kami selalu siap sedia membantu Anda kapanpun dibutuhkan." 
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">Paket Berlangganan</h2>
            <p className="text-slate-400 font-medium">Temukan paket yang paling sesuai dengan kebutuhan Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => <div key={i} className="h-[400px] bg-white/5 rounded-[3rem] animate-pulse"></div>)
            ) : (
              packages.map((pkg) => (
                <div key={pkg.id} className="group relative bg-white/5 border border-white/10 rounded-[3rem] p-10 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-500 flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                      <Zap size={24} />
                   </div>
                   <h3 className="text-xl font-black text-white uppercase italic mb-2">{pkg.package_name}</h3>
                   <span className="px-4 py-1 bg-white/5 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 border border-white/5">{pkg.speed}</span>
                   
                   <div className="flex items-end gap-1 mb-8">
                      <span className="text-4xl font-black text-white tracking-tighter">{formatIDR(pkg.price).replace('Rp', '')}</span>
                      <span className="text-xs font-bold opacity-40 mb-1">/ BULAN</span>
                   </div>

                   <p className="text-sm text-slate-400 font-medium mb-10 line-clamp-3">
                      {pkg.description || "Layanan internet berkualitas tinggi dengan dukungan teknis prioritas."}
                   </p>

                   <a 
                    href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20paket%20${encodeURIComponent(pkg.package_name)}`}
                    className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5 mt-auto"
                   >
                     PILIH PAKET
                   </a>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 skew-y-3 translate-y-20 opacity-5"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
          <StatBox label="Klien Puas" value="500+" icon={Users} />
          <StatBox label="Uptime" value="99.9%" icon={Activity} />
          <StatBox label="Area" value="12+" icon={Globe} />
          <StatBox label="Pertumbuhan" value="15%" icon={TrendingUp} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Wifi className="text-white" size={16} />
                </div>
                <span className="text-lg font-black tracking-tighter text-white italic uppercase">Sembok<span className="text-indigo-500">Bill</span></span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center md:text-left italic">
                Solusi Internet Tanpa Batas <br />
                "Jangan Ambil Pusing"
              </p>
           </div>
           
           <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Link href="/about" className="hover:text-white transition-colors">Tentang Kami</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Kebijakan</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Kontak</Link>
           </div>
           
           <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              © 2026 SEMBOK-BILL NETWORKS.
           </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] hover:border-indigo-500/30 transition-all group">
      <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-black text-white italic uppercase mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function StatBox({ label, value, icon: Icon }: any) {
  return (
    <div className="text-center group">
       <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-xl text-indigo-400 mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-all">
          <Icon size={20} />
       </div>
       <p className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 italic uppercase">{value}</p>
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}

function TrendingUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
