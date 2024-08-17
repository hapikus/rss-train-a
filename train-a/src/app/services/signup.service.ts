import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface SignupResponse {}

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private readonly apiUrl = '/api/signup';

  constructor(private http: HttpClient) { }

  public signUp(email: string, password: string): Observable<SignupResponse> {
    const body = { email, password };

    return this.http.post<SignupResponse>(this.apiUrl, body)
      .pipe(
        catchError(this.handleError),
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          if (error.error) {
            errorMessage = `Error: ${error.error.message}`;
          }
          break;
        default:
          errorMessage = `Server-side error: ${error.status}`;
          break;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
