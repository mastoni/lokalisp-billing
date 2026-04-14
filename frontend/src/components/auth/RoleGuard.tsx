'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

export default function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: Array<'admin' | 'customer' | 'teknisi' | 'agen'>;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, hasRole, login, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  const allowedRolesKey = allowedRoles.join('|');
  const allowedRoleList = useMemo(
    () => allowedRolesKey.split('|') as Array<'admin' | 'customer' | 'teknisi' | 'agen'>,
    [allowedRolesKey]
  );

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          router.replace('/login');
          return;
        }

        if (!isAuthenticated) {
          const cachedUser = localStorage.getItem('user');
          if (cachedUser) {
            try {
              login(JSON.parse(cachedUser), token);
            } catch {
              localStorage.removeItem('user');
              const me = await authService.getMe();
              login(me, token);
            }
          } else {
            const me = await authService.getMe();
            login(me, token);
          }
        }

        if (!hasRole(allowedRoleList)) {
          router.replace('/login');
          return;
        }
      } catch {
        const token = localStorage.getItem('token');
        const cachedUser = localStorage.getItem('user');
        if (token && cachedUser && !isAuthenticated) {
          try {
            login(JSON.parse(cachedUser), token);
          } catch {
            logout();
            router.replace('/login');
            return;
          }
          if (!hasRole(allowedRoleList)) {
            router.replace('/login');
            return;
          }
        } else {
          logout();
          router.replace('/login');
          return;
        }
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [allowedRoleList, hasRole, isAuthenticated, login, logout, router]);

  if (isChecking) return null;
  if (!isAuthenticated) return null;
  if (!hasRole(allowedRoleList)) return null;

  return children;
}
