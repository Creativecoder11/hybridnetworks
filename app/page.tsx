'use client';

import { useEffect, useState, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { Activity, ArrowUpRight, ArrowDownRight, Server, Signal, CheckCircle2, AlertCircle, XCircle, MapPin, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSearch } from '@/hooks/useSearch';
import { useAuth } from '@/hooks/useAuth';
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

interface AnalyticsData {
  dailyUsage: number;
  monthlyUsage: number;
  activeTerminals: number;
  totalTerminals: number;
  averageUptime: number;
}

const mockUsageData = [
  { time: '00:00', usage: 120 },
  { time: '04:00', usage: 150 },
  { time: '08:00', usage: 280 },
  { time: '12:00', usage: 420 },
  { time: '16:00', usage: 350 },
  { time: '20:00', usage: 290 },
  { time: '24:00', usage: 180 },
];

export default function Dashboard() {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [speedData, setSpeedData] = useState<Record<string, SpeedData[]>>({});
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const { searchQuery } = useSearch();
  const { role, customerName } = useAuth();
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch(console.error);

    const newSocket = io();
    
    newSocket.on('terminals', (data: Terminal[]) => {
      setTerminals(data);
    });

    newSocket.on('speed-update', (data: SpeedData[]) => {
      setSpeedData((prev) => {
        const next = { ...prev };
        data.forEach((update) => {
          if (!next[update.id]) next[update.id] = [];
          next[update.id] = [...next[update.id], update].slice(-20);
        });
        return next;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const visibleTerminals = useMemo(() => {
    let filtered = role === 'admin' ? terminals : terminals.filter(t => t.customer === customerName);
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(lowerQuery) ||
          t.customer.toLowerCase().includes(lowerQuery) ||
          t.network.toLowerCase().includes(lowerQuery)
      );
    }
    return filtered;
  }, [terminals, searchQuery, role, customerName]);

  const activeTerminals = visibleTerminals.filter((t) => t.status === 'Online').length;
  const avgUptime = visibleTerminals.length > 0 
    ? (visibleTerminals.reduce((acc, t) => acc + t.uptime, 0) / visibleTerminals.length).toFixed(2) 
    : '0.00';

  // Aggregate speed for the network chart
  const aggregatedSpeed = Object.values(speedData).map(terminalData => terminalData[terminalData.length - 1] || { download: 0, upload: 0, latency: 0 });
  const totalDownload = aggregatedSpeed.reduce((acc, curr) => acc + curr.download, 0);
  const totalUpload = aggregatedSpeed.reduce((acc, curr) => acc + curr.upload, 0);
  const avgLatency = aggregatedSpeed.length > 0 ? Math.round(aggregatedSpeed.reduce((acc, curr) => acc + curr.latency, 0) / aggregatedSpeed.length) : 0;

  const selectedTerminalId = visibleTerminals.length > 0 ? visibleTerminals[0].id : terminals[0]?.id;
  const chartData = selectedTerminalId ? speedData[selectedTerminalId] || [] : [];

  const downgradedTerminals = terminals.filter(t => t.subscriptionEvent === 'downgrade');

  const calculateRemainingDays = (expireDate?: string) => {
    if (!expireDate) return 0;
    const diff = new Date(expireDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  // For customer portal, get their primary subscription details (assuming all terminals share a plan for simplicity, or taking the first one)
  const customerSubscription = visibleTerminals[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {role === 'admin' ? 'Admin Dashboard' : 'Customer Portal'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {role === 'admin' ? 'Overview of your satellite network performance.' : `Welcome back, ${customerName}. Here is your network overview.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Operational
          </span>
        </div>
      </div>

      {/* Admin Alerts */}
      {role === 'admin' && downgradedTerminals.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-rose-900">Subscription Downgrades Detected</h3>
              <div className="mt-1 text-sm text-rose-700">
                The following terminals have recently downgraded their plans:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {downgradedTerminals.map(t => (
                    <li key={t.id}>
                      <button onClick={() => setSelectedTerminal(t)} className="font-medium hover:underline">
                        {t.id}
                      </button> 
                      {' '}({t.customer})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Subscription Summary */}
      {role === 'user' && customerSubscription && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-900 mb-4">Subscription Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                <Activity className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Current Plan</p>
                <p className="text-lg font-semibold text-zinc-900">{customerSubscription.subscriptionPlan}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                <Calendar className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Start Date</p>
                <p className="text-lg font-semibold text-zinc-900">{customerSubscription.startDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                <Calendar className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Expire Date</p>
                <p className="text-lg font-semibold text-zinc-900">{customerSubscription.expireDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <Clock className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Remaining Days</p>
                <p className="text-lg font-semibold text-emerald-600">{calculateRemainingDays(customerSubscription.expireDate)} days</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-sm font-medium">{role === 'admin' ? 'Active Terminals' : 'My Terminals'}</span>
            <Server className="h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-zinc-900">{activeTerminals}</span>
            <span className="text-sm font-medium text-zinc-500">/ {visibleTerminals.length}</span>
          </div>
        </div>
        
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-sm font-medium">Data Usage (Monthly)</span>
            <Activity className="h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-zinc-900">
              {role === 'admin' ? analytics?.monthlyUsage || '0' : '2.4'}
            </span>
            <span className="text-sm font-medium text-zinc-500">TB</span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-sm font-medium">Average Uptime</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-zinc-900">{avgUptime}%</span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-sm font-medium">Network Health</span>
            <Signal className="h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-zinc-900">98%</span>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Optimal</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Analytics */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-900">Usage Analytics (24h)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockUsageData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="time" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="usage" stroke="#18181b" strokeWidth={2} fillOpacity={1} fill="url(#usageGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Speed Monitoring */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-900">Live Network Speed {selectedTerminalId ? `(${selectedTerminalId})` : ''}</h3>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-zinc-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                DL: {totalDownload} Mbps
              </span>
              <span className="flex items-center gap-1 text-zinc-500">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                UL: {totalUpload} Mbps
              </span>
              <span className="flex items-center gap-1 text-zinc-500">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                Ping: {avgLatency} ms
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  labelFormatter={() => ''}
                />
                <Line type="monotone" dataKey="download" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="upload" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Terminal Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-sm font-medium text-zinc-900">Terminals Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50/50 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Terminal ID</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Network</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium text-right">Live Speed (DL/UL/Ping)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {visibleTerminals.map((terminal) => {
                const latestSpeed = speedData[terminal.id]?.[speedData[terminal.id]?.length - 1];
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
              {visibleTerminals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No terminals found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TerminalDetailsModal
        isOpen={!!selectedTerminal}
        onClose={() => setSelectedTerminal(null)}
        terminal={selectedTerminal}
      />
    </div>
  );
}
