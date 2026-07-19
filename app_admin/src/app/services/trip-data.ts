import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from  'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { ApiResponse } from '../models/api-response';
import { BROWSER_STORAGE } from '../storage';
import { Trip } from '../models/trips';

@Injectable({
  providedIn: 'root',
})

export class TripDataService {
  constructor(
    private http: HttpClient,
    @Inject (BROWSER_STORAGE) private storage: Storage
  ) {}

  url = 'http://localhost:3000/api/trips';
  baseUrl = 'http://localhost:3000/api';

  getTrips(): Observable<Trip[]> {
    return this.http.get<ApiResponse<Trip[]>>(this.url).pipe(
      map(response => response.data || [])
    );
  }

  addTrip(formData: Trip) : Observable<Trip> {
    return this.http.post<ApiResponse<Trip>>(this.url, formData).pipe(
      map(response => response.data)
    );
  }

  getTrip(tripCode: string) : Observable<Trip> {
    // console.log('Inside TripDataService::getTrips');
    return this.http.get<ApiResponse<Trip>>(this.url + '/' + tripCode).pipe(
      map(response => response.data)
    );
  }

  updateTrip(formData: Trip) :Observable<Trip> {
    // console.log('Inside TripDataService::addTrips');
    return this.http.put<ApiResponse<Trip>>(this.url + '/' + formData.code, formData).pipe(
      map(response => response.data)
    );
  }

  deleteTrip(tripCode: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(this.url + '/' + tripCode).pipe(
      map(response => response.data)
    );
  }

  // call to our /login endpoint, returns JWT
  login(user: User, passwd: string) : Observable<AuthResponse> {
    // console.log('Inside TripDataService::login');
    return this.handleAuthAPICall('login', user, passwd);
  }

  // call to our /register endpoint, creates user and returns JWT
  register(user: User, passwd: string) : Observable<AuthResponse> {
    // console.log('Inside TripDataService::register');
    return this.handleAuthAPICall('register', user, passwd);
  }

  // helper method to process both login and register methods
  handleAuthAPICall(endpoint: string, user: User, passwd: string) : Observable<AuthResponse> {
    // console.log('Inside TripDataService::handleAuthAPICall');
    let formData = {
      username: user.name,
      email: user.email,
      password: passwd,
      passwordConfirm: passwd
    };

    return this.http.post<ApiResponse<AuthResponse>>(this.baseUrl + '/' + endpoint, formData).pipe(
      map(response => response.data)
    );
  }
}
