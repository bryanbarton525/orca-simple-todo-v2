import { redirect } from 'next/navigation';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function AdminPage() {
  const supabase = createServerComponentSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <nav className="flex space-x-4 mb-6">
        <a href="/admin/feeds" className="text-blue-600 hover:underline">Feeds</a>
        <a href="/admin/logs" className="text-blue-600 hover:underline">Logs</a>
        <a href="/admin/search" className="text-blue-600 hover:underline">Search</a>
      </nav>
      <p className="text-gray-700">Select a section from the menu above to manage content.</p>
    </div>
  );
}
