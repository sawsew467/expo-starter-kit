import { Task } from '@/types';

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Review project documentation",
    completed: true,
    priority: "high",
    date: "Today",
  },
  {
    id: 2,
    title: "Update team meeting notes",
    completed: true,
    priority: "medium",
    date: "Yesterday",
  },
  {
    id: 3,
    title: "Prepare presentation slides",
    completed: false,
    priority: "high",
    date: "Tomorrow",
  },
  {
    id: 4,
    title: "Code review for mobile app",
    completed: false,
    priority: "medium",
    date: "This week",
  },
  {
    id: 5,
    title: "Design new user interface",
    completed: true,
    priority: "low",
    date: "Last week",
  },
  {
    id: 6,
    title: "Test application features",
    completed: false,
    priority: "high",
    date: "Next week",
  },
  {
    id: 7,
    title: "Update documentation",
    completed: false,
    priority: "medium",
    date: "Next week",
  },
  {
    id: 8,
    title: "Refactor legacy code",
    completed: false,
    priority: "low",
    date: "Next month",
  },
];