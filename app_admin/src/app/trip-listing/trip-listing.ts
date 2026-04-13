import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {CommonModule } from '@angular/common';
import { Trip } from '../models/trips';
import { TripCardComponent } from '../trip-card/trip-card';
import { TripDataService } from '../services/trip-data';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
  providers: [TripDataService]
})

export class TripListingComponent implements OnInit {
  trips: Trip[] = [];
  message: string = '';
  
  constructor(
    private tripDataService: TripDataService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authenticationService: AuthenticationService
    ) {
    console.log('trip-listing constructor');
  }

  public isLoggedIn(): boolean
  {
    return this.authenticationService.isLoggedIn();
  }

  public addTrip(): void
  {
    this.router.navigate(['add-trip']);
  }

  private getStuff(): void
  {
    this.tripDataService.getTrips()
    .subscribe({
      next: (value: any) => {
        this.trips = value;
        this.cdr.detectChanges(); // force update
        if(value.length > 0) {
          this.message = 'There are ' + value.length + ' trips available.';
        }
        else {
          this.message = 'There were no trips retrieved from the database';
        }
        console.log(this.message);
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    })
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.getStuff();
  }
}
