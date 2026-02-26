import { BsHouseDoor, BsArrowDownUp, BsGear, BsFileBreak } from 'react-icons/bs'

import { BsFillHouseDoorFill, BsFileBreakFill, BsFillGearFill } from 'react-icons/bs'

export const navItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: BsHouseDoor,
    activeIcon: BsFillHouseDoorFill
  },
  {
    path: '/transactions',
    label: 'Transactions',
    icon: BsArrowDownUp,
    activeIcon: BsArrowDownUp
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: BsFileBreak,
    activeIcon: BsFileBreakFill
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: BsGear,
    activeIcon: BsFillGearFill
  }
]
