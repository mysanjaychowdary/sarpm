const SUPABASE_URL = "https://pvfvlqynmtpgcdarvosb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2ZnZscXlubXRwZ2NkYXJ2b3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzcwMjksImV4cCI6MjA3ODg1MzAyOX0.SYbrbd7xL2qkUzFvqlWlT7Ak48pSQAv8PUNzle6n3rs";

async function createAdminUser() {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/create-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'AdminPassword123!',
      name: 'Admin User',
      role: 'Admin',
    }),
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Admin user created successfully:', data);
  } else {
    console.error('Error creating admin user:', data.error);
  }
}

createAdminUser();