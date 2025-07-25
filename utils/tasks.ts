import { Task } from "~/types";

// Filter tasks by completion status
export const getCompletedTasks = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => task.completed);
};

export const getPendingTasks = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => !task.completed);
};

// Get priority color class for task priority
export const getPriorityColor = (priority: Task["priority"]): string => {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

// Calculate task statistics
export const getTaskStats = (tasks: Task[]) => {
  const completed = getCompletedTasks(tasks);
  const pending = getPendingTasks(tasks);

  return {
    completed: completed.length,
    pending: pending.length,
    total: tasks.length,
  };
};
