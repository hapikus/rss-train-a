import { Component, computed, Input, OnInit, Signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { RideService } from '../../../services/ride.service';
import { Segment } from '../../../services/api.service';

@Component({
  selector: 'app-price-form',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, NzFormModule, ReactiveFormsModule, NzInputNumberModule],
  templateUrl: './price-form.component.html',
  styleUrl: './price-form.component.scss',
})
export class PriceFormComponent implements OnInit {
  @Input() value: number = 0;
  @Input() label: string = '';
  @Input() controlName: string = 'price';
  @Input() code = {
    id: 0,
    rideId: 0,
    segment: 0,
  };

  public segments: Signal<Segment[] | null> = computed(
    () =>
      this.rideService.ride().schedule.find((s) => s.rideId === this.code.rideId)?.segments || null,
  );

  constructor(
    private readonly rideService: RideService,
    private fb: NonNullableFormBuilder,
  ) {}

  public form!: FormGroup;

  public enableInput(): void {
    this.form.controls[this.controlName].enable();
  }

  private disableInput(): void {
    this.form.controls[this.controlName].disable();
  }

  public async submit(): Promise<void> {
    if (this.form.valid) {
      const v: number = this.form.value[this.controlName];
      const s = this.segments();
      if (s && s[this.code.segment].price[this.label] !== v) {
        s[this.code.segment].price[this.label] = v;
        const r = await this.rideService.updateRide(this.code.id, this.code.rideId, s);
        if (r) this.disableInput();
      }
    }
  }

  public ngOnInit(): void {
    this.form = this.fb.group({
      [this.controlName]: [{ value: this.value, disabled: true }, [Validators.required]],
    });
  }

  public formatterDollar = (value: number): string => `$ ${value}`;
  public parserDollar = (value: string): string => value.replace('$ ', '');
}
