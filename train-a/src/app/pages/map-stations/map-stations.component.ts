import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { debounceTime, mergeMap, Observable, of, take } from 'rxjs';

import { MapComponent } from '../../shared/components/map/map.component';
import { GeoService, CityLocation } from '../../services/geo.service';
import { SearchService, Station } from '../../services/search.service';
import { MarkerService } from '../../services/marker.service';
import { FormUtilsService } from '../../services/utils/form-utils-debounce.service';

@Component({
  selector: 'app-station-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MapComponent,
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
    NzIconModule,
  ],
  templateUrl: './map-stations.component.html',
  styleUrls: ['./map-stations.component.scss'],
})
export class MapStationComponent {
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  public stationForm: FormGroup;
  stations: Station[] = [];
  public relatedCities: CityLocation[] = [];
  public stations$: Observable<Station[]> = of([]);
  public cityOptions$: Observable<CityLocation[]>;

  constructor(
    private fb: FormBuilder,
    private geoService: GeoService,
    private searchService: SearchService,
    private markerService: MarkerService,
    private formUtilsService: FormUtilsService,
  ) {
    this.stationForm = this.fb.group({
      city: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      relations: this.fb.array([]),
    });
    this.cityOptions$ = this.formUtilsService.createSearchObservable(
      this.city,
      'coord',
      this.stationForm,
    );

    this.updateStation();

    this.city.valueChanges.pipe(
      debounceTime(300),
      mergeMap((cityName) => this.geoService.searchCity(cityName)),
    ).subscribe((results: CityLocation[]) => {
      if (results.length > 0) {
        const { lat, lon } = results[0];
        this.stationForm.patchValue({ latitude: lat, longitude: lon });
        this.updateRelatedStations(results[0].name);
      }
    });
  }

  private updateRelatedStations(cityName: string): void {
    if (this.stations.length === 0) {
      this.updateStation();
    }
      this.setRelatedCities(cityName);
  }

  private setRelatedCities(cityName: string): void {
    const station = this.stations.find((s) => s.city === cityName);
    if (station) {
      const relatedStationIds = station.connectedTo.map((conn) => conn.id);
      const relatedStations = this.stations.filter((s) => relatedStationIds.includes(s.id));
      this.relations.clear();
      relatedStations.forEach((city) => {
        this.relations.push(this.fb.group({
          cityName: [city.city],
          cityId: [city.id],
        }));
      });
    }
  }

  get city(): FormControl {
    return this.stationForm.get('city') as FormControl;
  }

  get relations(): FormArray {
    return this.stationForm.get('relations') as FormArray;
  }

  updateStation() {
    this.searchService.getStations().pipe(
      take(1),
    ).subscribe((stations) => {
      this.stations = stations;
    });
  }

  createRelation(): FormGroup {
    return this.fb.group({
      cityName: [''],
      cityId: [''],
    });
  }

  addRelation(): void {
    this.relations.push(this.createRelation());
  }

  removeRelation(index: number): void {
    this.relations.removeAt(index);
  }

  searchCity(city: string): void {
    if (city) {
      this.geoService.searchCity(city).subscribe((results: CityLocation[]) => {
        if (results.length > 0) {
          const { lat, lon } = results[0];
          this.stationForm.patchValue({ latitude: lat, longitude: lon });
        }
      });
    }
  }

  getIdByName(cityName: string): number {
    return this.stations.find((city) => city.city === cityName)?.id ?? 0;
  }

  addStation(): void {
    if (this.stationForm.valid) {
      const formValue = this.stationForm.value;
      const data = {
        city: formValue.city,
        latitude: formValue.latitude,
        longitude: formValue.longitude,
        relations: this.relations.controls
          .map((control) => this.getIdByName(control.value.cityName)),
      };
      this.searchService.addStation(data).pipe(take(1)).subscribe(() => {
        this.mapComponent.loadStations();
        this.relations.push(this.createRelation());
        this.stationForm.reset();
        this.relations.clear();
        this.updateStation();
      });
    }
  }

  deleteStation(stationId: number): void {
    this.searchService.deleteStation(stationId).subscribe(() => {
      this.mapComponent.loadStations();
      this.updateStation();
    });
  }

  onMarkerClick(station: Station): void {
    this.stationForm.get('city')?.setValue(station.city);
    this.stationForm.get('latitude')?.setValue(station.latitude);
    this.stationForm.get('longitude')?.setValue(station.longitude);
    // this.updateRelatedStations(station.city);
    this.markerService.selectMarkerByCity(station.city, 'from', this.setFormValue.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setFormValue(field: string, value: any): void {
    this.stationForm.get(field)?.setValue(value);
  }
}
