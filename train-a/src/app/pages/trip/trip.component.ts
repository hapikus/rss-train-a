import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SearchService } from '../../services/search.service';
import { Trip } from '../../models/trip';
import { StationService } from '../../services/station.service';
import { Station } from '../../models/station';
import { findStation } from '../../shared/utilities/find-station';
import { RouteModalComponent } from './route-modal/route-modal.component';
import { getModalData } from './helpers';
import { ModalData } from './models';
import { CarriageService } from '../../services/carriage.service';
import { Carriage } from '../../types/interfaces';
import { CarriageComponent } from "./carriage/carriage.component";

@Component({
  selector: 'app-trip',
  standalone: true,
  imports: [CommonModule, RouteModalComponent, NzTypographyModule, NzButtonModule, CarriageComponent],
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.scss',
})
export class TripComponent implements OnInit {
  public trip?: Trip;
  public carriages: Carriage[] = [];
  public stations: Station[] = [];
  public showModal: boolean = false;

  public rideId!: string;
  public fromStationId!: string;
  public toStationId!: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private searchService: SearchService,
    private stationService: StationService,
    private carriageService: CarriageService,
    private router: Router,
  ) {}

  public getStationName(id: number) {
    const station = findStation(id, this.stations);
    return station?.city;
  }

  public getStartTime() {
    const fromStationIndex = this.trip?.path.indexOf(+this.fromStationId) ?? 0;
    return this.trip?.schedule.segments[fromStationIndex].time[0];
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

    this.carriageService.getCarriages().pipe(
      take(1),
    ).subscribe((carriages) => {
      this.carriages = carriages;
    });
  }

  public get modalData(): ModalData[] {
    if (!!this.trip) {
      return getModalData(this.trip, this.fromStationId, this.toStationId, this.stations)
    }
    return [];
  }
}
