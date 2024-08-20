import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { CityLocation, GeoService } from '../../services/geo.service';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  constructor(private geoService: GeoService) {}

  searchWithDebounce(control: FormControl, debounce: number = 300): Observable<CityLocation[]> {
    return control.valueChanges.pipe(
      debounceTime(debounce),
      switchMap((inputValue: string) => this.geoService.searchCity(inputValue)),
    );
  }
}
