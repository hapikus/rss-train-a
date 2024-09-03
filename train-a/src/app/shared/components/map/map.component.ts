import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import L, { Map } from 'leaflet';
import { MarkerService } from '../../../services/marker.service';
import { SearchService, Station } from '../../../services/search.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  @Output() markerClicked = new EventEmitter<Station>();

  private readonly mapTitleLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  private readonly mapAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  private map!: Map;
  private stations: Station[] = [];

  constructor(private markerService: MarkerService, private searchService: SearchService) {}

  ngOnInit() {
    this.initMap();
    this.loadStations();
  }

  private initMap(): void {
    this.map = L.map('map').setView([43.068661, 141.350755], 4);
    L.tileLayer(this.mapTitleLayer, {
      attribution: this.mapAttribution,
    }).addTo(this.map);
  }

  private addMarkersToMap(): void {
    this.stations.forEach((station) => {
      this.markerService.addMarkerToMap(this.map, station, this.handleMarkerClick.bind(this));
    });
  }

  private loadStations() {
    this.searchService.getStations().subscribe((stations) => {
      this.stations = stations;
      this.addMarkersToMap();
    });
  }

  private handleMarkerClick(station: Station) {
    this.markerClicked.emit(station);
  }
}
