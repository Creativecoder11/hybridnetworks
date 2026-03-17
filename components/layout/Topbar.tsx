'use client';

import { Bell, Search, Menu, UserCircle } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useAuth } from '@/hooks/useAuth';

export function Topbar() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { role, setRole } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 bg-white/80 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-zinc-700 lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-zinc-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1 items-center" action="#" method="GET" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-4 text-zinc-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm bg-transparent"
            placeholder="Search terminals, customers, or locations..."
            type="search"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            onClick={() => setRole(role === 'admin' ? 'user' : 'admin')}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 transition-colors"
          >
            <UserCircle className="h-4 w-4" />
            Role: {role === 'admin' ? 'Admin' : 'User'}
          </button>
          <button type="button" className="-m-2.5 p-2.5 text-zinc-400 hover:text-zinc-500 transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
          
          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200" aria-hidden="true" />
          
          {/* Profile dropdown */}
          <div className="flex items-center gap-x-4">
            <button type="button" className="flex items-center gap-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 flex items-center justify-center text-xs font-medium text-white shadow-sm ring-1 ring-zinc-900/10">
                NK
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="text-sm font-medium leading-6 text-zinc-900" aria-hidden="true">
                  Nurmohammad
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
