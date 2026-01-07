import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Plus,
  FileText,
  ClipboardCheck,
  BarChart3
} from 'lucide-react';

export function Navigation() {
  const { user } = useAuth();
  const location = useLocation();
  const isCorpsMember = user?.role === 'corps_member';

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      show: true
    },
    {
      to: '/create-ppa',
      label: 'Create PPA',
      icon: Plus,
      show: !isCorpsMember
    },
    {
      to: '/my-logs',
      label: 'My Logs',
      icon: FileText,
      show: isCorpsMember
    },
    {
      to: '/pending-approvals',
      label: 'Pending Approvals',
      icon: ClipboardCheck,
      show: !isCorpsMember
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: BarChart3,
      show: isCorpsMember
    },
    {
      to: '/join-ppa',
      label: 'Join PPA',
      icon: Plus,
      show: isCorpsMember && !user?.ppaId
    },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-1 h-14 overflow-x-auto">
          {navItems.filter(item => item.show).map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'nav-link flex items-center gap-2 whitespace-nowrap',
                  isActive && 'nav-link-active'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
