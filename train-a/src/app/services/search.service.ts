import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { GeoUtilsService } from './utils/geo-utils.service';
import { Trip } from '../models/trip';

export interface ResponseSearch {
  from: StationRes,
  routes: Array<Route>,
  to: StationRes,
}

export interface StationRes {
  city: string,
  geolocation: {
    latitude: number,
    longitude: number,
  }
  stationId: number,
}

export interface Route {
  carriages: Array<string>,
  id: number,
  path: Array<number>
  schedule: Array<Schedule>,
}

export interface Schedule {
  rideId: number,
  segments: Array<Segment>,
}

export interface Segment {
  occupiedSeats: Array<number>
  price: Price,
  time: Array<string>
}

export type Price = {
  [key: string]: number;
};

export interface Station {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
  connectedTo: { id: number; distance: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly apiUrlSearch = '/api/search';
  private readonly apiUrlStation = '/api/station';

  constructor(private http: HttpClient, private geoUtils: GeoUtilsService) {}

  public searchRoutes(
    fromLatitude: number,
    fromLongitude: number,
    toLatitude: number,
    toLongitude: number,
    time?: string,
  ): Observable<ResponseSearch> {
    let params = new HttpParams()
      .set('fromLatitude', fromLatitude)
      .set('fromLongitude', fromLongitude)
      .set('toLatitude', toLatitude)
      .set('toLongitude', toLongitude);
    if (time) {
      params = params.set('time', time);
    }

    return this.http.get<ResponseSearch>(this.apiUrlSearch, { params })
    .pipe(
      catchError(this.handleError),
    );
  }

  public getStations(): Observable<Station[]> {
    return this.http
      .get<Station[]>(this.apiUrlStation)
      .pipe(
        catchError(this.handleError),
      );
  }

  public findClosestStation(lat: number, lon: number): Observable<Station | null> {
    return this.getStations().pipe(
      map((stations) => this.findNearest(lat, lon, stations)),
      catchError(() => of(null)),
    );
  }

  private findNearest(lat: number, lon: number, stations: Station[]): Station | null {
    let closestStation: Station | null = null;
    let minDistance = Number.MAX_VALUE;

    stations.forEach((station) => {
      const distance = this.geoUtils.haversine(lat, lon, station.latitude, station.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closestStation = station;
      }
    });
    return closestStation;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    }
    if (error.status) {
      errorMessage = `Server-side error: ${error.status}`;
    }
    if (error.status === 400 && error.error) {
      errorMessage = `Error: ${error.error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  public addStation(station: {
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    relations: Array<number> | [];
  }): Observable<Station> {
    return this.http.post<Station>(this.apiUrlStation, station);
  }

  public deleteStation(stationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlStation}/${stationId}`);
  }

  public getRide(rideId: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrlSearch}/${rideId}`)
    .pipe(
      catchError(this.handleError),
    );
  }
}
