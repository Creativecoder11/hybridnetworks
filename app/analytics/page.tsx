'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download, Upload, Activity, Database } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const usageData = [
  { name: 'Mon', usage: 120 },
  { name: 'Tue', usage: 150 },
  { name: 'Wed', usage: 180 },
  { name: 'Thu', usage: 140 },
  { name: 'Fri', usage: 200 },
  { name: 'Sat', usage: 250 },
  { name: 'Sun', usage: 220 },
];

const throughputTrends = [
  { time: '00:00', dl: 120, ul: 30 },
  { time: '04:00', dl: 150, ul: 35 },
  { time: '08:00', dl: 180, ul: 40 },
  { time: '12:00', dl: 220, ul: 50 },
  { time: '16:00', dl: 200, ul: 45 },
  { time: '20:00', dl: 160, ul: 35 },
  { time: '24:00', dl: 130, ul: 30 },
];

export default function Analytics() {
  const { role, customerName } = useAuth();
  const [stats, setStats] = useState({
    dailyUsage: 0,
    monthlyUsage: 0,
    activeTerminals: 0,
    totalTerminals: 0,
    averageUptime: 0,
  });

  useEffect(() => {
    const url = role === 'admin' ? '/api/analytics' : `/api/analytics?customer=${encodeURIComponent(customerName)}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [role, customerName]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Usage & Analytics</h1>
        <button className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50">
          <Download className="-ml-0.5 h-4 w-4" aria-hidden="true" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Daily Usage</p>
              <p className="text-2xl font-semibold text-zinc-900">{stats.dailyUsage} GB</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Monthly Usage</p>
              <p className="text-2xl font-semibold text-zinc-900">{stats.monthlyUsage} TB</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Avg Uptime</p>
              <p className="text-2xl font-semibold text-zinc-900">{stats.averageUptime}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-zinc-100 text-zinc-600">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Active Terminals</p>
              <p className="text-2xl font-semibold text-zinc-900">{stats.activeTerminals} / {stats.totalTerminals}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200">
          <h3 className="text-base font-medium text-zinc-900 mb-4">Weekly Data Usage (GB)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="usage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200">
          <h3 className="text-base font-medium text-zinc-900 mb-4">Average Throughput Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorDl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                <XAxis dataKey="time" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="dl" stroke="#10b981" fillOpacity={1} fill="url(#colorDl)" name="Download (Mbps)" />
                <Area type="monotone" dataKey="ul" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUl)" name="Upload (Mbps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
