import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, isLoaded } = useUser();
  
  // 🔥 The Master Key - Only this email gets in
  const ADMIN_EMAIL = "ak83067091@gmail.com"; 

  // 1. Wait for Clerk to finish loading the user data
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-4 text-red-600">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Verifying Credentials...</p>
      </div>
    );
  }

  // 2. If nobody is logged in, kick them to the home page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. If the logged-in email does NOT match the Admin email, kick them out
  if (user.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  // 4. If they pass all checks, open the door and show the Admin page!
  return children;
};

export default AdminRoute;