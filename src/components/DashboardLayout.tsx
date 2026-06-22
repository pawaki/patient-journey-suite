import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Bed, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  CircleDollarSign, 
  LogOut,
  Menu,
  X,
  History,
  Activity,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return null;

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/', roles: ['Director', 'Doctor', 'Nurse', 'Technologist', 'Finance'] },
    { name: 'Registration', icon: Users, path: '/registration', roles: ['Director', 'Nurse', 'Finance'] },
    { name: 'Admission', icon: Bed, path: '/admission', roles: ['Director', 'Doctor', 'Nurse'] },
    { name: 'Ward Management', icon: Activity, path: '/ward', roles: ['Director', 'Doctor', 'Nurse'] },
    { name: 'Investigations', icon: FlaskConical, path: '/investigations', roles: ['Director', 'Doctor', 'Technologist'] },
    { name: 'Pharmacy', icon: Pill, path: '/pharmacy', roles: ['Director', 'Doctor', 'Nurse', 'Finance'] },
    { name: 'Finance', icon: CircleDollarSign, path: '/finance', roles: ['Director', 'Finance'] },
    { name: 'Mortuary', icon: Activity, path: '/mortuary', roles: ['Director', 'Doctor', 'Nurse'] },
    { name: 'Audit Log', icon: History, path: '/audit', roles: ['Director'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">HMS</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-0 z-50 bg-card border-r transition-transform md:relative md:translate-x-0 w-64 flex flex-col shrink-0",
        !sidebarOpen && "-translate-x-full"
      )}>
        <div className="hidden md:flex items-center gap-2 p-6 border-b">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">HMS Portal</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNav.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                location.pathname === item.path 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
              {location.pathname === item.path && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t bg-muted/20">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground px-3 mb-1">User Session</p>
            <div className="px-3 py-2">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10" onClick={logout}>
            <LogOut className="h-5 w-5 mr-3" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/10">
        <div className="container mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
