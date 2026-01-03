import { LogOut, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, logout } = useAuth();

  const roleBadge = user?.role === 'supervisor' ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium">
      <Shield className="w-3.5 h-3.5" />
      Supervisor
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium">
      <User className="w-3.5 h-3.5" />
      Corps Member
    </span>
  );

  return (
    <header className="gradient-header h-20 flex items-center justify-between px-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">N</span>
        </div>
        <h1 className="text-xl font-bold text-primary-foreground tracking-tight">
          NYSC PPA Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-primary-foreground/90 text-sm">Welcome back,</p>
          <p className="text-primary-foreground font-semibold">{user?.name}</p>
        </div>
        
        {roleBadge}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
