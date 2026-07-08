import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, FileText, Bell, CreditCard, LayoutDashboard, Users, Settings, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  role: 'student' | 'admin';
}

export default function Layout({ children, role }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== role) {
      navigate(parsedUser.role === 'admin' ? '/admin' : '/student');
    } else {
      setUser(parsedUser);
    }
  }, [navigate, role]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const studentLinks = [
    { name: 'Tableau de bord', path: '/student', icon: Home },
    { name: 'Mon Dossier', path: '/student/dossier', icon: FileText },
    { name: 'Paiement', path: '/student/paiement', icon: CreditCard },
    { name: 'Notifications', path: '/student/notifications', icon: Bell },
  ];

  const adminLinks = [
    { name: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
    { name: 'Candidatures', path: '/admin/applications', icon: FileText },
    { name: 'Étudiants', path: '/admin/students', icon: Users },
    { name: 'Configuration', path: '/admin/settings', icon: Settings },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  if (!user) return null;

  return (
    <div className="flex h-screen w-full font-sans text-slate-800 bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">EduPortail</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={cn(
                  "flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                  isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {link.name}
              </button>
            );
          })}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-slate-50">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-sm font-medium text-slate-400">{role === 'admin' ? 'Administration' : 'Espace Étudiant'}</h2>
            <p className="text-slate-900 font-bold">
              {links.find(l => l.path === location.pathname)?.name || 'Tableau de bord'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div 
              onClick={() => role === 'student' && navigate('/student/notifications')}
              className={`relative p-2 rounded-full cursor-pointer hidden sm:block transition-colors ${role === 'student' ? 'bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50' : 'text-slate-300'}`}
            >
              <Bell className="w-5 h-5" />
              {role === 'student' && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </div>
            <div className="flex items-center gap-3 pl-4 sm:border-l sm:border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-slate-400 font-medium capitalize">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-auto p-8 flex flex-col gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
