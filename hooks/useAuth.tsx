'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  role: 'admin' | 'user';
  setRole: (role: 'admin' | 'user') => void;
  customerName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<'admin' | 'user'>('user'); // Default to user for customer portal demo
  const customerName = 'Acme Corp'; // Mock customer name for the user role

  return (
    <AuthContext.Provider value={{ role, setRole, customerName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
