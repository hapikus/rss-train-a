import { Component, Input } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NzMenuModule, NzDrawerModule, NzButtonModule, NzIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() userType: string = 'guest';
  isMobile: boolean = false;
  isDesktop: boolean = false;
  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  constructor(private breakpointObserver: BreakpointObserver) {
    const CUSTOM_BREAKPOINTS = [
      '(max-width: 600px)', // мобильные устройства
      '(min-width: 601px) and (max-width: 900px)', // планшеты
      '(min-width: 901px)', // десктопы
    ];

    const customHandset$ = this.breakpointObserver.observe(CUSTOM_BREAKPOINTS[0]);
    const customTablet$ = this.breakpointObserver.observe(CUSTOM_BREAKPOINTS[1]);
    const customWeb$ = this.breakpointObserver.observe(CUSTOM_BREAKPOINTS[2]);

    combineLatest([customHandset$, customTablet$, customWeb$])
      .pipe(
        map(([handset, web]) => ({
            isMobile: handset.matches,
            isDesktop: web.matches,
          })),
      )
      .subscribe(({ isMobile, isDesktop }) => {
        this.isMobile = isMobile;
        this.isDesktop = isDesktop;
      });
    }
}
