// User related types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Search related types
export interface SearchResult {
  id: number;
  title: string;
  type: 'Document' | 'Image' | 'Person' | 'Project';
  date: string;
  icon: string;
}

export type SearchFilter = 'All' | 'Documents' | 'Images' | 'People' | 'Projects';

// Task related types
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  date: string;
}

// Profile related types
export interface ProfileStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface SettingsOption {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

// Activity related types
export interface Activity {
  id: number;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  date: string;
}

// Animation related types
export interface HeaderAnimationConfig {
  scrollThreshold: number;
  titleHeight: number;
}