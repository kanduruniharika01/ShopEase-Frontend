import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'], // ✅ corrected to styleUrls
})
export class AdminDashboard implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  customers: any[] = [];
  managers: any[] = [];   // ✅ renamed from Agents
  selectedOptions = 'assign-role';
  showOnlyUnassigned = true;

  constructor(private api: Api, private router: Router) { }

  ngOnInit() {
    this.loadUsers();
    this.loadCustomers();
    this.loadManagers();
  }

  loadUsers() {
    this.api.get('/User/getall').subscribe({
      next: (res: any) => {
        this.users = res;
        this.showUnassignedUsers();
      },
      error: (err: any) => {
        console.error('Failed to Load Users', err);
      }
    });
  }

  loadCustomers() {
    this.api.get('/User/getall/?role=customer').subscribe({
      next: (res: any) => {
        this.customers = res;
      },
      error: (err) => {
        console.error('Failed to Load Customers', err);
      }
    });
  }

  loadManagers() {
    this.api.get('/User/getall/?role=manager').subscribe({   // ✅ changed role
      next: (res: any) => {
        this.managers = res;
      },
      error: (err) => {
        console.error('Failed to Load Managers', err);
      }
    });
  }

  showUnassignedUsers() {
    this.showOnlyUnassigned = true;
    this.filteredUsers = this.users.filter(
      user => user.role === '0' || user.role === null || user.role === ''
    );
  }

  showAllUsers() {
    this.showOnlyUnassigned = false;
    this.filteredUsers = [...this.users];
  }

  assignRole(userId: number, role: string) {
    this.api.post(`/User/${userId}/role`, { role }).subscribe({
      next: () => {
        alert(`Role updated to ${role}`);
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.assignedRole = role;
          this.activateUser(userId);
        }
      },
      error: (err) => {
        console.error('Failed to update role', err);
      }
    });
  }

  activateUser(userId: number) {
    this.api.post(`/User/${userId}/activate`, {}).subscribe({
      next: () => {
        alert('User Activated');
        this.loadUsers();
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.active = true;
        }
      },
      error: (err) => {
        console.error('Failed to activate user', err);
      }
    });
  }

  selectOption(option: string) {
    this.selectedOptions = option;
    if (option === 'assign-role') {
      this.loadUsers();
    } else if (option === 'customer') {
      this.loadCustomers();
    } else if (option === 'manager') {   // ✅ replaced travelagent with manager
      this.loadManagers();
    }
  }

  logout() {
    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    if (isBrowser) {
      localStorage.removeItem('token');
      alert('Logged out successfully');
      this.router.navigate(['/login']);
    }
  }
}
