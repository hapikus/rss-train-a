import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService, RouteRequest, RouteResponse } from './api.service';

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
  public mode: 'update' | 'create' | 'view' = 'view';
  public updatingRoute: Route = nullRoute;

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

  async createRoute(newRoute: RouteRequest) {
    const result = await this.apiService.createRoute(newRoute);
    if (result) this.getRoutes();
  }

  async updateRoute(newRoute: RouteResponse) {
    const result = await this.apiService.updateRoute(newRoute);
    if (result) this.getRoutes();
  }
}
