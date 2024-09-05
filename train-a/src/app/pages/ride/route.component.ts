import { Component, computed, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Price, Schedule, Segment } from '../../services/api.service';
import { RideComponent } from './ride/ride.component';
import { RideService } from '../../services/ride.service';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    NzButtonModule,
    NzTypographyModule,
    NzModalModule,
    NzIconModule,
    RouterLink,
    NzDividerModule,
    RideComponent,
    NzEmptyModule,
    NzSpinModule,
  ],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss',
})
export class RouteComponent {
  public id: number = 0;
  public routeName = '';

  public newRideId: number = 0;

  public paths: Signal<number[] | null> = computed(() => this.rideService.ride().path || null);

  public schedules: Signal<Schedule[]> = computed(() => this.rideService.ride().schedule);

  public carriages: Signal<string[]> = computed(() => this.rideService.ride().carriages);

  constructor(
    private readonly router: Router,
    private route: ActivatedRoute,
    public rideService: RideService,
  ) {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));
    });
    if (this.id) {
      this.routeName = `Route ${this.id}`;
      this.rideService.getRide(this.id);
    }
  }

  public isEnd(i: number): boolean {
    const l = this.paths()?.length ?? 0;
    return l === i + 1;
  }

  public generateSegments(): Segment[] {
    const carriages = [...new Set(this.carriages())];
    const price: Price = carriages.reduce((a, k) => {
      a[k] = 100;
      return a;
    }, {} as Price);
    const segments: Segment[] = [];
    const startDate = new Date();
    for (let i = 1; i < (this.paths()?.length ?? 0); i += 1) {
      const start = new Date(new Date().setHours(startDate.getHours() + 2 * i));
      const stop = new Date(new Date().setHours(startDate.getHours() + 2 * i + 1));
      const time: [string, string] = [start.toISOString(), stop.toISOString()];
      const segment: Segment = {
        time,
        price,
      };
      segments.push(segment);
    }
    return segments;
  }

  public async create(): Promise<void> {
    const segments = this.generateSegments();
    const id = await this.rideService.createRide(this.id, segments);
    this.newRideId = id.id;
    await this.rideService.getRide(this.id);
    this.rideService.mode = 'create';
  }

  public async delete(): Promise<void> {
    const r = await this.rideService.deleteRide(this.id, this.newRideId);
    this.rideService.mode = 'edit';
    if (r) {
      this.rideService.getRide(this.id);
    }
  }

  public back(): void {
    this.rideService.mode = 'edit';
  }
}
