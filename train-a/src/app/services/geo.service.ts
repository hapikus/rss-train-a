import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchService, Station } from './search.service';

export interface CityLocation {
  name: string;
  lat: string;
  lon: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  private apiUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(
    private http: HttpClient,
    private searchService: SearchService,
  ) {}

  public searchCity(city: string): Observable<CityLocation[]> {
    const params = {
      q: city,
      format: 'json',
      limit: '5',
    };
    return this.http.get<CityLocation[]>(this.apiUrl, { params }).pipe(
      map((results) =>
        results.map((result) => ({
          name: result.name,
          lat: result.lat,
          lon: result.lon,
        }))),
    );
  }

  public findClosestStation(lat: string, lon: string): Observable<Station | null> {
    return this.searchService.findClosestStation(parseFloat(lat), parseFloat(lon));
  }
}
