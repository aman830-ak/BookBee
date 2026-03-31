import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

const AdminNavbar = () => {
  return (
    <nav className="h-16 w-full bg-[#09090b] border-b border-gray-800 flex items-center justify-between px-6 md:px-10 z-50">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-red-600 p-1.5 rounded-lg">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          BookBee <span className="text-red-500">Admin</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
        >
          View Main Site
          <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
        
        <div className="h-6 w-px bg-gray-800"></div>

        {/* Clerk User Button */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default AdminNavbar;