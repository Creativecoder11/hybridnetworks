'use client';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SearchProvider } from '@/hooks/useSearch';
import { AuthProvider } from '@/hooks/useAuth';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SearchProvider>
        <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans">
          <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50">
            <Sidebar />
          </div>
          <div className="flex flex-1 flex-col lg:pl-64 h-full">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </SearchProvider>
    </AuthProvider>
  );
}
