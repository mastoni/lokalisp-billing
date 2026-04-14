'use client';

import RoleGuard from '@/components/auth/RoleGuard';
import RoleShell from '@/components/layout/RoleShell';

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['customer']}>
      <RoleShell title="Customer Dashboard" accent="primary">
        {children}
      </RoleShell>
    </RoleGuard>
  );
}
