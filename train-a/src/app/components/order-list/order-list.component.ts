import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { RideStatus } from '../../types/types';

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
  // public orders: Order[] = [];
  public errorMessage = '';

  constructor(
    private orderService: OrderService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) {
    // const ref: NzModalRef = modal.info();
    // ref.close();
  }

  // ngOnInit(): void {
  //   this.fetchOrders();
  // }

  private fetchOrders(): void {
    this.orderService.getOrders(true).subscribe({
      next: (orders) => console.log('orders', orders),
    });
  }

  // public orders = mockOrders;
  // public pageIndex = 1;
  // public pageSize = 5;
  // public totalOrders = this.orders.length;
  // public paginatedOrders = this.orders.slice(0, this.pageSize);
  orders: Order[] = mockOrders;
  sortedOrders!: Order[];

  // get sortedOrders() {
  //   return this.orders.sort(
  //     (a, b) =>
  //       new Date(this.getTripStartTime(a)).getTime()
  // - new Date(this.getTripStartTime(b)).getTime(),
  //   );
  // }

  ngOnInit(): void {
    // this.updatePagination();
    // this.fetchOrders();
    this.sortedOrders = this.orders.sort(
      (a, b) =>
        new Date(a.schedule.segments[0].departure).getTime() -
        new Date(b.schedule.segments[0].departure).getTime(),
    );
  }

  // updatePagination(): void {
  //   const startIndex = (this.pageIndex - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.paginatedOrders = this.sortedOrders.slice(startIndex, endIndex);
  // }

  public getCarriageType(order: Order): string {
    const lastSegmentIndex = order.schedule.segments.length - 1;
    return order.carriages[lastSegmentIndex] || 'Unknown';
  }

  public getTotalPrice(order: Order): number {
    return order.carriages.reduce((total, carriage) => total + (order.price[carriage] || 0), 0);
  }

  private getTripStartTime(order: Order): string {
    return order.schedule.segments[0].departure;
  }

  private getTripEndTime(order: Order): string {
    const lastSegment = order.schedule.segments[order.schedule.segments.length - 1];
    return lastSegment.arrival;
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

  getStationName(stationId: number): string {
    const stations: { [key: string]: string } = {
      33: 'Station A',
      5: 'Station B',
      62: 'Station C',
      11: 'Station D',
      48: 'Station E',
    };
    return stations[stationId] || 'Unknown Station';
  }

  public onCancelOrder(order: Order): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to cancel this order?',
      nzOnOk: () => {
        try {
          const updatedOrder: Order = { ...order, status: 'canceled' as RideStatus };

          this.sortedOrders = this.sortedOrders.map((o) => (o.id === order.id ? updatedOrder : o));

          this.message.success('Order successfully cancelled');
        } catch (error) {
          this.message.error('Error while cancelling the order');
        }
      },
    });
  }
}
