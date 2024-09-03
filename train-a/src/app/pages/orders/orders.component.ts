import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrderListComponent } from '../../components/order-list/order-list.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [OrderListComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {}
