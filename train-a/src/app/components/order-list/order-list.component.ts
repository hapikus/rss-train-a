import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Order } from '../../types/interfaces';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit {
  public orders: Order[] = [];
  public errorMessage = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  private fetchOrders(): void {
    this.orderService.getOrders(true).subscribe({
      next: (orders) => console.log(orders),
    });
  }
}
