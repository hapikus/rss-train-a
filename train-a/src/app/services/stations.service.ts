import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private apiUrl = '/api/station';

  constructor(private http: HttpClient) {}

  getStations(): Observable<Station[]> {
    return this.http
      .get<Station[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError),
      );
  }

  findClosestStation(lat: number, lon: number): Observable<Station | null> {
    return this.getStations().pipe(
      map((stations) => this.findNearest(lat, lon, stations)),
      catchError(() => of(null)),
    );
  }

  private findNearest(lat: number, lon: number, stations: Station[]): Station | null {
    let closestStation: Station | null = null;
    let minDistance = Number.MAX_VALUE;

    stations.forEach((station) => {
      const distance = this.haversine(lat, lon, station.latitude, station.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closestStation = station;
      }
    });

    return closestStation;
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
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
}

export interface Station {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
  connectedTo: { id: number; distance: number }[];
}
