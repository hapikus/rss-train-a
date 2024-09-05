import { Component, computed, Signal, signal, OnInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { combineLatest, map } from 'rxjs';
import { ApiService, Profile } from '../../../services/api.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NzMenuModule, NzDrawerModule, NzButtonModule, NzIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isMobile: boolean = false;
  isDesktop: boolean = false;
  visible = false;

  public userName = signal('');
  public email = signal('');
  public role = signal('guest');
  public profile: Signal<Profile> = computed(() => ({
    name: this.userName(),
    email: this.email(),
    role: this.role(),
  }));

  constructor(
    private breakpointObserver: BreakpointObserver,
    public loginService: LoginService,
    private apiSer: ApiService,
  ) {
    const CUSTOM_BREAKPOINTS = [
      '(max-width: 600px)',
      '(min-width: 601px) and (max-width: 900px)',
      '(min-width: 901px)',
    ];

    const customHandset$ = this.breakpointObserver.observe(CUSTOM_BREAKPOINTS[0]);
    const customWeb$ = this.breakpointObserver.observe(CUSTOM_BREAKPOINTS[2]);

    combineLatest([customHandset$, customWeb$])
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

  ngOnInit(): void {
    this.loginService.role$.subscribe((role) => {
      this.role.set(role);
    });
    this.getProfile();
  }

  private async getProfile(): Promise<void> {
    try {
      const profile = await this.apiSer.fetchProfile();
      this.userName.set(profile.name);
      this.email.set(profile.email);
      this.role.set(profile.role);
    } catch (error) {
      console.error('Error fetching profile:', error);
      this.role.set('');
    }
  }

  public logout(): void {
    this.loginService.logout();
    this.role.set('');
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
