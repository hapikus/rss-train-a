/* eslint-disable no-console */
import { Injectable, signal } from '@angular/core';
import getErrorMessageByResponseStatus from '../shared/utilities/getErrorMessageByResponseStatus';

export type Profile = {
  name: string;
  email: string;
  role: string;
};

const nullUser: Profile = {
  name: '',
  email: '',
  role: '',
};

export interface RouteRequest {
  carriages: string[];
  path: number[];
}

export interface RouteResponse extends RouteRequest {
  id: number;
}

export interface StationResponse {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
  connectedTo: { id: number; distance: number }[];
}

export interface CarriageResponse {
  code: string;
  name: string;
  rows: number;
  leftSeats: number;
  rightSeats: number;
}

export interface Price {
  [key: string]: number;
}

export interface Segment {
  time: [string, string];
  price: Price;
}

export interface Schedule {
  rideId: number;
  segments: Segment[];
}

export interface Ride {
  id: number;
  path: number[];
  carriages: string[];
  schedule: Schedule[];
}

export const nullRide: Ride = {
  id: NaN,
  path: [],
  carriages: [],
  schedule: [],
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiProfileUrl = '/api/profile';
  private readonly apiLogoutUrl = '/api/logout';
  private readonly apiPasswordUrl = '/api/profile/password';
  private readonly apiRoutesUrl = '/api/route';
  private readonly apiStationsUrl = '/api/station';
  private readonly apiCarriagesUrl = '/api/carriage';
  private readonly TOKEN_KEY = 'token';
  public profile = signal(nullUser);
  public name = signal('');
  public email = signal('');
  private password = '';

  public async fetchProfile(): Promise<Profile> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return nullUser;
    try {
      const response = await fetch(this.apiProfileUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const profile: Profile = await response.json();
        return profile;
      }
      throw new Error(getErrorMessageByResponseStatus(response.status));
    } catch (error) {
      console.error('fetch profile', error);
      return nullUser;
    }
  }

  public async updateProfile(profile: Profile): Promise<Profile> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return nullUser;
    try {
      const response = await fetch(this.apiProfileUrl, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        const updatedProfile: Profile = await response.json();
        return updatedProfile;
      }
      throw new Error(getErrorMessageByResponseStatus(response.status));
    } catch (error) {
      console.error('update profile', error);
      return nullUser;
    }
  }

  public async logout(): Promise<boolean> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    try {
      const response = await fetch(this.apiLogoutUrl, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        return true;
      }
      throw new Error(getErrorMessageByResponseStatus(response.status));
    } catch (error) {
      console.error('logout', error);
      return false;
    }
  }

  public async updatePassword(newPassword: string | null): Promise<boolean> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    try {
      const response = await fetch(this.apiPasswordUrl, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: newPassword }),
      });
      if (response.ok) {
        return true;
      }
      throw new Error(getErrorMessageByResponseStatus(response.status));
    } catch (error) {
      console.error('update password', error);
      return false;
    }
  }

  public async fetchStations(): Promise<StationResponse[]> {
    try {
      const response = await fetch(this.apiStationsUrl, {
        method: 'GET',
      });
      if (response.ok) {
        const stations: StationResponse[] = await response.json();
        return stations;
      }
      throw new Error(response.status.toString());
    } catch (error) {
      console.error('fetch stations', error);
      return [];
    }
  }

  public async fetchCarriages(): Promise<CarriageResponse[]> {
    try {
      const response = await fetch(this.apiCarriagesUrl, {
        method: 'GET',
      });
      if (response.ok) {
        const carriages: CarriageResponse[] = await response.json();
        return carriages;
      }
      throw new Error(response.status.toString());
    } catch (error) {
      console.error('fetch carriages', error);
      return [];
    }
  }

  public async fetchRoutes(): Promise<RouteResponse[]> {
    try {
      const response = await fetch(this.apiRoutesUrl, {
        method: 'GET',
      });
      if (response.ok) {
        const routes: RouteResponse[] = await response.json();
        return routes;
      }
      throw new Error(response.status.toString());
    } catch (error) {
      console.error('fetch routes', error);
      return [];
    }
  }

  public async deleteRoute(id: number): Promise<boolean> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    try {
      const response = await fetch(`${this.apiRoutesUrl}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        return true;
      }
      throw new Error(getErrorMessageByResponseStatus(response.status));
    } catch (error) {
      console.error('delete route', error);
      return false;
    }
  }

  public async createRoute(newRoute: RouteRequest): Promise<boolean> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    try {
      const response = await fetch(this.apiRoutesUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(newRoute),
      });
      if (response.ok) {
        return true;
      }
      throw new Error(getErrorMessageByResponseStatus(response.status));
    } catch (error) {
      console.error('update password', error);
      return false;
    }
  }

  public async updateRoute(newRoute: RouteResponse): Promise<boolean> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    try {
      const response = await fetch(`${this.apiRoutesUrl}/${newRoute.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ path: newRoute.path, carriages: newRoute.carriages }),
      });
      if (response.ok) {
        return true;
      }
      throw new Error(getErrorMessageByResponseStatus(response.status));
    } catch (error) {
      console.error('update password', error);
      return false;
    }
  }

  public async fetchRide(id: number): Promise<Ride> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return nullRide;
    try {
      const response = await fetch(`${this.apiRoutesUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const ride: Ride = await response.json();
        return ride;
      }
      throw new Error(getErrorMessageByResponseStatus(response.status));
    } catch (error) {
      console.error('fetch ride', error);
      return nullRide;
    }
  }

  public async createRide(routeId: number, segments: Segment[]): Promise<{ id: number }> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return { id: 0 };
    try {
      const response = await fetch(`${this.apiRoutesUrl}/${routeId}/ride`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ segments }),
      });
      if (response.ok) {
        const rideId: { id: number } = await response.json();
        return rideId;
      }
      throw new Error(getErrorMessageByResponseStatus(response.status));
    } catch (error) {
      console.error('create ride', error);
      return { id: 0 };
    }
  }

  public async updateRide(routeId: number, rideId: number, segments: Segment[]): Promise<boolean> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    try {
      const response = await fetch(`${this.apiRoutesUrl}/${routeId}/ride/${rideId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ segments }),
      });
      if (response.ok) {
        return true;
      }
      throw new Error(getErrorMessageByResponseStatus(response.status));
    } catch (error) {
      console.error('update ride', error);
      return false;
    }
  }

  public async deleteRide(routeId: number, rideId: number): Promise<boolean> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    try {
      const response = await fetch(`${this.apiRoutesUrl}/${routeId}/ride/${rideId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        return true;
      }
      throw new Error(getErrorMessageByResponseStatus(response.status));
    } catch (error) {
      console.error('delete ride', error);
      return false;
    }
  }
}
