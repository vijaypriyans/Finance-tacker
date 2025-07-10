import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../components/contexts/AuthContext';
import TransactionProvider from '../components/contexts/TransactionContext';
import LoginForm from '../components/auth/LoginForm';
import Dashboard from '../components/dashboard/Dashboard';
import Navbar from '../components/layout/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { useLocation } from 'react-router-dom';

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Removed loading spinner logic since 'loading' is not available

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {user ? (
        <TransactionProvider>
          {location.pathname !== '/profile' && <Navbar />}
          <Dashboard />
        </TransactionProvider>
      ) : (
        <LoginForm />
      )}
      <Toaster />
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
