import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Carriage } from '../../types/interfaces';

@Component({
  selector: 'app-carriage-prototype',
  standalone: true,
  imports: [],
  templateUrl: './carriage-prototype.component.html',
  styleUrl: './carriage-prototype.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagePrototypeComponent {
  @Input() carriage!: Carriage;

  public getSeatNumber(rowIndex: number, seatIndex: number): number {
    const seatsPerRow = this.carriage.leftSeats + this.carriage.rightSeats;
    return rowIndex * seatsPerRow + seatIndex + 1;
  }

  get rowsArray(): number[] {
    return Array.from({ length: this.carriage.rows }, (_, i) => i);
  }

  get leftSeatsArray(): number[] {
    return Array.from({ length: this.carriage.leftSeats }, (_, i) => i);
  }

  get rightSeatsArray(): number[] {
    return Array.from({ length: this.carriage.rightSeats }, (_, i) => i);
  }
}
