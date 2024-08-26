import { Injectable } from '@angular/core';
import L, { Marker, Icon, Map } from 'leaflet';
import { Station } from './search.service';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  private markers: { [city: string]: Marker } = {};
  private selectedFromMarker: Marker | null = null;
  private selectedToMarker: Marker | null = null;

  defaultIcon = new Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  });

  selectedIcon = new Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  });

  public addMarkerToMap(
    map: Map,
    station: Station,
    clickHandler: (station: Station, marker: Marker) => void,
  ): Marker {
    const newMarker = L.marker([station.latitude, station.longitude], { icon: this.defaultIcon })
      .bindPopup(`<b>${station.city}</b><br>ID: ${station.id}`)
      .addTo(map);

    newMarker.on('click', () => clickHandler(station, newMarker));

    this.markers[station.city] = newMarker;

    return newMarker;
  }

  public toggleMarker(
    station: Station,
    fromCoords: Coords,
    toCoords: Coords,
    setFormValue: (field: string, value: string | Coords) => void,
  ) {
    const marker = this.markers[station.city];
    if (marker) {
      if (fromCoords && this.isMarkerSelected(station, fromCoords)) {
        this.resetMarker('from', setFormValue);
      } else if (toCoords && this.isMarkerSelected(station, toCoords)) {
        this.resetMarker('to', setFormValue);
      } else {
        this.setMarker(station, marker, setFormValue);
      }
    }
  }

  private isMarkerSelected(station: Station, coords: Coords): boolean {
    return coords && coords.lat === station.latitude && coords.lon === station.longitude;
  }

  public selectMarkerByCity(
    city: string,
    type: 'from' | 'to',
    setFormValue: (field: string, value: string | Coords) => void,
  ) {
    const marker = this.markers[city];
    if (marker) {
      if (type === 'from') {
        if (this.selectedFromMarker) {
          this.selectedFromMarker.setIcon(this.defaultIcon);
        }
        this.selectedFromMarker = marker;
        setFormValue('fromCoords', { lat: marker.getLatLng().lat, lon: marker.getLatLng().lng });
      } else if (type === 'to') {
        if (this.selectedToMarker) {
          this.selectedToMarker.setIcon(this.defaultIcon);
        }
        this.selectedToMarker = marker;
        setFormValue('toCoords', { lat: marker.getLatLng().lat, lon: marker.getLatLng().lng });
      }
      marker.setIcon(this.selectedIcon);
    }
  }

  private setMarker(
    station: Station,
    clickedMarker: Marker,
    setFormValue: (field: string, value: string | Coords) => void,
  ) {
    if (!this.selectedFromMarker) {
      this.resetMarker('from', setFormValue);
      setFormValue('from', station.city);
      setFormValue('fromCoords', { lat: station.latitude, lon: station.longitude });
      clickedMarker.setIcon(this.selectedIcon);
      this.selectedFromMarker = clickedMarker;
    } else if (!this.selectedToMarker) {
      this.resetMarker('to', setFormValue);
      setFormValue('to', station.city);
      setFormValue('toCoords', { lat: station.latitude, lon: station.longitude });
      clickedMarker.setIcon(this.selectedIcon);
      this.selectedToMarker = clickedMarker;
    }
  }

  private resetMarker(type: 'from' | 'to', setFormValue: (field: string, value: string | Coords) => void) {
    if (type === 'from' && this.selectedFromMarker) {
      this.selectedFromMarker.setIcon(this.defaultIcon);
      this.selectedFromMarker = null;
      setFormValue('from', '');
      setFormValue('fromCoords', '');
    }
    if (type === 'to' && this.selectedToMarker) {
      this.selectedToMarker.setIcon(this.defaultIcon);
      this.selectedToMarker = null;
      setFormValue('to', '');
      setFormValue('toCoords', '');
    }
  }
}

export interface Coords {
  lat: number;
  lon: number;
}
