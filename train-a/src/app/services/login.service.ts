import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly apiUrl = '/api/signin';
  private readonly TOKEN_KEY = 'token';
  public isManager = false;

  public login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        this.updateRole();
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessage(error);

        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  public async logout() {
    const logoutResult = await this.apiService.logout();
    if (logoutResult) {
      localStorage.removeItem(this.TOKEN_KEY);
      this.router.navigate(['/']);
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 400 && error.error?.reason) {
      switch (error.error.reason) {
        case 'invalidFields':
          return 'Fields are empty';
        case 'invalidEmail':
          return 'Email is wrong';
        case 'userNotFound':
          return 'Incorrect email or password';
        case 'alreadyLoggedIn':
          return 'Authorization error';
        default:
          return 'Incorrect email or password';
      }
    }
    return 'An unknown error occurred!';
  }

  public async updateRole() {
    const profile = await this.apiService.fetchProfile();
    this.isManager = profile.role === 'manager';
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
