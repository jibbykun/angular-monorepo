export interface Task {
  id: number;
  title: string;
  completed: boolean;
  assignedTo?: User;
  organisation?: Organisation;
  category?: string; // 'work', 'personal', etc.
}

export interface User {
  id: number;
  name?: string;
}

export interface Organisation {
  id: number;
  name?: string;
}
