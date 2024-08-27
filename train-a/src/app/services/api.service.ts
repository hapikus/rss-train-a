import { Injectable, signal } from '@angular/core';

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

export interface RouteResponse {
  id: number;
  carriages: string[];
  path: number[];
}

export interface StationResponse {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
  connectedTo: { id: number; distance: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiProfileUrl = '/api/profile';
  private readonly apiLogoutUrl = '/api/logout';
  private readonly apiPasswordUrl = '/api/profile/password';
  private readonly apiRoutesUrl = '/api/route';
  private readonly apiStationsUrl = '/api/station';
  private readonly TOKEN_KEY = 'token';
  public profile = signal(nullUser);
  public name = signal('');
  public email = signal('');
  private password = '';

  public async fetchProfile() {
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
      if (response.status === 401) {
        throw new Error('401, Wrong token identifier');
      } else {
        throw new Error(response.status.toString());
      }
    } catch (error) {
      console.error('fetch profile', error);
      return nullUser;
    }
  }

  public async updateProfile(profile: Profile) {
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
      if (response.status === 401) {
        throw new Error('401, Wrong token identifier');
      } else {
        throw new Error(response.status.toString());
      }
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
      if (response.status === 401) {
        throw new Error('401, Wrong token identifier');
      } else {
        throw new Error(response.status.toString());
      }
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
      if (response.status === 401) {
        throw new Error('401, Wrong token identifier');
      } else if (response.status === 400) {
        throw new Error('400, Invalid password');
      } else {
        throw new Error(response.status.toString());
      }
    } catch (error) {
      console.error('update password', error);
      return false;
    }
  }

  public async fetchStations() {
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
      console.error('fetch routes', error);
      return [];
    }
  }

  public async fetchRoutes() {
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

  public async deleteRoute(id: number) {
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
      if (response.status === 401) {
        throw new Error('401, Wrong token identifier');
      } else {
        throw new Error(response.status.toString());
      }
    } catch (error) {
      console.error('delete route', error);
      return false;
    }
  }
}
