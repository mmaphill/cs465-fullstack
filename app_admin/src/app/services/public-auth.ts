import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PublicAuthService {
  private isLoggedInSubject!: BehaviorSubject<boolean>;
  public isLoggedIn$!: Observable<boolean>;

  private baseUrl = 'https://localhost:3000';

  constructor(private http: HttpClient) {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
    this.checkSessionStatus();
  }

  private checkLoginStatus(): boolean { return sessionStorage.getItem('travlr-token') !== null; }

  checkSessionStatus(): void {
    //const token = sessionStorage.getItem('travlr-token');
    //this.isLoggedInSubject.next(!!token);
  }

  // Navigate to login page
  login(): void {
    window.location.href = `${this.baseUrl}/auth/login`;
  }

  // Navigate to register page
  register(): void {
    window.location.href = `${this.baseUrl}/auth/register`;
  }

  // Logout and remove token from session storage
  logout(): void {
    window.location.href = `${this.baseUrl}/auth/logout`;
  }

  // set login state
  setLoggedIn(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      sessionStorage.setItem('publicUserLogged', 'true');
    } else {
      sessionStorage.removeItem('publicUserLogged');
    }
    this.isLoggedInSubject.next(isLoggedIn);
  }
}
