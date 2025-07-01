import { DefaultTheme } from "vitepress";

/**
 * Configuration for dynamic sidebar generation
 */
export interface SidebarConfig {
  path: string;
  baseDir: string;
  title?: string;
  options?: {
    includeIndex?: boolean;
    collapsed?: boolean;
    sortBy?: "name" | "date" | "title";
    excludeFiles?: string[];
    includeSubfolders?: boolean;
  };
}

/**
 * Sidebar configurations for different sections
 */
export const sidebarConfigs: SidebarConfig[] = [
  {
    path: '/users',
    baseDir: './users',
    title: 'For Users',
    options: {
      includeIndex: true,
      collapsed: false,
      sortBy: 'title',
      excludeFiles: ['README.md'],
      includeSubfolders: true
    }
  },
  {
    path: '/developers',
    baseDir: './developers', 
    title: 'For Developers',
    options: {
      includeIndex: true,
      collapsed: false,
      sortBy: 'title',
      excludeFiles: ['README.md'],
      includeSubfolders: true
    }
  }
];

export default sidebarConfigs;
