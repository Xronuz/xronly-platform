import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PenTool,
  Share2,
  LineChart,
  BarChart3,
  Brain,
  Settings,
  Settings2,
  LogOut,
  Loader2,
  CreditCard,
  Gift
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    title: 'Dashboard',
    Icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    title: 'AI Content Maker',
    Icon: PenTool,
    href: '/dashboard/content'
  },
  {
    title: 'AI Ads Manager',
    Icon: Share2,
    href: '/dashboard/ads'
  },
  {
    title: 'AI Sales Manager',
    Icon: LineChart,
    href: '/dashboard/sales'
  },
  {
    title: 'AI Business Strategist',
    Icon: Brain,
    href: '/dashboard/strategy'
  },
  {
    title: 'Subscriptions',
    Icon: CreditCard,
    href: '/dashboard/subscriptions'
  },
  {
    title: 'Rewards Hub',
    Icon: Gift,
    href: '/dashboard/rewards'
  },
  {
    title: 'Settings',
    Icon: Settings,
    href: '/dashboard/settings'
  }
];

export const Sidebar = ({ className, onExpand }: SidebarProps & { onExpand?: (expanded: boolean) => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = () => {
    setIsExpanded(true);
    onExpand?.(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    onExpand?.(false);
  };
  return (
    <div
      className={cn(
        "fixed left-4 top-[100px] h-[calc(100vh-120px)] w-[70px] glass bg-dark-400/80 backdrop-blur-xl shadow-2xl transition-all duration-300 z-50 overflow-hidden border border-white/5 rounded-2xl animate-slide-in",
        isExpanded && "w-[250px]",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo */}
      <div className="flex justify-center items-center h-[70px] border-b border-white/5 backdrop-blur-xl bg-gradient-to-r from-primary-500/5 to-primary-600/5 transition-all duration-300 hover:from-primary-500/10 hover:to-primary-600/10">
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 to-transparent opacity-50"></div>
        <div className="relative w-[40px] h-[40px]">
          <Image
            src="/logo.svg"
            alt="XRONLY Logo"
            width={40}
            height={40}
            className={cn(
              "absolute top-0 left-0 transition-opacity duration-300",
              isExpanded ? "opacity-0" : "opacity-100"
            )}
          />
          <Image
            src="/logo.png"
            alt="XRONLY Logo"
            width={40}
            height={40}
            className={cn(
              "absolute top-0 left-0 transition-opacity duration-300",
              isExpanded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-4">
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, index) => {
            const Icon = item.Icon;
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "menu-item flex items-center px-4 py-3 hover:bg-primary-500/10 hover:border-primary-500/30 rounded-xl mx-2 transition-all duration-300 group/item border border-transparent hover:shadow-lg hover:shadow-primary-500/5 relative overflow-hidden",
                  (item.href === '/dashboard' ? pathname === item.href : pathname?.startsWith(item.href)) && "bg-gradient-to-r from-primary-500/20 to-primary-600/20 border-primary-500/30 shadow-lg shadow-primary-500/10 scale-105"
                )}
              >
                <div className="min-w-[24px] transition-all duration-300 group-hover:scale-110 relative z-10">
                  <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                  <Icon className="h-5 w-5 text-gray-400 group-hover/item:text-primary-400 transition-colors duration-300" />
                </div>
                <span className={cn(
                  "ml-3 text-gray-400 group-hover/item:text-white whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded ? "opacity-100" : "opacity-0"
                )}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sign Out Button */}
      <div className="absolute bottom-4 w-full px-2">
        <button
          onClick={async () => {
            if (signingOut) return;
            setSigningOut(true);
            try {
              await signOut(auth);
              router.replace('/');
            } catch (error) {
              console.error("Error signing out:", error);
              setSigningOut(false);
            }
          }}
          disabled={signingOut}
          className={cn(
            "flex items-center w-full px-4 py-3 rounded-lg mx-2 transition-all duration-300 border border-transparent",
            signingOut ? "opacity-50 cursor-not-allowed" : "hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 hover:scale-105 transition-all duration-300"
          )}
        >
          <div className="min-w-[24px] transition-transform duration-300 group-hover:scale-110">
            {signingOut ? (
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-400" />
            )}
          </div>
          <span className={cn(
            "ml-3 text-gray-400 whitespace-nowrap overflow-hidden transition-all duration-300 group-hover:text-red-400",
            isExpanded ? "opacity-100" : "opacity-0"
          )}>
            {signingOut ? "Signing out..." : "Sign Out"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
