import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Order } from '../../types/interfaces';
import { OrderService } from '../../services/order.service';
import { mockOrders } from '../../shared/utilities/mock-orders';
// import { RideStatus } from '../../types/types';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    NzCardModule,
    NzPaginationModule,
    NzDividerModule,
    NzButtonModule,
    NzStepsModule,
    NzBadgeModule,
    CommonModule,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit {
  public orders: Order[] = mockOrders;
  public errorMessage = '';

  constructor(
    private orderService: OrderService,
    private message: NzMessageService,
    private modal: NzModalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.orders.sort((a, b) => {
      const departureA = new Date(a.schedule.segments[0].departure).getTime();
      const departureB = new Date(b.schedule.segments[0].departure).getTime();
      return departureA - departureB;
    });
  }

  public getCarriageType(order: Order): string {
    const lastSegmentIndex = order.schedule.segments.length - 1;
    return order.carriages[lastSegmentIndex] || 'Unknown';
  }

  public getTotalPrice(order: Order): number {
    return order.carriages.reduce((total, carriage) => total + (order.price[carriage] || 0), 0);
  }

  public getTripDuration(order: Order): string {
    const start = new Date(order.schedule.segments[0].departure).getTime();
    const end = new Date(
      order.schedule.segments[order.schedule.segments.length - 1].arrival,
    ).getTime();
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  }

  public onCancelOrder(order: Order): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to cancel this order?',
      nzOnOk: () => {
        try {
          const trip = this.orders.find((o) => o.id === order.id);
          if (trip) {
            trip.status = 'canceled';
            this.cdr.detectChanges();
          }
          this.message.success('Order successfully cancelled');
        } catch (error) {
          this.message.error('Error while cancelling the order');
        }
      },
    });
  }
}
