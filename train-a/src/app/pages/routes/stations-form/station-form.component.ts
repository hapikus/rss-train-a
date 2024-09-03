import { Component } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  FormControl,
  ReactiveFormsModule,
  FormRecord,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ApiService, CarriageResponse, StationResponse } from '../../../services/api.service';
import { RoutesService } from '../../../services/routes.service';

const STATIONS_LENGTH_MESSAGE = 'The number of stations must be at least 3';
const CARRIAGES_LENGTH_MESSAGE = 'The number of carriages must be at least 3';

@Component({
  selector: 'app-stations-form',
  standalone: true,
  imports: [
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
  ],
  templateUrl: './station-form.component.html',
  styleUrl: './station-form.component.scss',
})
export class StationsFormComponent {
  public citiesSubform: FormRecord<FormControl<string>> = this.fb.record({});
  public carriagesSubform: FormRecord<FormControl<string>> = this.fb.record({});
  public listOfCitiesControl: Array<{ id: number; controlInstance: string }> = [];
  public listOfCarriagesControl: Array<{ id: number; controlInstance: string }> = [];
  public stations: StationResponse[] = [];
  public carriages: CarriageResponse[] = [];
  public connectedStations: string[][] = [[]];
  public stationsLengthMessage: string = STATIONS_LENGTH_MESSAGE;
  public carriagesLengthMessage: string = CARRIAGES_LENGTH_MESSAGE;
  public isSaveButtonDisabled = true;

  constructor(
    private readonly apiService: ApiService,
    private readonly routesService: RoutesService,
    private fb: NonNullableFormBuilder,
  ) {
    if (this.routesService.mode === 'update') {
      this.addCityField(this.routesService.updatingRoute.cities[0]);
      this.addCarriageField(this.routesService.updatingRoute.carriages[0]);
    } else {
      this.addCityField();
      this.addCarriageField();
    }
    this.init();
  }

  async init() {
    const stations = await this.apiService.fetchStations();
    const carriages = await this.apiService.fetchCarriages();
    this.stations = stations;
    this.carriages = carriages;
    if (this.routesService.mode === 'update') {
      for (let i = 1; i < this.routesService.updatingRoute.cities.length; i += 1) {
        const cs = this.getConnectedStationsByCity(this.routesService.updatingRoute.cities[i - 1]);
        this.connectedStations.push(cs);
        this.addCityField(this.routesService.updatingRoute.cities[i]);
      }
      this.addCityField();
      for (let i = 1; i < this.routesService.updatingRoute.carriages.length; i += 1) {
        this.addCarriageField(this.routesService.updatingRoute.carriages[i]);
      }
      this.addCarriageField();
    }
  }

  async addCityField(initValue: string = '', e?: MouseEvent) {
    e?.preventDefault();

    const id =
      this.listOfCitiesControl.length > 0
        ? this.listOfCitiesControl[this.listOfCitiesControl.length - 1].id + 1
        : 0;

    const control = {
      id,
      controlInstance: `station${id}`,
    };
    const index = this.listOfCitiesControl.push(control);

    if (id >= 3) {
      this.stationsLengthMessage = '';
      if (
        Object.keys(this.carriagesSubform.value).filter(
          (k) => this.carriagesSubform.value[k] !== '',
        ).length >= 3
      ) {
        this.isSaveButtonDisabled = false;
      }
      this.citiesSubform.addControl(
        this.listOfCitiesControl[index - 1].controlInstance,
        this.fb.control(initValue),
      );
    } else {
      this.isSaveButtonDisabled = true;
      this.citiesSubform.addControl(
        this.listOfCitiesControl[index - 1].controlInstance,
        this.fb.control(initValue, Validators.required),
      );
    }
  }

  async addCarriageField(initValue: string = '', e?: MouseEvent) {
    e?.preventDefault();

    const id =
      this.listOfCarriagesControl.length > 0
        ? this.listOfCarriagesControl[this.listOfCarriagesControl.length - 1].id + 1
        : 0;

    const control = {
      id,
      controlInstance: `carriage${id}`,
    };
    const index = this.listOfCarriagesControl.push(control);
    if (id >= 3) {
      if (
        Object.keys(this.citiesSubform.value).filter((k) => this.citiesSubform.value[k] !== '')
          .length >= 3
      ) {
        this.isSaveButtonDisabled = false;
      }
      this.carriagesLengthMessage = '';
      this.carriagesSubform.addControl(
        this.listOfCarriagesControl[index - 1].controlInstance,
        this.fb.control(initValue),
      );
    } else {
      this.isSaveButtonDisabled = true;
      this.carriagesSubform.addControl(
        this.listOfCarriagesControl[index - 1].controlInstance,
        this.fb.control(initValue, Validators.required),
      );
    }
  }

  removeCityField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfCitiesControl.length > 1) {
      const index = this.listOfCitiesControl.indexOf(i);
      this.listOfCitiesControl.splice(index, 1);
      this.citiesSubform.removeControl(i.controlInstance);
    }
  }

  removeCarriageField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfCarriagesControl.length > 1) {
      const index = this.listOfCarriagesControl.indexOf(i);
      this.listOfCarriagesControl.splice(index, 1);
      this.carriagesSubform.removeControl(i.controlInstance);
    }
  }

  submitForm(): void {
    if (this.citiesSubform.valid && this.carriagesSubform.valid) {
      const stations = Object.keys(this.citiesSubform.value)
        .filter((k) => this.citiesSubform.value[k] !== '')
        .map((k) => this.citiesSubform.value[k]);
      const paths = this.stations.filter((s) => stations.includes(s.city)).map((s) => s.id);
      const carriages = Object.keys(this.carriagesSubform.value)
        .filter((k) => this.carriagesSubform.value[k] !== '')
        .map((k) => this.carriagesSubform.value[k]) as string[];
      if (this.routesService.mode === 'create') {
        this.routesService.createRoute({ carriages, path: paths });
      }
      if (this.routesService.mode === 'update') {
        this.routesService.updateRoute({
          carriages,
          path: paths,
          id: this.routesService.updatingRoute.id,
        });
      }
      this.routesService.mode = 'view';
    } else {
      Object.values(this.citiesSubform.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      Object.values(this.carriagesSubform.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  getConnectedStationsByCity(city: string): string[] {
    const station = this.stations.find((s) => s.city === city);

    if (!station || !station.connectedTo) {
      return [];
    }
    const result = station.connectedTo
      .map((i) => this.stations.find((s) => s.id === i.id)?.city)
      .filter((c): c is string => c !== undefined);
    return result;
  }

  addStation(i: number, v: string) {
    if (this.listOfCitiesControl.length === i + 1) {
      const cs = this.getConnectedStationsByCity(v);
      this.connectedStations.push(cs);
      this.addCityField();
    }
  }

  addCarriage(i: number) {
    if (this.listOfCarriagesControl.length === i + 1) {
      this.addCarriageField();
    }
  }
}
