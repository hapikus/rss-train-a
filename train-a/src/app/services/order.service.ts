import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../types/interfaces';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  public getOrders(all: boolean = false): Observable<Order[]> {
    // const params = all ? { all: 'true' } : {};
    console.log(all);
    return this.http.get<Order[]>('/api/order', {});
  }

  public cancelOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`/api/order/${orderId}`);
  }
}
