import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

import {
  AbstractControl,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { CityLocation, GeoService } from '../../services/geo.service';
import { FormUtilsService } from '../../shared/utilities/form-utils-debounce.service';
import { SearchService } from '../../services/search.service';
import { Station } from '../../services/stations.service';

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
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  searchForm: FormGroup = this.fb.group({
    from: ['', Validators.required],
    to: ['', [Validators.required, this.notSameAsStart.bind(this)]],
    tripDate: ['', [Validators.required]],
    fromCoords: ['', Validators.required],
    toCoords: ['', Validators.required],
  });

  fromOptions$: Observable<CityLocation[]>;

  toOptions$: Observable<CityLocation[]>;

  closestStationFrom: Station | null = null;
  closestStationTo: Station | null = null;

  constructor(
    private fb: FormBuilder,
    private formUtilsService: FormUtilsService,
    private geoService: GeoService,
    private searchService: SearchService,
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

  resetForm(): void {
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

  notSameAsStart(control: AbstractControl) {
    const startCity = this.searchForm?.get('from')?.value;
    if (control.value === startCity) {
      return { notSameAsStart: true };
    }
    return null;
  }

  submitForm() {
    if (this.searchForm.valid) {
      const fromCoords = this.searchForm.get('fromCoords')?.value;
      const toCoords = this.searchForm.get('toCoords')?.value;
      const tripDate = this.searchForm.get('tripDate')?.value;
      const date = new Date(tripDate);
      date.setHours(0, 0, 0, 0);
   // const unixTime = new Date(date).getTime();
   // Someday... someday...

      this.geoService.findClosestStation(fromCoords.lat, fromCoords.lon).pipe(
        switchMap((stationFrom) => {
          this.closestStationFrom = stationFrom;
          return this.geoService.findClosestStation(toCoords.lat, toCoords.lon).pipe(
            switchMap((stationTo) => {
              this.closestStationTo = stationTo;
              if (stationFrom && stationTo) {
                return this.searchService.searchRoutes(
                  stationFrom.latitude,
                  stationFrom.longitude,
                  stationTo.latitude,
                  stationTo.longitude,
                  1723669200000,
                  // this time stamp doesn work correctly, start using it when ...
                );
              }
                throw new Error('Can`t finde stations');
            }),
          );
        }),
      ).subscribe({
        next: (response) => {
          console.log('Response:', response);
        },
        error: (error) => {
          console.error('Error:', error);
        },
        complete: () => {
          console.log('Request completed');
        },
      });
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
  }

  today = new Date();

  public disabledDates(date: Date) {
    return date.getTime() < new Date().getTime();
  }
}
