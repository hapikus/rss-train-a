import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

interface SearchResponse {}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly apiUrl = '/api/search';

  constructor(private http: HttpClient) {}

  searchRoutes(
    fromLatitude: number,
    fromLongitude: number,
    toLatitude: number,
    toLongitude: number,
    time?: number,
  ): Observable<SearchResponse> {
    let params = new HttpParams()
      .set('fromLatitude', fromLatitude)
      .set('fromLongitude', fromLongitude)
      .set('toLatitude', toLatitude)
      .set('toLongitude', toLongitude);

    if (time) {
      params = params.set('time', time);
    }

    return this.http.get(this.apiUrl, { params })
    .pipe(
      catchError(this.handleError),
    );
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
