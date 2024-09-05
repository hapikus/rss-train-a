import { Component, computed, Input, Signal } from '@angular/core';
import { PriceFormComponent } from '../price-form/price-form.component';
import { DateFormComponent } from '../date-form/date-form.component';
import { RideService } from '../../../services/ride.service';
import { Schedule } from '../../../services/api.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [PriceFormComponent, DateFormComponent],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent {
  @Input() id: number = 0;
  @Input() rideId: number = 0;
  @Input() segment: number = 0;
  @Input() departure = false;
  @Input() arrival = false;
  @Input() isEnd = false;

  public schedule: Signal<Schedule | null> = computed(
    () => this.rideService.ride().schedule.find((s) => s.rideId === this.rideId) || null,
  );

  public arrivalDate: Signal<string> = computed(() => this.schedule()?.segments[this.segment].time[0] || '');
  public departureDate: Signal<string> = computed(
    () => this.schedule()?.segments[this.segment].time[1] || '',
  );
  getDate(s: string) {
    return new Date(s || 0);
  }
  public prices: Signal<[string, number][]> = computed(
    () => Object.entries(this.schedule()?.segments[this.segment].price || {}),
    // eslint-disable-next-line function-paren-newline
  );

  constructor(readonly rideService: RideService) {}
}
