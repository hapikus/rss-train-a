import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/signin';

  public login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
      }),
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
