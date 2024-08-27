import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from './api.service';

export interface Route {
  carriages: string[];
  cities: string[];
  id: number;
}

export const nullRoute: Route = {
  carriages: [''],
  cities: [''],
  id: NaN,
};

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  public routes: WritableSignal<Route[]> = signal([]);
  constructor(private readonly apiService: ApiService) {
    this.getRoutes();
  }

  async getRoutes() {
    const routesResponsed = await this.apiService.fetchRoutes();
    const stations = await this.apiService.fetchStations();
    const routes = routesResponsed.map((r) => ({
      id: r.id,
      carriages: r.carriages,
      cities: stations.filter((s) => r.path.includes(s.id)).map((s) => s.city),
    }));
    this.routes.set(routes);
  }

  async deleteRoute(id: number) {
    const deleteResult = await this.apiService.deleteRoute(id);
    if (deleteResult) {
      const routes = this.routes().filter((r) => r.id !== id);
      this.routes.set(routes);
    }
    return deleteResult;
  }
}
