'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Gift, 
  User, 
  FileText,
  LayoutDashboard
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Beranda',
      href: '/customers',
      icon: Home,
    },
    {
      name: 'Reward',
      href: '/customers/rewards',
      icon: Gift,
    },
    {
      name: 'Tagihan',
      href: '/customers/invoices',
      icon: FileText,
    },
    {
      name: 'Profil',
      href: '/customers/profile',
      icon: User,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/customers' && pathname === '/customers') return true;
    if (path !== '/customers' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0,05)]">
      {navItems.map((item) => (
        <Link 
          key={item.href} 
          href={item.href}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            isActive(item.href) 
              ? 'text-purple-600 scale-110' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-2 rounded-xl transition-all ${isActive(item.href) ? 'bg-purple-50' : ''}`}>
            <item.icon className="w-6 h-6" />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive(item.href) ? 'opacity-100' : 'opacity-0'}`}>
            {item.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
