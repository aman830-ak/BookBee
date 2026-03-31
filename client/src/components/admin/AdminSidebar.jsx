import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Film, 
  Ticket, 
  Settings 
} from 'lucide-react';

const AdminSidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Add Movie', path: '/admin/add-shows', icon: <PlusCircle size={20} /> },
    { name: 'Movie List', path: '/admin/list-shows', icon: <Film size={20} /> },
    { name: 'All Bookings', path: '/admin/list-bookings', icon: <Ticket size={20} /> },
    { name: 'Layout Settings', path: '/admin/layout', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-[#111113] border-r border-gray-800 hidden md:flex flex-col p-4">
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'} // Ensures Dashboard is only active on /admin
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-red-600/10 text-red-500 font-semibold shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
            `}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto p-4 bg-gray-900/50 rounded-2xl border border-gray-800/50">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300 font-medium">Server Online</span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;