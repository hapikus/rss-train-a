import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService, nullRide, Ride, Segment, StationResponse } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  private stations: StationResponse[] = [];
  public ride: WritableSignal<Ride> = signal(nullRide);
  public mode: 'edit' | 'create' = 'edit';

  constructor(private readonly apiService: ApiService) {
    this.getStations();
  }

  private async getStations(): Promise<void> {
    const stations = await this.apiService.fetchStations();
    this.stations = stations;
  }

  public getStationNameById(id: number): string {
    return this.stations.find((v) => v.id === id)?.city || '';
  }

  public async getRide(id: number): Promise<void> {
    const ride = await this.apiService.fetchRide(id);
    this.ride.set(ride);
  }

  public async updateRide(id: number, rideId: number, segments: Segment[]): Promise<boolean> {
    const result = await this.apiService.updateRide(id, rideId, segments);
    return result;
  }

  public async deleteRide(id: number, rideId: number): Promise<boolean> {
    const result = await this.apiService.deleteRide(id, rideId);
    if (result) {
      this.getRide(id);
    }
    return result;
  }

  public async createRide(id: number, segments: Segment[]): Promise<{ id: number }> {
    const rideId = await this.apiService.createRide(id, segments);
    return rideId;
  }
}
