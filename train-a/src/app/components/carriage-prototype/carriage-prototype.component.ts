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
}
