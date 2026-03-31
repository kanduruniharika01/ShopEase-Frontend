
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  token: string | null = null;

  constructor(private router: Router) {
    this.token = localStorage.getItem('token');
  }
  loadProfile() {
    if (!this.token) {
      alert('Please login to view profile');
      return;
    }
    const decoded: any = jwtDecode(this.token);
    const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    console.log(role);
    if (role === 'Admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'Customer') {
      this.router.navigate(['/customer-dashboard']);
    } else if (role === 'Manager') {
      this.router.navigate(['/manager-dashboard']);
    } else {
      alert('Unknown role');
    }
  }
}
