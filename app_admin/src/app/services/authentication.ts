import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  // setup our storage and sevice access
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) { }

  // variable to handle authentication responses
  authResp: AuthResponse = new AuthResponse();

  // Get out token from our Storage provider
  // NOTE: for this application we have decided that we will name
  // the key for our token 'travlr-token'
  public getToken(): string {
    let out: any;
    out = this.storage.getItem('travlr-token');

    // make sure we return a string even if we don't have a token
    if (!out)
    {
      return '';
    }
    return out;
  }

  // save our token to our storage provider
  // NOTE: for this application we have decided that we will name
  // the key for our token 'travlr-token'
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // logout of our application and remove the JWT from Storage
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // boolean to determine if we are logged in and the token is
  // still valid. even if we have a token we will still have to
  // reauthenticate if the token has expired
  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  // retrieve the current user. this function should only be called
  // after the calling method has checked to make sure that the user
  // isLoggedIn
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  // login method that leverages the login method in TripDataService
  // because that method returns an observable, we subscribe to the
  // result and only process when the observable condition is satisfied
  // uncommen the two console.log messages for additional debugging
  // information
  public login(user: User, passwd: string) : void {
    this.tripDataService.login(user,passwd)
      .subscribe({
        next: (value: any) => {
          if(value)
          {
            console.log(value);
            this.authResp = value;
            this.saveToken(this.authResp.token);
          }
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      })
  }

  // register method that leverage the register method in
  // TripDataService
  // because that method returns an observable, we subscribe to the
  // result and only process when the observable condition is satisfied
  // uncommen the two console.log messages for additional debugging
  // information. Please NOTE: this method is nearly identical to the 
  // login method because the behavior of the API logs a new user in
  // immediately upon registration
  public register(user: User, passwd: string) : void {
    this.tripDataService.register(user,passwd)
    .subscribe({
      next: (value: any) => {
        if(value)
        {
          console.log(value);
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    })
  }
}
