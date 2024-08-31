import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Carriage } from '../types/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CarriageService {
  private apiUrl = '/api/carriage';
  private carriageSubject = new BehaviorSubject<Carriage[]>([]);
  public carriages$ = this.carriageSubject.asObservable();

  constructor(private http: HttpClient) {}

  public getCarriages(): Observable<Carriage[]> {
    return this.http.get<Carriage[]>(this.apiUrl);
  }

  public createCarriage(carriage: Carriage): Observable<Carriage> {
    return this.http.post<Carriage>(this.apiUrl, carriage);
  }

  public updateCarriage(code: string, carriage: Carriage): Observable<Carriage> {
    return this.http.put<Carriage>(`${this.apiUrl}/${code}`, carriage);
  }

  public setCarriages(carriages: Carriage[]): void {
    this.carriageSubject.next(carriages);
  }
}
