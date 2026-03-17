'use client';

import { X, Server, CreditCard, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Terminal {
  id: string;
  customer: string;
  location: [number, number];
  network: string;
  status: 'Online' | 'Warning' | 'Offline';
  uptime: number;
  subscriptionPlan?: string;
  startDate?: string;
  expireDate?: string;
  subscriptionEvent?: 'upgrade' | 'downgrade' | 'expire' | null;
}

interface TerminalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  terminal: Terminal | null;
}

export function TerminalDetailsModal({ isOpen, onClose, terminal }: TerminalDetailsModalProps) {
  const { role } = useAuth();

  if (!isOpen || !terminal) return null;

  const calculateRemainingDays = (expireDate?: string) => {
    if (!expireDate) return 0;
    const diff = new Date(expireDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
            <Server className="h-5 w-5 text-zinc-500" />
            {terminal.id}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          
          {/* Basic Details */}
          <div>
            <h3 className="text-sm font-medium text-zinc-900 mb-3">Terminal Details</h3>
            <div className="bg-zinc-50 rounded-lg p-4 space-y-3 border border-zinc-100">
              {role === 'admin' && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Customer</span>
                  <span className="font-medium text-zinc-900">{terminal.customer}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Network</span>
                <span className="font-medium text-zinc-900">{terminal.network}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Status</span>
                <span className={`font-medium ${terminal.status === 'Online' ? 'text-emerald-600' : terminal.status === 'Warning' ? 'text-amber-600' : 'text-rose-600'}`}>
                  {terminal.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Location</span>
                <span className="font-medium text-zinc-900">{terminal.location[0].toFixed(2)}, {terminal.location[1].toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div>
            <h3 className="text-sm font-medium text-zinc-900 mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-zinc-500" />
              Subscription & Billing
            </h3>
            <div className="bg-indigo-50/50 rounded-lg p-4 space-y-3 border border-indigo-100">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Plan</span>
                <span className="font-medium text-indigo-900">{terminal.subscriptionPlan || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Start Date</span>
                <span className="font-medium text-zinc-900">{terminal.startDate || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Expire Date</span>
                <span className="font-medium text-zinc-900">{terminal.expireDate || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Remaining</span>
                <span className="font-medium text-emerald-600">{calculateRemainingDays(terminal.expireDate)} days</span>
              </div>
              {role === 'admin' && terminal.subscriptionEvent && (
                <div className="pt-2 mt-2 border-t border-indigo-100 flex justify-between text-sm">
                  <span className="text-zinc-600">Recent Event</span>
                  <span className={`font-medium capitalize ${terminal.subscriptionEvent === 'downgrade' ? 'text-rose-600' : terminal.subscriptionEvent === 'upgrade' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {terminal.subscriptionEvent}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 rounded-md transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
