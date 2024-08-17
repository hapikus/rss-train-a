import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzImageModule } from 'ng-zorro-antd/image';

import { Router } from '@angular/router';
import { take } from 'rxjs';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzAlertModule,
    NzInputModule,
    NzButtonModule,
    NzImageModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  public errorMessage = '';
  public imageUrl = `assets/images/signup-train-${(new Date().getTime() % 3) + 1}.jpg`;

  constructor(
    private nnfb: NonNullableFormBuilder,
    private signupService: SignupService,
    private router: Router,
  ) {}

  public submitForm(): void {
    if (this.signupForm.valid) {
      this.signupService
        .signUp(this.signupForm.get('email')?.value, this.signupForm.get('password')?.value)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.router.navigate(['/signin']);
          },
          error: (error: Error) => {
            this.errorMessage = error.message;
            this.signupForm.get('email')?.setErrors({ serverError: true });
          },
        });
    }
  }

  private checkPasswordValidator: ValidatorFn = (
    control: AbstractControl,
  ): { [s: string]: boolean } => {
    this.errorMessage = '';
    if (!control.value) {
      return { required: true };
    }
    if (control.value !== this.signupForm.get('password')?.value) {
      return { confirm: true };
    }
    return {};
  };

  public signupForm: FormGroup = this.nnfb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    checkPassword: ['', [Validators.required, this.checkPasswordValidator]],
  });
}
