import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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
import { NzImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NzMessageModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzImageModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [true],
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
