import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">LinkHub</h1>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      
      <div className="flex items-center justify-center p-8">
        <AuthForm onAuthSuccess={onAuthSuccess} />
      </div>
    </div>
  );
}