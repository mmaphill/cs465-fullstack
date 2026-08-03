import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripDataService } from '../services/trip-data';
import { TripSearchService } from '../services/trip-search';
import { Trip } from '../models/trips';

@Component({
  selector: 'app-travel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './travel.html',
  styleUrls: ['./travel.css'],
  providers: [TripDataService, TripSearchService],
})

export class TravelComponent implements OnInit {
  trips: Trip[] = [];
  searchResults: Trip[] = [];
  searchQuery : string = '';
  isSearching: boolean = false;

  constructor(
    private tripDataService: TripDataService,
    private tripSearchService: TripSearchService
  ) {}

  ngOnInit() {
    this.loadAllTrips();
  }

  loadAllTrips() {
    this.tripDataService.getTrips().subscribe(trips => {
      this.trips = trips;
    });
  }

  search(query: string) {
    if (!query || query.length < 1) {
      this.searchResults = [];
      this.trips = this.trips;
      return;
    }

    this.isSearching = true;
    this.tripSearchService.searchTrips(query).subscribe(
      results => {
        this.searchResults = results;
        this.trips = results;
        this.isSearching = false;
      },
      (error: any) => {
        console.error('Search error:', error);
        this.isSearching = false;
      }
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.loadAllTrips();
  }
}
