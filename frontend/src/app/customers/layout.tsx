'use client';

import RoleGuard from '@/components/auth/RoleGuard';
import RoleShell from '@/components/layout/RoleShell';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['customer']}>
      <div className="pb-24 lg:pb-0"> {/* Add padding for bottom nav on mobile */}
        <RoleShell title="Billing Sembok" accent="primary">
          {children}
        </RoleShell>
        <MobileBottomNav />
      </div>
    </RoleGuard>
  );
}
