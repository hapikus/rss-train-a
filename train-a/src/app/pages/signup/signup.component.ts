import { Component } from '@angular/core';
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

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  constructor(private nnfb: NonNullableFormBuilder) {}

  public submitForm(): void {
    if (this.signupForm.valid) {
      console.log('submit', this.signupForm.value);
    }
  }

  private checkPasswordValidator: ValidatorFn = (
    control: AbstractControl,
  ): { [s: string]: boolean } => {
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
