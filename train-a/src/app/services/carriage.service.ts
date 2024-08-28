import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Carriage } from '../types/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CarriageService {
  private apiUrl = '/api/carriage';

  constructor(private http: HttpClient) {}

  getCarriages(): Observable<Carriage[]> {
    return this.http.get<Carriage[]>(this.apiUrl);
  }

  createCarriage(carriage: Carriage): Observable<Carriage> {
    return this.http.post<Carriage>(this.apiUrl, carriage);
  }

  updateCarriage(code: string, carriage: Carriage): Observable<Carriage> {
    return this.http.put<Carriage>(`${this.apiUrl}/${code}`, carriage);
  }
}
