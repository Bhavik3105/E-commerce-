import { notFound } from 'next/navigation';
import { Dashboard } from '@/components/admin/Dashboard';

export default function AdminSectionPage({ params }: { params: { section: string } }) {
  if (!/^[a-z0-9-]+$/.test(params.section)) notFound();
  return <Dashboard section={params.section} />;
}
