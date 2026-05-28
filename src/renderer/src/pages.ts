import { Home, ArrowUpDown, Settings } from 'lucide-react';

export const navItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: Home,
  },
  {
    path: '/transactions',
    label: 'Transactions',
    icon: ArrowUpDown,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];
