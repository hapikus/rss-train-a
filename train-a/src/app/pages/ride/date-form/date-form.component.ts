import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  Input,
  OnChanges,
  OnInit,
  Signal,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { RideService } from '../../../services/ride.service';
import { Schedule, Segment } from '../../../services/api.service';

@Component({
  selector: 'app-date-form',
  standalone: true,
  imports: [
    DatePipe,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzDatePickerModule,
    NzTimePickerModule,
  ],
  templateUrl: './date-form.component.html',
  styleUrl: './date-form.component.scss',
})
export class DateFormComponent implements OnInit, OnChanges {
  @Input() value: string = '';
  @Input() label: string = '';
  @Input() dateControl: string = 'date';
  @Input() timeControl: string = 'time';
  @Input() code = {
    id: 0,
    rideId: 0,
    segment: 0,
  };
  public form!: FormGroup;
  public enableInput() {
    this.form.controls[this.dateControl].enable();
    this.form.controls[this.timeControl].enable();
  }

  private disableInput() {
    this.form.controls[this.dateControl].disable();
    this.form.controls[this.timeControl].disable();
  }

  public segments: Signal<Segment[] | null> = computed(
    () =>
      this.rideService.ride().schedule.find((s) => s.rideId === this.code.rideId)?.segments || null,
  );

  constructor(
    private fb: NonNullableFormBuilder,
    private rideService: RideService,
  ) {}

  public async submit(): Promise<void> {
    if (this.form.valid) {
      const datePart = this.form.value[this.dateControl].toISOString().split('T')[0];
      const timePart = this.form.value[this.timeControl].toISOString().split('T')[1];
      const combinedDateTime = new Date(`${datePart}T${timePart}`).toISOString();
      const s = this.segments();
      if (s && s[this.code.segment].time[this.label === 'Arrival' ? 0 : 1] !== combinedDateTime) {
        s[this.code.segment].time[this.label === 'Arrival' ? 0 : 1] = combinedDateTime;
        const r = await this.rideService.updateRide(this.code.id, this.code.rideId, s);
        if (r) this.disableInput();
      }
    }
  }

  public ngOnInit(): void {
    this.form = this.fb.group({
      [this.dateControl]: [
        { value: this.getDate(this.value), disabled: true },
        [Validators.required],
      ],
      [this.timeControl]: [
        { value: this.getDate(this.value), disabled: true },
        [Validators.required],
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !changes['value'].isFirstChange()) {
      this.updateForm(changes['value'].currentValue);
    }
  }

  public getDate(s: string): Date {
    return new Date(s || 0);
  }

  private updateForm(value: string): void {
    this.form.patchValue({
      [this.dateControl]: this.getDate(value),
      [this.timeControl]: this.getDate(value),
    });
  }
}
