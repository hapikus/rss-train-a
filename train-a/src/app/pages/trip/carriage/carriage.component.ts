import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Carriage } from '../../../types/interfaces';

@Component({
  selector: 'app-carriage',
  standalone: true,
  imports: [CommonModule, NzTagModule],
  templateUrl: './carriage.component.html',
  styleUrl: './carriage.component.scss'
})
export class CarriageComponent {
  @Input() public carriage!: Carriage;
  @Input() public startNumber!: number;

  public getTotalSeats(carriage: Carriage): number {
    return carriage.rows * (carriage.leftSeats + carriage.rightSeats);
  }

  public getSeatNumber(rowIndex: number, seatIndex: number, side: string): number {
    const columnStart = this.startNumber + (+this.carriage.leftSeats + +this.carriage.rightSeats) * (rowIndex);

    if (side === 'left') {
      return columnStart + seatIndex + 1
    }
    return columnStart + +this.carriage.leftSeats + seatIndex + 1;
  }

  public isSeatReserved(rowIndex: number, seatIndex: number, side: string): boolean {
    return false;
  }
}
