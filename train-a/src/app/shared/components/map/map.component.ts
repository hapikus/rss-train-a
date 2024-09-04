import { Component, EventEmitter, Output, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import L from 'leaflet';
import { MarkerService } from '../../../services/marker.service';
import { SearchService, Station } from '../../../services/search.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Output() markerClicked = new EventEmitter<Station>();
  @ViewChild('map') mapElement!: ElementRef;
  private map!: L.Map;

  private readonly mapTitleLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  private readonly mapAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  private stations: Station[] = [];
  private markers: L.Marker[] = [];

  constructor(private markerService: MarkerService, private searchService: SearchService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadStations();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  // private initMap(): void {
  //   if (!this.map) {
  //   this.map = L.map('map').setView([43.068661, 141.350755], 4);
  //   L.tileLayer(this.mapTitleLayer, {
  //     attribution: this.mapAttribution,
  //   }).addTo(this.map);
  // }
  // }

  private initMap(): void {
    const mapContainer = this.mapElement.nativeElement;
    if (mapContainer && !this.map) {
      this.map = L.map(mapContainer).setView([51.505, -0.09], 4);
      L.tileLayer(this.mapTitleLayer, {
            attribution: this.mapAttribution,
          }).addTo(this.map);
    }
  }

  public addMarkersToMap(): void {
    this.map!.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map!.removeLayer(layer);
      }
    });
    this.stations.forEach((station) => {
      this.markerService.addMarkerToMap(this.map!, station, this.handleMarkerClick.bind(this));
    });
  }

  public loadStations() {
    this.searchService.getStations().subscribe((stations) => {
      this.stations = stations;
      this.addMarkersToMap();
    });
  }

  private handleMarkerClick(station: Station) {
    this.markerClicked.emit(station);
  }
}
