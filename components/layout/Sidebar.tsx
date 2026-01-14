'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Search,
  BarChart3,
  CreditCard,
  Bell,
  Calendar,
  Lock,
  User,
  Menu,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/transactions', label: 'Payments', icon: CreditCard },
  { href: '/subscriptions', label: 'Notifications', icon: Bell },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/vault', label: 'Vault', icon: Lock },
  { href: '/settings', label: 'Profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-[#1e2230] border-r border-gray-800 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <Link href="/" className="mb-10 flex flex-col items-center">
        <div className="w-12 h-12 relative rounded-xl overflow-hidden mb-2">
          <Image
            src="/logo.jpg"
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                w-full h-12 flex items-center justify-center
                rounded-xl transition-all duration-200
                group relative
                ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-500 hover:text-white hover:bg-gray-800/50'
                }
              `}
              title={item.label}
            >
              <Icon size={22} />

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* More Menu */}
      <button className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 hover:text-white hover:bg-gray-800/50 transition-all">
        <Menu size={22} />
      </button>
    </aside>
  );
}
