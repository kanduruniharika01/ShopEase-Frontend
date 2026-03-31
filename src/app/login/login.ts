import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api'; // Your service
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private api: Api, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     this.api.login(this.loginForm.value).subscribe({
  //       next: (token: string) => {
  //         const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

  //         if (isBrowser) {
  //           localStorage.setItem('token', token); // Save JWT only in browser
  //         }

  //         const decoded: any = jwtDecode(token);
  //         const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  //         const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  //         localStorage.setItem('userId', userId);
  //         alert('Login successful!');

  //         // Redirect based on role (e-commerce specific)
  //         if (role === 'Admin') {
  //           this.router.navigate(['/admin-dashboard']);
  //         } else if (role === 'Customer') {
  //           //this.router.navigate(['/admin-dashboard']);
  //           this.router.navigate(['/customer-dashboard']);
  //         } else if (role === 'Manager') {
  //           //this.router.navigate(['/admin-dashboard']);
  //           this.router.navigate(['/manager-dashboard']);
  //         }
  //         else {
  //           //this.logout();
  //           this.router.navigate(['/admin-dashboard']);
  //         }
  //       },
  //       error: (err: any) => {
  //         alert(err.error || 'Invalid credentials');
  //       }
  //     });
  //   } else {
  //     alert('Please enter valid credentials.');
  //   }
  // }
  onSubmit() {
    if (this.loginForm.valid) {
      this.api.login(this.loginForm.value).subscribe({
        next: (token: string) => {

          localStorage.setItem('token', token);

          const decoded: any = jwtDecode(token);
          console.log("Decoded Token =", decoded); // DEBUG

          const role =
            decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            decoded['role'];

          const userId =
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
            decoded['nameid'] ||
            decoded['sub'];

          if (!userId) {
            alert("User ID not found in token!");
            return;
          }

          localStorage.setItem('userId', String(userId));

          alert('Login successful!');

          if (role === 'Admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (role === 'Customer') {
            this.router.navigate(['/customer-dashboard']);
          } else if (role === 'Manager') {
            this.router.navigate(['/manager-dashboard']);
          } else {
            this.router.navigate(['/admin-dashboard']);
          }
        },
        error: (err: any) => {
          alert(err.error || 'Invalid credentials');
        }
      });
    } else {
      alert('Please enter valid credentials.');
    }
  }

  logout() { // Clear authentication data (like tokens, session info)
    localStorage.removeItem('token');
    sessionStorage.clear();
    // Redirect to login or home
    this.router.navigate(['/login']);
  }
}
