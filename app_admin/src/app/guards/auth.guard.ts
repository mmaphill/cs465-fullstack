import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('AuthGuard: Checking authentication for route:', state.url);
    
    if (this.authService.isLoggedIn()) {
      console.log('AuthGuard: User is logged in, allowing access');
      return true;
    } else {
      console.log('AuthGuard: User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
