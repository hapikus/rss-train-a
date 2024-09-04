import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './pages/template/header/header.component';
import { FooterComponent } from './pages/template/footer/footer.component';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'train-a';
  public userType: string;

  constructor(private loginService: LoginService) {
    this.userType = this.loginService.getUserType();
    console.log(this.userType);
  }
}
