import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trip } from '../models/trips';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})

export class TripSearchService {
  constructor(private http: HttpClient) {}

  private baseUrl = '/api';

  searchTrips(query: string): Observable<Trip[]> {
    return this.http.get<ApiResponse<Trip[]>>(`${this.baseUrl}/trips/search`, { params: { query } })
      .pipe(
        map((response: ApiResponse<Trip[]>) => response.data)
      );
  }

  getRecommendations(): Observable<Trip[]> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/trips/recommendations`).pipe(
      map(response => response.data)
    );
  }

  getSimilarTrips(tripCode: string): Observable<Trip[]> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/trips/${tripCode}/similar`).pipe(
      map(response => response.data)
    );
  }
}
