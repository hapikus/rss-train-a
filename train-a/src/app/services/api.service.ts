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

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiProfileUrl = '/api/profile';
  private readonly apiLogoutUrl = '/api/logout';
  private readonly apiPasswordUrl = '/api/profile/password';
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
      throw new Error(getErrorMessageByResponseStatus(response.status));
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
}
