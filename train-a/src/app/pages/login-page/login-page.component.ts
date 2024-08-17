import { Component, inject } from '@angular/core';
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
// import { NzAlertModule } from 'ng-zorro-antd/alert';
import { take } from 'rxjs';
import { LoginService } from '../../services/login.service';

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
})
export class LoginPageComponent {
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly loginService = inject(LoginService);
  public errorMessage = '';

  public loginForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
  }> = this.formBuilder.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  submitForm(): void {
    if (this.loginForm.valid) {
      console.log('submit', this.loginForm.value);
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
            this.errorMessage = error.message;
            this.loginForm.controls.userName.setErrors({ serverError: true });
          },
        });
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
