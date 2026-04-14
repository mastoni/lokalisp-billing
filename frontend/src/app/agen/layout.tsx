'use client';

import RoleGuard from '@/components/auth/RoleGuard';
import RoleShell from '@/components/layout/RoleShell';

export default function AgenLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['agen']}>
      <RoleShell title="Agen Dashboard" accent="green">
        {children}
      </RoleShell>
    </RoleGuard>
  );
}
