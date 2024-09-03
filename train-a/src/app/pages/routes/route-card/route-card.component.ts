import { Component, Input } from '@angular/core';
import { NzCardModule, NzCardTabComponent } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { RouterLink } from '@angular/router';
import { nullRoute, Route, RoutesService } from '../../../services/routes.service';

@Component({
  selector: 'app-route-card',
  standalone: true,
  imports: [
    NzCardModule,
    NzIconModule,
    NzCardTabComponent,
    NzTabsModule,
    NzTimelineModule,
    NzPopconfirmModule,
    RouterLink,
  ],
  templateUrl: './route-card.component.html',
  styleUrl: './route-card.component.scss',
})
export class RouteCardComponent {
  @Input() route: Route = nullRoute;

  constructor(private readonly routesService: RoutesService) {}

  public confirmDelete() {
    this.routesService.deleteRoute(this.route.id);
  }

  public update() {
    this.routesService.updatingRoute = this.route;
    this.routesService.mode = 'update';
  }
}
