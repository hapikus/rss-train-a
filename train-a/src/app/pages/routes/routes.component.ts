import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { RouteCardComponent } from './route-card/route-card.component';
import { RoutesService } from '../../services/routes.service';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [
    NzButtonModule,
    NzEmptyModule,
    NzIconModule,
    NzPaginationModule,
    NzSpinModule,
    RouteCardComponent,
  ],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.scss',
})
export class RoutesComponent {
  public pageIndex: WritableSignal<number> = signal(1);
  public endIndex: Signal<number> = computed(() => this.pageIndex() * this.itemsPerPage);
  public startIndex: Signal<number> = computed(() => this.endIndex() - this.itemsPerPage);
  public itemsPerPage = 12;
  constructor(public readonly routesService: RoutesService) {}
}
