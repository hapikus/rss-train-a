import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { CityLocation, GeoService } from '../../services/geo.service';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  constructor(private geoService: GeoService) {}

  createSearchObservable(
    inputControl: FormControl,
    coordsControlName: string,
    searchForm: FormGroup,
  ): Observable<CityLocation[]> {
    return inputControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: string) => this.geoService.searchCity(value)),
      tap((results: CityLocation[]) => {
        if (results.length > 0) {
          searchForm.get(coordsControlName)?.setValue({
            lat: results[0].lat,
            lon: results[0].lon,
          });
        }
      }),
    );
  }
}
