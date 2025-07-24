import { ProfileStat, SettingsOption, Activity } from '@/types';

export const profileStats: ProfileStat[] = [
  {
    label: "Documents",
    value: "24",
    icon: "file-text",
    color: "bg-blue-500",
  },
  {
    label: "Projects", 
    value: "8",
    icon: "folder",
    color: "bg-green-500"
  },
  {
    label: "Shared",
    value: "12", 
    icon: "share",
    color: "bg-purple-500"
  },
];

export const settingsOptions: SettingsOption[] = [
  {
    title: "Account Settings",
    subtitle: "Email, password, security",
    icon: "user",
    color: "bg-blue-500",
  },
  {
    title: "Notifications",
    subtitle: "Push notifications, email alerts",
    icon: "bell",
    color: "bg-green-500",
  },
  {
    title: "Privacy & Security",
    subtitle: "Data protection, permissions",
    icon: "shield",
    color: "bg-purple-500",
  },
  {
    title: "Storage & Sync",
    subtitle: "Cloud storage, offline access", 
    icon: "cloud",
    color: "bg-orange-500",
  },
  {
    title: "Help & Support",
    subtitle: "FAQ, contact support",
    icon: "help-circle",
    color: "bg-gray-500",
  },
  {
    title: "About",
    subtitle: "App version, terms of service",
    icon: "info", 
    color: "bg-indigo-500",
  },
];

export const recentActivities: Activity[] = [
  {
    id: 1,
    title: "Updated project documentation",
    description: "Modified README and API docs",
    icon: "edit",
    iconColor: "bg-blue-500",
    date: "2 hours ago",
  },
  {
    id: 2, 
    title: "Uploaded 5 new files",
    description: "Added design assets to project",
    icon: "upload",
    iconColor: "bg-green-500", 
    date: "1 day ago",
  },
  {
    id: 3,
    title: "Document Created", 
    description: "New project proposal document",
    icon: "file-text",
    iconColor: "bg-blue-500",
    date: "2 hours ago",
  },
  {
    id: 4,
    title: "Task Completed",
    description: "Finished code review task",
    icon: "check-circle", 
    iconColor: "bg-green-500",
    date: "5 hours ago",
  },
];