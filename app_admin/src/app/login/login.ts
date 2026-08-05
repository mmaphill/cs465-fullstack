import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  public formError: string = '';
  public isLoading: boolean = false;
  submitted: boolean = false;

  credentials: { email: string; password:string; } = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  public onLoginSubmit(): void {
    console.log('🔵 LoginComponent: Form submitted');
    
    this.formError = '';
    this.submitted = true;

    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
      return;
    }

    this.doLogin();
  }

  public doLogin(): void {
    console.log('LoginComponent: Starting login');
    
    this.isLoading = true;
    this.formError = '';

    // Subscribe to the login Observable
    this.authenticationService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (response: AuthResponse) => {
        console.log('LoginComponent: Login successful', response);
        this.isLoading = false;

        // Token is now saved by AuthenticationService
        // Navigate to dashboard
        this.router.navigate(['']);
      },
      error: (error: any) => {
        console.error('LoginComponent: Login failed', error);
        this.isLoading = false;
        
        // Extract error message from API response
        if (error.error && error.error.message) {
          this.formError = error.error.message;
        } else if (error.message) {
          this.formError = error.message;
        } else {
          this.formError = 'Login failed. Please check your credentials and try again.';
        }
      }
    });
  }
}
