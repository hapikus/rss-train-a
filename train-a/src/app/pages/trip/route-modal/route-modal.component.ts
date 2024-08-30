import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Trip } from '../../../models/trip';
import { Station } from '../../../models/station';
import { findStation } from '../../../shared/utilities/find-station';
import { StationService } from '../../../services/station.service';

interface ModalData {
  times: string[];
  stationName: string;
  duration: number;
}

@Component({
  selector: 'app-route-modal',
  standalone: true,
  imports: [NzTimelineModule, NzModalModule, CommonModule],
  templateUrl: './route-modal.component.html',
  styleUrl: './route-modal.component.scss',
})
export class RouteModalComponent implements OnInit {
  @Input() public trip: Trip = {} as Trip;
  @Input() public showModal: boolean = false;
  @Output() toggleShowModal = new EventEmitter<boolean>();
  public stations: Station[] = [];

  public modalData: ModalData[] = [];

  constructor(
    private stationService: StationService,
  ) {}

  public closeModal(): void {
    this.toggleShowModal.emit();
  }

  private getDuration(end: string, start: string) {
    const endDateToNumber = new Date(end).getTime();
    const startDateToNumber = new Date(start).getTime();
    return endDateToNumber - startDateToNumber;
  }

  public ngOnInit() {
    this.stationService.getStations().pipe(
      take(1),
    ).subscribe((stations) => {
      this.stations = stations;

      for (let index = 0; index < this.trip.path.length; index += 1) {
        const station = this.trip.path[index];
        if (index === 0) {
          this.modalData.push({
            times: [this.trip.schedule?.segments?.[index]?.time?.[0]],
            stationName: findStation(station, this.stations)?.city ?? '',
            duration: 0,
          });
        }
        if (index === this.trip.path.length - 1) {
          this.modalData.push({
            times: [this.trip.schedule?.segments?.[index - 1]?.time?.[1]],
            stationName: findStation(station, this.stations)?.city ?? '',
            duration: 100,
          });
        }
        if (index !== 0 && index !== this.trip.path.length - 1) {
          this.modalData.push({
            times: [
              this.trip.schedule?.segments?.[index - 1]?.time?.[1],
              this.trip.schedule?.segments?.[index]?.time?.[0],
            ],
            stationName: findStation(station, this.stations)?.city ?? '',
            duration: this.getDuration(
              this.trip.schedule?.segments?.[index - 1]?.time?.[1],
              this.trip.schedule?.segments?.[index - 1]?.time?.[0],
            ),
          });
        }
      }
    });
  }
}
