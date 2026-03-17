'use client';

import { useEffect, useState, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { Activity, ArrowUpRight, ArrowDownRight, Server, Signal, CheckCircle2, AlertCircle, XCircle, MapPin, Search, Filter, Plus } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useAuth } from '@/hooks/useAuth';
import { AddTerminalModal } from '@/components/modals/AddTerminalModal';
import { TerminalDetailsModal } from '@/components/modals/TerminalDetailsModal';

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

interface SpeedData {
  id: string;
  download: number;
  upload: number;
  latency: number;
  timestamp: string;
}

export default function TerminalsPage() {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [speedData, setSpeedData] = useState<Record<string, SpeedData[]>>({});
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const { searchQuery } = useSearch();
  const { role, customerName } = useAuth();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);

  useEffect(() => {
    const newSocket = io();
    
    newSocket.on('terminals', (data: Terminal[]) => {
      setTerminals(data);
    });

    newSocket.on('speed-update', (data: SpeedData[]) => {
      setSpeedData((prev) => {
        const next = { ...prev };
        data.forEach((update) => {
          if (!next[update.id]) next[update.id] = [];
          next[update.id] = [...next[update.id], update].slice(-1);
        });
        return next;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const filteredTerminals = useMemo(() => {
    let filtered = role === 'admin' ? terminals : terminals.filter(t => t.customer === customerName);

    return filtered.filter((t) => {
      const matchesSearch = !searchQuery || 
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.network.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [terminals, searchQuery, statusFilter, role, customerName]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {role === 'admin' ? 'Terminals' : 'My Terminals'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Manage and monitor all your satellite terminals.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <select
              className="pl-9 pr-8 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Online">Online</option>
              <option value="Warning">Warning</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          {role === 'admin' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Terminal
            </button>
          )}
        </div>
      </div>

      {/* Terminal Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50/50 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Terminal ID</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Network</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Uptime</th>
                <th className="px-6 py-3 font-medium text-right">Live Speed (DL/UL/Ping)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {filteredTerminals.map((terminal) => {
                const latestSpeed = speedData[terminal.id]?.[0];
                return (
                  <tr 
                    key={terminal.id} 
                    className="hover:bg-zinc-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTerminal(terminal)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-900">{terminal.id}</span>
                        {role === 'admin' && <span className="text-xs text-zinc-500">{terminal.customer}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        terminal.status === 'Online' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                        terminal.status === 'Warning' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                        'bg-red-50 text-red-700 ring-red-600/20'
                      }`}>
                        {terminal.status === 'Online' && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {terminal.status === 'Warning' && <AlertCircle className="h-3.5 w-3.5" />}
                        {terminal.status === 'Offline' && <XCircle className="h-3.5 w-3.5" />}
                        {terminal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-500/10">
                        {terminal.network}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-xs">{terminal.location[0].toFixed(2)}, {terminal.location[1].toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-zinc-900">{terminal.uptime}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {latestSpeed ? (
                        <div className="flex items-center justify-end gap-3 text-xs font-medium">
                          <span className="flex items-center text-emerald-600">
                            <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />
                            {latestSpeed.download}
                          </span>
                          <span className="flex items-center text-blue-600">
                            <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
                            {latestSpeed.upload}
                          </span>
                          <span className="flex items-center text-amber-600">
                            <Activity className="mr-0.5 h-3.5 w-3.5" />
                            {latestSpeed.latency}ms
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400">Connecting...</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredTerminals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    No terminals found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddTerminalModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={(newTerminal) => {
          // The socket will broadcast the new terminal, so we don't need to manually update state here
        }}
      />

      <TerminalDetailsModal
        isOpen={!!selectedTerminal}
        onClose={() => setSelectedTerminal(null)}
        terminal={selectedTerminal}
      />
    </div>
  );
}
