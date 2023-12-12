import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Upload Video',
    iconName: 'upload',
    route: '/dashboard',
  },
  {
    displayName: 'Video Player',
    iconName: 'video',
    route: '/dashboard/videoplayer',
  },
  
];
