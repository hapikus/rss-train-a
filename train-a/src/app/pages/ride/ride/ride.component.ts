import { Component, computed, Input, Signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { RideService } from '../../../services/ride.service';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-ride',
  standalone: true,
  imports: [
    NzButtonModule,
    NzTypographyModule,
    NzModalModule,
    NzIconModule,
    NzDividerModule,
    ItemComponent,
    NzPopconfirmModule,
  ],
  templateUrl: './ride.component.html',
  styleUrl: './ride.component.scss',
})
export class RideComponent {
  @Input() id: number = 0;
  @Input() rideId: number = 0;
  public routeId: number | null = null;
  public routeName = '';

  public paths: Signal<number[] | null> = computed(() => this.rideService.ride().path || null);

  constructor(public rideService: RideService) {
  }

  public isEnd(i: number): boolean {
    const l = this.paths()?.length ?? 0;
    return l === i + 1;
  }

  public delete(): void {
    this.rideService.deleteRide(this.id, this.rideId);
  }
}
