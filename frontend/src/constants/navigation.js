import {
  Home,
  Users,
  Package,
  ShoppingCart,
  Tag,
  Truck,
  MessageSquare,
  BarChart2,
  FileText,
  Settings,
} from 'lucide-react';

export const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Pricing', href: '/pricing', icon: Tag },
  { name: 'Deliveries', href: '/deliveries', icon: Truck },
  { name: 'Messaging', href: '/messaging', icon: MessageSquare },
  { name: 'Reports', href: '/reports', icon: BarChart2 },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];
