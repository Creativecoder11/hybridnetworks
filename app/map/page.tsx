'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { io, Socket } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import { useSearch } from '@/hooks/useSearch';
import { useAuth } from '@/hooks/useAuth';
import { TerminalDetailsModal } from '@/components/modals/TerminalDetailsModal';

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

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

export default function MapView() {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const { searchQuery } = useSearch();
  const { role, customerName } = useAuth();
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);

  useEffect(() => {
    // Fix for default marker icons in Leaflet with Next.js
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });

    const newSocket = io();

    newSocket.on('terminals', (data: Terminal[]) => {
      setTerminals(data);
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
      
      const matchesFilter = filter === 'All' || t.network === filter;
      
      return matchesSearch && matchesFilter;
    });
  }, [terminals, searchQuery, filter, role, customerName]);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Interactive Map View</h1>
          <p className="text-sm text-zinc-500 mt-1">Real-time geographical overview of your terminals.</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Starlink', 'OneWeb'].map((network) => (
            <button
              key={network}
              onClick={() => setFilter(network)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === network
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              {network}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden border border-zinc-200 shadow-sm relative z-0">
        {typeof window !== 'undefined' && (
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredTerminals.map((terminal) => (
              <Marker 
                key={terminal.id} 
                position={terminal.location}
                eventHandlers={{
                  click: () => setSelectedTerminal(terminal),
                }}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-semibold text-zinc-900">{terminal.id}</h3>
                    {role === 'admin' && <p className="text-sm text-zinc-600">{terminal.customer}</p>}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-800">
                        {terminal.network}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        terminal.status === 'Online' ? 'bg-emerald-100 text-emerald-800' :
                        terminal.status === 'Warning' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {terminal.status}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTerminal(terminal);
                      }}
                      className="mt-3 w-full text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      View Details   &rarr;
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      <TerminalDetailsModal
        isOpen={!!selectedTerminal}
        onClose={() => setSelectedTerminal(null)}
        terminal={selectedTerminal}
      />
    </div>
  );
}
