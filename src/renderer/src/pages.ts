import { Home, ArrowUpDown, Settings } from 'lucide-react';

export const navItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: Home,
    activeIcon: Home,
  },
  {
    path: '/transactions',
    label: 'Transactions',
    icon: ArrowUpDown,
    activeIcon: ArrowUpDown,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    activeIcon: Settings,
  },
];
