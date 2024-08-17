import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = '/api/signin';
  private readonly TOKEN_KEY = 'token';

  public login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
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

  // public userCanActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   console.log('login route', route);
  //   console.log('login state', state);

  //   if (this.isUserLoggedIn()) {
  //     return true;
  //   }

  //   this.router.navigate([this.getLoginUrl()]);
  //   return false;
  // }

  // private isUserLoggedIn() {
  //   // return !!localStorage.getItem(this.TOKEN_KEY);
  //   return true;
  // }

  // private getLoginUrl() {
  //   return '/signin';
  // }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
