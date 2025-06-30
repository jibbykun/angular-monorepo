import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService } from './api/api.service';
import { Task } from './models/task';
import { MockAuthService } from './interceptors/mock-auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, DragDropModule],
  templateUrl: './app.component.html',
})
export class App {
  tasks: Task[] = [];
  users: { id: number; name: string }[] = [];
  organisations: { id: number; name: string }[] = [];
  auditLog: string[] = [];

  newTaskTitle = '';
  assignedUserId: number | null = null;
  selectedOrganisationId: number | null = null;
  newTaskCategory = '';

  roles = ['Owner', 'Admin', 'Viewer'];
  currentRole = 'Viewer';

  isDarkMode = false;
  sortDirection: 'asc' | 'desc' = 'asc';

  filterText = '';
  filterCategory = '';
  categories = ['work', 'personal'];

  editTaskId: number | null = null;
  editTaskTitle = '';
  editAssignedUserId: number | null | string = null;
  editOrganisationId: number | null | string = null;
  editCategory = '';

  private api = inject(ApiService);
  private authService = inject(MockAuthService);

  constructor() {
    this.authService.setRole(this.currentRole);

    this.authService.role$.subscribe((role) => {
      this.currentRole = role;
      this.loadTasks();
    });

    this.loadUsers();
    this.loadOrganisations();
  }

  loadTasks() {
    this.api.getTasks().subscribe({
      next: (data) => (this.tasks = data),
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.tasks = [];
      },
    });
  }

  loadUsers() {
    this.api.getUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Failed to load users', err),
    });
  }

  loadOrganisations() {
    this.api.getOrganisations().subscribe({
      next: (data) => (this.organisations = data),
      error: (err) => console.error('Failed to load organisations', err),
    });
  }

  onRoleChange(role: string) {
    this.authService.setRole(role);
  }

  addTask(event: Event) {
    event.preventDefault();

    const title = this.newTaskTitle.trim();
    if (!title || !this.assignedUserId || !this.selectedOrganisationId) return;

    const task: Partial<Task> = {
      title,
      assignedTo: { id: this.assignedUserId },
      organisation: { id: this.selectedOrganisationId },
      category: this.newTaskCategory || 'work', // default to 'work' if not set
    };

    this.api.createTask(task).subscribe({
      next: (created) => {
        // Ensure category is set for UI display
        if (!created.category) {
          created.category = this.newTaskCategory || 'work';
        }
        this.tasks.push(created);
        this.newTaskTitle = '';
        this.assignedUserId = null;
        this.selectedOrganisationId = null;
        this.newTaskCategory = '';
      },
      error: (err) => {
        console.error('Failed to create task', err);
      },
    });
  }

  toggleComplete(task: Task) {
    this.api.updateTask(task.id, { completed: task.completed }).subscribe({
      error: (err) => console.error('Update failed', err),
    });
  }

  deleteTask(task: Task) {
    this.api.deleteTask(task.id).subscribe({
      next: () => (this.tasks = this.tasks.filter((t) => t.id !== task.id)),
      error: (err) => console.error('Delete failed', err),
    });
  }

  loadAuditLog() {
    this.api.getAuditLog().subscribe({
      next: (logs) => (this.auditLog = logs),
      error: (err) => console.error('Failed to fetch audit log', err),
    });
  }

  canViewAuditLog(): boolean {
    return ['Owner', 'Admin'].includes(this.currentRole);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  startEditTask(task: Task) {
    this.editTaskId = task.id;
    this.editTaskTitle = task.title;
    this.editAssignedUserId = task.assignedTo?.id ?? null;
    this.editOrganisationId = task.organisation?.id ?? null;
    this.editCategory = task.category || '';
  }

  cancelEditTask() {
    this.editTaskId = null;
    this.editTaskTitle = '';
    this.editAssignedUserId = null;
    this.editOrganisationId = null;
    this.editCategory = '';
  }

  saveEditTask(task: Task) {
    // Convert empty string to null for IDs
    const assignedUserId =
      this.editAssignedUserId === '' ? null : this.editAssignedUserId;
    const organisationId =
      this.editOrganisationId === '' ? null : this.editOrganisationId;
    const updated: Partial<Task> = {
      title: this.editTaskTitle.trim(),
      category: this.editCategory || 'work',
    };
    if (assignedUserId !== null) {
      updated.assignedTo = { id: assignedUserId as number };
    }
    if (organisationId !== null) {
      updated.organisation = { id: organisationId as number };
    }
    this.api.updateTask(task.id, updated).subscribe({
      next: (res) => {
        Object.assign(task, res);
        this.cancelEditTask();
      },
      error: (err) => console.error('Update failed', err),
    });
  }

  get filteredTasks(): Task[] {
    let filtered = this.tasks;
    if (this.filterText.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(this.filterText.trim().toLowerCase())
      );
    }
    if (this.filterCategory) {
      filtered = filtered.filter(
        (task) => task.category === this.filterCategory
      );
    }
    return filtered;
  }

  get sortedTasks(): Task[] {
    return [...this.filteredTasks].sort((a, b) => {
      if (a.title < b.title) return this.sortDirection === 'asc' ? -1 : 1;
      if (a.title > b.title) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  toggleSort() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  drop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }
}
