import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) { }

  /**
   * Get JWT token from storage
   * Storage key: 'travlr-token'
   */
  public getToken(): string {
    const token = this.storage.getItem('travlr-token');
    return token ? token : '';
  }

  /**
   * Save JWT token to storage
   * Storage key: 'travlr-token'
   */
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  /**
   * Logout and remove token from storage
   */
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  /**
   * Check if user is logged in and token is still valid
   * Parses JWT expiration to verify validity
   */
  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > (Date.now() / 1000);
      } catch (error) {
        console.error('Error parsing token:', error);
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Get current logged-in user from token
   */
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  /**
   * Login - returns Observable so component can handle async response
   * Saves token automatically when login succeeds
   */
  public login(user: User, passwd: string): Observable<AuthResponse> {
    return this.tripDataService.login(user, passwd).pipe(
      tap((response: AuthResponse) => {
        console.log('✅ AuthenticationService: Login response received', response);
        if (response && response.token) {
          this.saveToken(response.token);
          console.log('✅ AuthenticationService: Token saved');
        }
      })
    );
  }

  /**
   * Register - returns Observable so component can handle async response
   * Saves token automatically when registration succeeds
   */
  public register(user: User, passwd: string): Observable<AuthResponse> {
    return this.tripDataService.register(user, passwd).pipe(
      tap((response: AuthResponse) => {
        console.log('✅ AuthenticationService: Register response received', response);
        if (response && response.token) {
          this.saveToken(response.token);
          console.log('✅ AuthenticationService: Token saved');
        }
      })
    );
  }
}
