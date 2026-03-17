'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Server, Map as MapIcon, Activity, CreditCard, Settings, Satellite } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Terminals', href: '/terminals', icon: Server },
  { name: 'Map', href: '/map', icon: MapIcon },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'Subscriptions', href: '/subscription', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-zinc-50 border-r border-zinc-200">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-zinc-200">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 shadow-sm">
          <Satellite className="h-5 w-5 text-white" />
        </div>
        <span className="text-sm font-semibold text-zinc-900 tracking-tight">Hybrid Networks</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                isActive ? 'bg-zinc-200/50 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
              )}
            >
              <item.icon
                className={cn(
                  isActive ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-600',
                  'mr-3 h-4 w-4 flex-shrink-0 transition-colors'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
