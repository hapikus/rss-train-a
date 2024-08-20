import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { take } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { CustomValidators } from '../../shared/utilities/custom-validators';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NzMessageModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  public errorMessage = '';

  constructor(
    private router: Router,
    private formBuilder: NonNullableFormBuilder,
    private loginService: LoginService,
  ) {}

  public loginForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
  }> = this.formBuilder.group({
    userName: ['', [CustomValidators.emailValidation(), Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  public submitForm(): void {
    if (this.loginForm.valid) {
      const userName = this.loginForm.controls.userName.value;
      const userPassword = this.loginForm.controls.password.value;

      this.loginService
        .login(userName, userPassword)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (error: Error) => {
            this.handleLoginError(error);
          },
        });
    }
  }

  private handleLoginError(error: Error): void {
    this.errorMessage = error.message;

    if (error.message.includes('Incorrect email or password')) {
      this.loginForm.controls.password.setErrors({ userNotFound: true });
    } else if (error.message.includes('Email is wrong')) {
      this.loginForm.controls.userName.setErrors({ invalidEmail: true });
    } else {
      this.loginForm.controls.userName.setErrors({ serverError: true });
      this.loginForm.controls.password.setErrors({ serverError: true });
    }
  }
}
