import { Component } from '@angular/core';
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

import { CityLocation, GeoService } from '../../services/geo.service';
import { FormUtilsService } from '../../services/utils/form-utils-debounce.service';
import { ResponseSearch, Route, Schedule, SearchService, Station } from '../../services/search.service';
import { Coords, MarkerService } from '../../services/marker.service';
import { MapComponent } from '../../shared/components/map/map.component';

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
    MapComponent,
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  providers: [DatePipe],
})
export class MainComponent {
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
  }

  public handleMarkerClick(station: Station) {
    const fromCoords = this.searchForm.get('fromCoords')?.value;
    const toCoords = this.searchForm.get('toCoords')?.value;

    this.markerService.toggleMarker(
      station,
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
            this.getRoute(response);
          },
        });
    }
  }

  groupRoutes: GroupTabs[] = [];

  getRoute(response: ResponseSearch): GroupTabs[] {
    const { stationId: stationIdFrom, city: cityFrom } = response.from;
    const { stationId: stationIdTo, city: cityTo } = response.to;
    const groupRoutes: { date: string; routes:TabRoutes[] }[] = [];

    response.routes.forEach((route: Route, routeIndex: number) => {
      const { path, id, schedule } = route;
      const [startStationId, endStationId] = [path[0], path[path.length - 1]];
      const indexFrom = path.indexOf(stationIdFrom);
      const indexTo = path.indexOf(stationIdTo);

      if (schedule && schedule.length > 0) {
        schedule.forEach((scheduleItem: Schedule) => {
          const { segments, rideId } = scheduleItem;
          const segmentFrom = segments[indexFrom];
          const segmentTo = segments[indexTo];

          if (segmentFrom && segmentTo) {
            const [timeStarted] = segmentFrom.time;
            const [timeArrived] = segmentTo.time;
            const formatDateStarted = this.datePipe.transform(new Date(timeStarted), 'EEE, MMMM dd');
            const fromatDateArrived = this.datePipe.transform(new Date(timeArrived), 'EEE, MMMM dd');

            if (formatDateStarted && fromatDateArrived) {
              let dateGroup = groupRoutes.find((group) => group.date === formatDateStarted);

              if (!dateGroup) {
                dateGroup = { date: formatDateStarted, routes: [] };
                groupRoutes.push(dateGroup);
              }

              dateGroup.routes.push({
                rideId,
                routeIndex,
                id,
                indexFrom,
                route,
                timeStarted,
                timeArrived,
                departureTime: formatDateStarted,
                arrivedTime: fromatDateArrived,
                stationIdFrom,
                cityFrom,
                cityTo,
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
  indexFrom: number,
  route: Route,
  timeStarted: string,
  timeArrived: string,
  departureTime: string,
  arrivedTime: string,
  stationIdFrom: number,
  cityFrom: string,
  stationIdTo?: number,
  cityTo?: string,
  startStationId: number,
  endStationId: number,
}
