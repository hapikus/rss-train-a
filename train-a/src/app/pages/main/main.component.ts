import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';

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
import { differenceInCalendarDays } from 'date-fns';
import { CityLocation, GeoService } from '../../services/geo.service';
import { FormUtilsService } from '../../shared/utilities/form-utils-debounce.service';

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

  inputValue?: string;
  options: string[] = [];

  fromOptions$: Observable<CityLocation[]>;

  toOptions$: Observable<CityLocation[]>;

  constructor(
    private fb: FormBuilder,
    private formUtilsService: FormUtilsService,
    private geoService: GeoService,
  ) {
    this.fromOptions$ = this.formUtilsService.searchWithDebounce(this.startCity!);
    this.toOptions$ = this.formUtilsService.searchWithDebounce(this.endCity!);
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
      console.log(this.searchForm.value);
    }
  }

  today = new Date();

  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i + 1) {
      result.push(i);
    }
    return result;
  }

  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) < 0;

  onInput(event: Event, type: 'from' | 'to'): void {
    const { value } = event.target as HTMLInputElement;
    if (value) {
      of(value)
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((inputValue) => this.geoService.searchCity(inputValue)),
        )
        .subscribe((results: CityLocation[]) => {
          this.options = results.map((result) => result.name);
          if (results.length > 0) {
            const coordsControlName = type === 'from' ? 'fromCoords' : 'toCoords';
            this.searchForm.get(coordsControlName)?.setValue({
              lat: results[0].lat,
              lon: results[0].lon,
            });
          }
        });
    } else {
      this.options = [];
    }
  }
}
