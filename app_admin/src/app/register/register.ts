import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {
  public formError: string = '';
  public isLoading: boolean = false;

  credentials = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  public onRegisterSubmit(): void {
    console.log('RegisterComponent: Form submitted');
    
    this.formError = '';

    if (!this.credentials.name || !this.credentials.email || !this.credentials.password || !this.credentials.passwordConfirm) {
      this.formError = 'All fields are required';
      return;
    }

    if (this.credentials.password !== this.credentials.passwordConfirm) {
      this.formError = 'Passwords do not match';
      return;
    }

    this.doRegister();
  }

  public doRegister(): void {
    console.log('RegisterComponent: Starting registration');
    
    this.isLoading = true;
    this.formError = '';
    
    const newUser: User = {
      name: this.credentials.name,
      email: this.credentials.email,
    };

    this.authenticationService.register(newUser, this.credentials.password).subscribe({
      next: (response: AuthResponse) => {
        console.log('RegisterComponent: Registration successful', response);
        this.isLoading = false;
        this.router.navigate(['']);
      },
      error: (error: any) => {
        console.error('RegisterComponent: Registration failed', error);
        this.isLoading = false;
        
        if (error.error && error.error.message) {
          this.formError = error.error.message;
        } else if (error.message) {
          this.formError = error.message;
        } else {
          this.formError = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
