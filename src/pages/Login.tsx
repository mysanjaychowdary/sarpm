"use client";

import React, { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useSession } from "@/context/SessionContext"; // Import useSession

const Login = () => {
  const navigate = useNavigate();
  const { session } = useSession(); // Get session from context

  useEffect(() => {
    if (session) {
      // If session exists, redirect to dashboard
      navigate("/dashboard", { replace: true });
    }
  }, [session, navigate]); // Depend on session and navigate

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to SA Report Manager</CardTitle>
        </CardHeader>
        <CardContent>
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
            // Removed redirectTo prop, as we're handling navigation with useEffect
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;