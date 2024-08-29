import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ResponseSearch, Route, Schedule } from '../../../services/search.service';

@Component({
  selector: 'app-route-tabs',
  standalone: true,
  imports: [
    CommonModule,
    NzTabsModule,
    NzCardModule,
    NzStepsModule,
  ],
  templateUrl: './route-tabs.component.html',
  styleUrl: './route-tabs.component.scss',
})
export class RouteTabsComponent implements OnChanges {
  @Input() response: ResponseSearch | undefined;
  groupTabs: GroupTabs[] = [];

  constructor(private datePipe: DatePipe) {}

  ngOnChanges(): void {
    if (this.response) {
      this.getRoute(this.response);
    }
  }

  private calculateDuration(timeStarted: Date, timeArrived: Date): string {
    const durationInMilliseconds = timeArrived.getTime() - timeStarted.getTime();
    const days = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((durationInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  }

  getCarriageKeys(carriages: { [key: string]: number }): string[] {
    return Object.keys(carriages);
  }

  getRoute(response: ResponseSearch): GroupTabs[] {
    const { stationId: stationIdFrom, city: cityFrom } = response.from;
    const { stationId: stationIdTo, city: cityTo } = response.to;
    const groupRoutes: { date: string; routes:TabRoutes[] }[] = [];

    response.routes.forEach((route: Route, routeIndex: number) => {
      const { path, id, schedule } = route;
      const [startStationId, endStationId] = [path[0], path[path.length - 1]];
      const indexFrom = path.indexOf(stationIdFrom);
      const indexTo = path.indexOf(stationIdTo);

      if (schedule && schedule.length > 0) {
        schedule.forEach((scheduleItem: Schedule) => {
          const { segments, rideId } = scheduleItem;
          const segmentFrom = segments[indexFrom];
          const segmentTo = segments[indexTo];

          if (segmentFrom && segmentTo) {
            const [timeStarted] = segmentFrom.time;
            const [timeArrived] = segmentTo.time;
            const formatDateStarted = this.datePipe.transform(new Date(timeStarted), 'EEE, MMMM dd');
            const fromatDateArrived = this.datePipe.transform(new Date(timeArrived), 'EEE, MMMM dd');
            const time1 = new Date(timeStarted);
            const time2 = new Date(timeArrived);
            const duration = this.calculateDuration(time1, time2);

            if (formatDateStarted && fromatDateArrived) {
              let dateGroup = groupRoutes.find((group) => group.date === formatDateStarted);

              if (!dateGroup) {
                dateGroup = { date: formatDateStarted, routes: [] };
                groupRoutes.push(dateGroup);
              }

              const carriages = segmentFrom.price;

              dateGroup.routes.push({
                rideId,
                routeIndex,
                id,
                indexFrom,
                route,
                carriages,
                timeStarted,
                timeArrived,
                departureTime: formatDateStarted,
                arrivedTime: fromatDateArrived,
                stationIdFrom,
                cityFrom,
                cityTo,
                startStationId,
                endStationId,
                duration,
              });
            }
          }
        });
      }
    });

    this.groupTabs = groupRoutes;
    return groupRoutes;
}
}

export interface TabRoutes {
  rideId: number,
  routeIndex: number,
  id: number,
  indexFrom: number,
  route: Route,
  carriages: { [key: string]: number };
  timeStarted: string,
  timeArrived: string,
  departureTime: string,
  arrivedTime: string,
  stationIdFrom: number,
  cityFrom: string,
  stationIdTo?: number,
  cityTo?: string,
  startStationId: number,
  endStationId: number,
  duration: string,
}

export interface GroupTabs {
  date: string,
  routes: TabRoutes[],
}
