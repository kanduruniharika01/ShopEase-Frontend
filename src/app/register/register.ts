
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../services/api';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, HttpClientModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private api: Api, private router: Router) {
    this.registerForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // ✅ Move this method outside the constructor
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }


  onSubmit() {
    if (this.registerForm.valid) {
      const payload = {
        name: this.registerForm.value.fullname,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        phone: this.registerForm.value.phone
      };

      this.api.register(payload).subscribe({
        next: (res: any) => {
          alert('Registration successful!');
          this.router.navigate(['/login']);
          console.log(res);
        },
        error: (err: any) => {
          alert(err.error || 'Registration failed!');
          console.error(err);
        }
      });
    } else {
      alert('Please fill all fields correctly.');
    }
  }

}
