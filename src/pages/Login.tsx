"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSession } from '@/context/SessionContext'; // Import useSession

const Login = () => {
  const navigate = useNavigate();
  const { session, isLoadingSession } = useSession();

  useEffect(() => {
    if (!isLoadingSession && session) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, isLoadingSession, navigate]);

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Welcome Back!</h2>
        <Auth
          supabaseClient={supabase}
          providers={[]} // No third-party providers for now
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                },
              },
            },
          }}
          theme="light" // Use light theme, can be dynamic later
          redirectTo={window.location.origin + '/dashboard'}
        />
      </div>
    </div>
  );
};

export default Login;