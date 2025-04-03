
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  BarChart2,
  Wallet,
  LineChart,
  Bell,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Layers
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: <BarChart2 className="h-5 w-5" />, href: '/' },
  { name: 'Wallets', icon: <Wallet className="h-5 w-5" />, href: '/wallets' },
  { name: 'Order Book', icon: <Layers className="h-5 w-5" />, href: '/orderbook' },
  { name: 'Trading', icon: <LineChart className="h-5 w-5" />, href: '/trading' },
  { name: 'Alerts', icon: <Bell className="h-5 w-5" />, href: '/alerts' },
  { name: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div
      className={cn(
        "bg-sidebar h-screen border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-2xl font-bold text-solana-purple">SNexus</div>
        )}
        {collapsed && (
          <div className="text-xl font-bold text-solana-purple">SN</div>
        )}
      </div>
      
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md mb-1 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
              item.href === "/" && "bg-sidebar-accent text-sidebar-foreground"
            )}
          >
            <span>{item.icon}</span>
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
      
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex justify-center"
        >
          {collapsed ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <ChevronsLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
