import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';

import { Observable, switchMap } from 'rxjs';

import {
  NzFormItemComponent,
  NzFormLabelComponent,
  NzFormControlComponent,
} from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import L, { Map } from 'leaflet';

import { CityLocation, GeoService } from '../../services/geo.service';
import { FormUtilsService } from '../../services/utils/form-utils-debounce.service';
import { ResponseSearch, Route, Schedule, SearchService, Station } from '../../services/search.service';
import { Coords, MarkerService } from '../../services/marker.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzInputModule,
    NzButtonComponent,
    NzGridModule,
    NzSelectModule,
    NzDatePickerModule,
    NzAutocompleteModule,
    NzTabsModule,
    LeafletModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  providers: [DatePipe],
})
export class MainComponent implements OnInit {
  public searchForm: FormGroup = this.fb.group({
    from: ['', Validators.required],
    to: ['', [Validators.required, this.notSameAsStart.bind(this)]],
    tripDate: ['', [Validators.required]],
    fromCoords: ['', Validators.required],
    toCoords: ['', Validators.required],
  });

  public fromOptions$: Observable<CityLocation[]>;
  public toOptions$: Observable<CityLocation[]>;

  public closestStationFrom: Station | null = null;
  public closestStationTo: Station | null = null;

  private stations: Station[] = [];
  private map!: Map;

  ngOnInit() {
    this.map = L.map('map').setView([43.068661, 141.350755], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    this.loadStations();
  }

  constructor(
    private fb: FormBuilder,
    private formUtilsService: FormUtilsService,
    private geoService: GeoService,
    private searchService: SearchService,
    private markerService: MarkerService,
    private datePipe: DatePipe,
  ) {
    this.fromOptions$ = this.formUtilsService.createSearchObservable(
      this.startCity,
      'fromCoords',
      this.searchForm,
    );
    this.toOptions$ = this.formUtilsService.createSearchObservable(
      this.endCity,
      'toCoords',
      this.searchForm,
    );

    // this.searchForm.get('from')?.valueChanges.subscribe((cityName) => {
    //   if (cityName) {
    //     this.markerService.selectMarkerByCity(cityName, 'from', this.setFormValue.bind(this));
    //   }
    // });

    // this.searchForm.get('to')?.valueChanges.subscribe((cityName) => {
    //   if (cityName) {
    //     this.markerService.selectMarkerByCity(cityName, 'to', this.setFormValue.bind(this));
    //   }
    // });
  }

  private loadStations() {
    this.searchService.getStations().subscribe((stations) => {
      this.stations = stations;
      this.addMarkersToMap();
    });
  }

  private addMarkersToMap() {
    this.stations.forEach((station) => {
      this.markerService.addMarkerToMap(this.map, station, this.handleMarkerClick.bind(this));
    });
  }

  private handleMarkerClick(station: Station, clickedMarker: L.Marker) {
    const fromCoords = this.searchForm.get('fromCoords')?.value;
    const toCoords = this.searchForm.get('toCoords')?.value;
    this.markerService.toggleMarker(
      station,
      clickedMarker,
      fromCoords,
      toCoords,
      this.setFormValue.bind(this),
    );
  }

  public setFormValue(field: string, value: string | Coords) {
    this.searchForm.patchValue({ [field]: value });
  }

  public resetForm(): void {
    this.searchForm.reset();
  }

  get startCity(): FormControl {
    return this.searchForm.get('from') as FormControl;
  }

  get endCity(): FormControl {
    return this.searchForm.get('to') as FormControl;
  }

  get tripDate() {
    return this.searchForm.get('tripDate');
  }

  private notSameAsStart(control: AbstractControl) {
    const startCity = this.searchForm?.get('from')?.value;
    if (control.value === startCity) {
      return { notSameAsStart: true };
    }
    return null;
  }

  public submitForm() {
    if (this.searchForm.valid) {
      const fromCoords = this.searchForm.get('fromCoords')?.value;
      const toCoords = this.searchForm.get('toCoords')?.value;
      const tripDate = this.searchForm.get('tripDate')?.value;
      const date = new Date(tripDate).toISOString();

      this.geoService
        .findClosestStation(fromCoords.lat, fromCoords.lon)
        .pipe(
          switchMap((stationFrom) => {
            this.markerService.selectMarkerByCity(
              stationFrom!.city,
              'from',
              this.setFormValue.bind(this),
            );
            return this.geoService.findClosestStation(toCoords.lat, toCoords.lon).pipe(
              switchMap((stationTo) => {
                this.markerService.selectMarkerByCity(
                  stationTo!.city,
                  'to',
                  this.setFormValue.bind(this),
                );
                if (stationFrom && stationTo) {
                  return this.searchService.searchRoutes(
                    stationFrom.latitude,
                    stationFrom.longitude,
                    stationTo.latitude,
                    stationTo.longitude,
                    date,
                  );
                }
                throw new Error('Can`t finde stations');
              }),
            );
          }),
        )
        .subscribe({
          next: (response) => {
            console.log('Response:', response);
            this.groupRoutes = this.getRoute(response);
          },
          error: (error) => {
            console.error('Error:', error);
          },
          complete: () => {
            console.log('Request completed');
          },
        });
    }
  }

  groupRoutes: GroupTabs[] = [];

  getRoute(response: ResponseSearch): GroupTabs[] {
    const { stationId, city } = response.from;
    const groupRoutes: { date: string; routes:TabRoutes[] }[] = [];

    response.routes.forEach((route: Route, routeIndex: number) => {
      const { path, id, schedule } = route;
      const [startStationId, endStationId] = [path[0], path[path.length - 1]];
      const indexPath = path.indexOf(stationId);

      if (schedule && schedule.length > 0) {
        schedule.forEach((scheduleItem: Schedule) => {
          const { segments, rideId } = scheduleItem;
          const segment = segments[indexPath];

          if (segment) {
            const [timeRide] = segment.time;
            const formatDate = this.datePipe.transform(new Date(timeRide), 'EEE, MMMM dd');

            if (formatDate) {
              let dateGroup = groupRoutes.find((group) => group.date === formatDate);

              if (!dateGroup) {
                dateGroup = { date: formatDate, routes: [] };
                groupRoutes.push(dateGroup);
              }

              dateGroup.routes.push({
                rideId,
                routeIndex,
                id,
                indexPath,
                route,
                timeRide,
                departureTime: formatDate,
                stationId,
                city,
                startStationId,
                endStationId,
              });
            }
          }
        });
      }
    });

    this.groupRoutes = groupRoutes;
    return groupRoutes;
}

  public disabledDates(date: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.getTime() < today.getTime();
  }
}

export interface GroupTabs {
  date: string,
  routes: TabRoutes[],
}
export interface TabRoutes {
  rideId: number,
  routeIndex: number,
  id: number,
  indexPath: number,
  route: Route,
  timeRide: string,
  departureTime: string,
  stationId: number,
  city: string,
  startStationId: number,
  endStationId: number,
}

    // THIS WE NEED TO USE WHEN CREATE MANAGER PAHE WITH STATION
    // if (this.searchForm.valid) {
    //   const fromCoords = this.searchForm.get('fromCoords')?.value;
    //   const toCoords = this.searchForm.get('toCoords')?.value;
    //   const tripDate = this.searchForm.get('tripDate')?.value;
    //   const unixTime = tripDate ? new Date(tripDate).getTime() : undefined;
    //   this.searchService
    //     .searchRoutes(
    //       fromCoords.lat,
    //       fromCoords.lon,
    //       toCoords.lat,
    //       toCoords.lon,
    //       unixTime,
    //     )
    //     .subscribe({
    //       next: (response) => {
    //         console.log('Response:', response);
    //       },
    //       error: (error) => {
    //         console.error('Error:', error);
    //       },
    //       complete: () => {
    //         console.log('Request completed');
    //       },
    //     });
    // }

  //   {
  //     "routes": [
  //         {
  //             "path": [
  //                 60,
  //                 126,
  //                 108,
  //             ],
  //             "carriages": [
  //                 "carriage2",
  //                 "carriage2",
  //                 "carriage3",
  //             ],
  //             "id": 239,
  //             "schedule": [
  //                 {
  //                     "rideId": 845,
  //                     "segments": [
  //                         {
  //                             "time": [
  //                                 "2024-10-16T06:47:40.833Z",
  //                                 "2024-10-18T18:24:40.833Z"
  //                             ],
  //                             "price": {
  //                                 "carriage2": 874,
  //                                 "carriage3": 151,
  //                                 "carriage1": 1448
  //                             },
  //                             "occupiedSeats": []
  //                         },
  //                         {
  //                             "time": [
  //                                 "2024-10-18T18:31:40.833Z",
  //                                 "2024-10-21T09:06:40.833Z"
  //                             ],
  //                             "price": {
  //                                 "carriage2": 2270,
  //                                 "carriage3": 2287,
  //                                 "carriage1": 355
  //                             },
  //                             "occupiedSeats": []
  //                         },
  //                         {
  //                             "time": [
  //                                 "2024-10-21T09:56:40.833Z",
  //                                 "2024-10-23T23:44:40.833Z"
  //                             ],
  //                             "price": {
  //                                 "carriage2": 1908,
  //                                 "carriage3": 1114,
  //                                 "carriage1": 332
  //                             },
  //                             "occupiedSeats": []
  //                         },
  //                     ]
  //                 }
  //             ]
  //         },
  //         {
  //             "path": [
  //                 14,
  //                 60,
  //                 56,
  //                 29,
  //                 108,
  //                 122,
  //             ],
  //             "carriages": [
  //                 "carriage3",
  //                 "carriage1",
  //                 "carriage1",
  //                 "carriage1",
  //             ],
  //             "id": 499,
  //             "schedule": [
  //                 {
  //                     "rideId": 1689,
  //                     "segments": [
  //                         {
  //                             "time": [
  //                                 "2024-09-25T21:39:51.462Z",
  //                                 "2024-09-29T09:20:51.462Z"
  //                             ],
  //                             "price": {
  //                                 "carriage3": 1183,
  //                                 "carriage1": 1917,
  //                                 "carriage2": 1037
  //                             },
  //                             "occupiedSeats": []
  //                         },
  //                         {
  //                             "time": [
  //                                 "2024-09-29T10:09:51.462Z",
  //                                 "2024-10-01T22:40:51.462Z"
  //                             ],
  //                             "price": {
  //                                 "carriage3": 292,
  //                                 "carriage1": 1383,
  //                                 "carriage2": 1028
  //                             },
  //                             "occupiedSeats": []
  //                         },
  //                         {
  //                             "time": [
  //                                 "2024-10-01T23:07:51.462Z",
  //                                 "2024-10-04T05:40:51.462Z"
  //                             ],
  //                             "price": {
  //                                 "carriage3": 2006,
  //                                 "carriage1": 341,
  //                                 "carriage2": 726
  //                             },
  //                             "occupiedSeats": []
  //                         },
  //                         {
  //                             "time": [
  //                                 "2024-10-04T05:59:51.462Z",
  //                                 "2024-10-04T22:07:51.462Z"
  //                             ],
  //                             "price": {
  //                                 "carriage3": 1543,
  //                                 "carriage1": 931,
  //                                 "carriage2": 2240
  //                             },
  //                             "occupiedSeats": []
  //                         },
  //                         {
  //                             "time": [
  //                                 "2024-10-04T22:40:51.462Z",
  //                                 "2024-10-07T02:57:51.462Z"
  //                             ],
  //                             "price": {
  //                                 "carriage3": 1459,
  //                                 "carriage1": 1792,
  //                                 "carriage2": 1428
  //                             },
  //                             "occupiedSeats": []
  //                         },
  //                         {
  //                             "time": [
  //                                 "2024-10-07T03:46:51.462Z",
  //                                 "2024-10-07T12:18:51.462Z"
  //                             ],
  //                             "price": {
  //                                 "carriage3": 2243,
  //                                 "carriage1": 500,
  //                                 "carriage2": 547
  //                             },
  //                             "occupiedSeats": []
  //                         },
  //                     ]
  //                 }
  //             ]
  //         }
  //     ],
  //     "from": {
  //         "stationId": 60,
  //         "city": "city60",
  //         "geolocation": {
  //             "latitude": 58.34779024913175,
  //             "longitude": 153.7217502979101
  //         }
  //     },
  //     "to": {
  //         "stationId": 108,
  //         "city": "city108",
  //         "geolocation": {
  //             "latitude": 53.40928925006975,
  //             "longitude": 59.30629572419923
  //         }
  //     }
  // }
