import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SearchService } from '../../services/search.service';
import { Trip } from '../../models/trip';
import { StationService } from '../../services/station.service';
import { Station } from '../../models/station';
import { findStation } from '../../shared/utilities/find-station';
import { RouteModalComponent } from './route-modal/route-modal.component';
import { getModalData } from './helpers';
import { ModalData } from './models';

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

  public rideId!: string;
  public fromStationId!: string;
  public toStationId!: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private searchService: SearchService,
    private stationService: StationService,
    private router: Router,
  ) {}

  public getStationName(id: number) {
    const station = findStation(id, this.stations);
    return station?.city;
  }

  public toggleShowModal() {
    this.showModal = !this.showModal;
  }

  public ngOnInit(): void {
    this.rideId = this.activateRoute.snapshot.paramMap.get('rideId') ?? '';
    this.fromStationId = this.activateRoute.snapshot.queryParamMap.get('from') ?? '';
    this.toStationId = this.activateRoute.snapshot.queryParamMap.get('to') ?? '';

    if (!this.rideId || !this.fromStationId || !this.toStationId) {
      this.router.navigate(['/']);
    }

    this.searchService.getRide(this.rideId).pipe(
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

  public get modalData(): ModalData[] {
    if (!!this.trip) {
      return getModalData(this.trip, this.fromStationId, this.toStationId, this.stations)
    }
    return [];
  }
}
