import { Component, computed, OnInit, Signal, signal } from '@angular/core';
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
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { LoginService } from '../../services/login.service';
import { ApiService, Profile } from '../../services/api.service';
import { CustomValidators } from '../../shared/utilities/custom-validators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NzMessageModule,
    NzFormModule,
    NzInputModule,
    NzImageModule,
    NzButtonModule,
    NzTypographyModule,
    NzModalModule,
    NzIconModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  public errorMessage = '';
  public userName = signal('');
  public email = signal('');
  public role = signal('');
  public profile: Signal<Profile> = computed(() => ({
    name: this.userName(),
    email: this.email(),
    role: this.role(),
  }));
  public isModalVisible = false;
  public nameFieldDisabled = true;
  public profileForm = new FormGroup({
    userName: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }, [
      CustomValidators.emailValidation(),
      Validators.required,
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  public imageUrl = 'assets/images/profile-train-1.jpg';

  constructor(
    private readonly router: Router,
    private readonly formBuilder: NonNullableFormBuilder,
    public loginService: LoginService,
    public apiService: ApiService,
  ) {}

  public ngOnInit(): void {
    this.getProfile();
  }

  private async getProfile(): Promise<void> {
    const profile = await this.apiService.fetchProfile();
    this.userName.set(profile.name);
    this.email.set(profile.email);
    this.role.set(profile.role);
  }

  private async updateProfile(): Promise<void> {
    const updatedProfile = await this.apiService.updateProfile(this.profile());
    if (this.userName() !== updatedProfile.name) this.userName.set(updatedProfile.name);
    if (this.email() !== updatedProfile.email) this.email.set(updatedProfile.email);
    if (this.role() !== updatedProfile.role) this.role.set(updatedProfile.role);
  }

  public async updatePassword(): Promise<void> {
    if (this.profileForm.controls.password.valid) {
      this.apiService.updatePassword(this.profileForm.controls.password.value);
    }
    this.hideModal();
  }

  public showModal(): void {
    this.isModalVisible = true;
  }

  public hideModal(): void {
    this.isModalVisible = false;
  }

  public enableNameField(): void {
    this.profileForm.get('userName')?.enable();
  }

  public enableEmailField(): void {
    this.profileForm.get('email')?.enable();
  }

  public submitNewName(): void {
    if (this.profileForm.controls.userName.valid) {
      this.userName.set(this.profileForm.controls.userName.value || '');
      this.updateProfile();
      this.profileForm.get('userName')?.disable();
    }
  }

  public submitNewEmail(): void {
    if (this.profileForm.controls.email.valid) {
      this.email.set(this.profileForm.controls.email.value || '');
      this.updateProfile();
      this.profileForm.get('email')?.disable();
    }
  }
}
