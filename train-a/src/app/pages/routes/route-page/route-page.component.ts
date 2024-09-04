import { Component } from '@angular/core';
import { StationsFormComponent } from '../stations-form/station-form.component';

@Component({
  selector: 'app-route-page',
  standalone: true,
  imports: [StationsFormComponent],
  templateUrl: './route-page.component.html',
  styleUrl: './route-page.component.scss',
})
export class RoutePageComponent {}
