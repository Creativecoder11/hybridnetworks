'use client';

import { useState } from 'react';
import { User, Bell, Shield, Key } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'profile' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              <User className={`h-5 w-5 ${activeTab === 'profile' ? 'text-zinc-500' : 'text-zinc-400'}`} />
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'notifications' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              <Bell className={`h-5 w-5 ${activeTab === 'notifications' ? 'text-zinc-500' : 'text-zinc-400'}`} />
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'security' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              <Shield className={`h-5 w-5 ${activeTab === 'security' ? 'text-zinc-500' : 'text-zinc-400'}`} />
              Security
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'api' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              <Key className={`h-5 w-5 ${activeTab === 'api' ? 'text-zinc-500' : 'text-zinc-400'}`} />
              API Keys
            </button>
          </nav>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200">
            {activeTab === 'profile' && (
              <>
                <h2 className="text-lg font-medium text-zinc-900 mb-4">Profile Information</h2>
                <form className="space-y-4" onSubmit={handleSave}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first-name" className="block text-sm font-medium text-zinc-700">First name</label>
                      <input type="text" id="first-name" defaultValue="Nurmohammad" className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm px-3 py-2 border" />
                    </div>
                    <div>
                      <label htmlFor="last-name" className="block text-sm font-medium text-zinc-700">Last name</label>
                      <input type="text" id="last-name" defaultValue="Kawser" className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm px-3 py-2 border" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Email address</label>
                    <input type="email" id="email" defaultValue="nurmohammadkawser11@gmail.com" className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm px-3 py-2 border" />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-zinc-700">Company</label>
                    <input type="text" id="company" defaultValue="Hybrid Networks Inc." className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm px-3 py-2 border" />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <h2 className="text-lg font-medium text-zinc-900 mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900">Email Alerts</h3>
                      <p className="text-sm text-zinc-500">Receive daily summary emails.</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900">Terminal Offline Alerts</h3>
                      <p className="text-sm text-zinc-500">Get notified immediately when a terminal goes offline.</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900">Billing Updates</h3>
                      <p className="text-sm text-zinc-500">Receive invoices and billing notifications.</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600" defaultChecked />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <h2 className="text-lg font-medium text-zinc-900 mb-4">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900">Change Password</h3>
                    <p className="text-sm text-zinc-500 mb-4">Update your password associated with your account.</p>
                    <button className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50">
                      Update Password
                    </button>
                  </div>
                  <div className="pt-4 border-t border-zinc-200">
                    <h3 className="text-sm font-medium text-zinc-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-zinc-500 mb-4">Add an extra layer of security to your account.</p>
                    <button className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'api' && (
              <>
                <h2 className="text-lg font-medium text-zinc-900 mb-4">API Keys</h2>
                <p className="text-sm text-zinc-500 mb-4">Manage your API keys for programmatic access to the platform.</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg bg-zinc-50">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900">Production Key</h3>
                      <p className="text-xs text-zinc-500 font-mono mt-1">sk_live_**********************</p>
                    </div>
                    <button className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                      Reveal
                    </button>
                  </div>
                  <button className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800">
                    Generate New Key
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
