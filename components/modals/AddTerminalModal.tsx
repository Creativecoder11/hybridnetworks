'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (terminal: any) => void;
}

export function AddTerminalModal({ isOpen, onClose, onAdd }: AddTerminalModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    customer: '',
    network: 'Starlink',
    locationLat: '',
    locationLng: '',
    subscriptionPlan: 'Basic',
    startDate: '',
    expireDate: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTerminal = {
      id: formData.id,
      customer: formData.customer,
      network: formData.network,
      location: [parseFloat(formData.locationLat), parseFloat(formData.locationLng)],
      subscriptionPlan: formData.subscriptionPlan,
      startDate: formData.startDate,
      expireDate: formData.expireDate,
    };
    
    try {
      await fetch('/api/terminals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTerminal),
      });
      onAdd(newTerminal);
      onClose();
    } catch (error) {
      console.error('Failed to add terminal:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-lg font-semibold text-zinc-900">Add Terminal</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Terminal ID</label>
            <input required type="text" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Customer Name</label>
            <input required type="text" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Network Type</label>
            <select value={formData.network} onChange={e => setFormData({...formData, network: e.target.value})} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900">
              <option value="Starlink">Starlink</option>
              <option value="OneWeb">OneWeb</option>
              <option value="Viasat">Viasat</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Latitude</label>
              <input required type="number" step="any" value={formData.locationLat} onChange={e => setFormData({...formData, locationLat: e.target.value})} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Longitude</label>
              <input required type="number" step="any" value={formData.locationLng} onChange={e => setFormData({...formData, locationLng: e.target.value})} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Subscription Plan</label>
            <select value={formData.subscriptionPlan} onChange={e => setFormData({...formData, subscriptionPlan: e.target.value})} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900">
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Start Date</label>
              <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Expire Date</label>
              <input required type="date" value={formData.expireDate} onChange={e => setFormData({...formData, expireDate: e.target.value})} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md transition-colors">Add Terminal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
