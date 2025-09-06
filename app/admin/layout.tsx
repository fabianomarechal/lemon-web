'use client';

import AdminLayout from '@/components/admin-layout';
import { usePathname } from 'next/navigation';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Páginas que não devem usar o AdminLayout
  const excludePages = ['/admin/login', '/admin/setup'];
  
  // Para páginas que não devem usar o layout admin, renderize apenas o children
  const pathname = usePathname();
  if (excludePages.some(page => pathname?.startsWith(page))) {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
