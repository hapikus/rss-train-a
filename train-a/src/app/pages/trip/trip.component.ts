import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SearchService } from '../../services/search.service';
import { Trip } from '../../models/trip';
import { StationService } from '../../services/station.service';
import { Station } from '../../models/station';
import { findStation } from '../../shared/utilities/find-station';
import { RouteModalComponent } from './route-modal/route-modal.component';

@Component({
  selector: 'app-trip',
  standalone: true,
  imports: [CommonModule, RouteModalComponent, NzButtonModule],
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.scss',
})
export class TripComponent implements OnInit {
  public trip?: Trip;
  public stations: Station[] = [];
  public showModal: boolean = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private searchService: SearchService,
    private stationService: StationService,
  ) {}

  public getStationName(id: number) {
    const station = findStation(id, this.stations);
    return station?.city;
  }

  public toggleShowModal() {
    this.showModal = !this.showModal;
  }

  public ngOnInit(): void {
    const { rideId } = this.activateRoute.snapshot.params;
    this.searchService.getRide(rideId).pipe(
      take(1),
    ).subscribe((trip) => {
      this.trip = trip;
    });

    this.stationService.getStations().pipe(
      take(1),
    ).subscribe((stations) => {
      this.stations = stations;
    });
  }
}
