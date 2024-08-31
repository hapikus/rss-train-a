import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Carriage } from '../../types/interfaces';
import { CarriageService } from '../../services/carriage.service';
import { CarriagePrototypeComponent } from '../../components/carriage-prototype/carriage-prototype.component';

@Component({
  selector: 'app-carriages',
  standalone: true,
  imports: [
    CarriagePrototypeComponent,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzCollapseModule,
    NzDividerModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './carriages.component.html',
  styleUrl: './carriages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagesComponent implements OnInit {
  public carriages = toSignal(this.carriageService.carriages$, { initialValue: [] });
  carriageForm: Carriage = { name: '', rows: 16, leftSeats: 2, rightSeats: 3 };
  isModalVisible = false;
  isCollapsed = true;

  constructor(private carriageService: CarriageService) {}

  ngOnInit(): void {
    this.loadCarriages();
  }

  public loadCarriages(): void {
    this.carriageService.getCarriages().subscribe((carriages) => {
      this.carriageService.setCarriages(carriages);
    });
  }

  public onCreate(): void {
    this.carriageForm = { name: '', rows: 16, leftSeats: 2, rightSeats: 3 };
    this.isModalVisible = true;
  }

  public onEdit(carriage: Carriage): void {
    this.carriageForm = { ...carriage };
    this.isModalVisible = true;
  }

  public onSave(): void {
    // if (this.carriageForm.code) {
    //   this.carriageService
    //     .updateCarriage(this.carriageForm.code, this.carriageForm)
    //     .subscribe(() => this.loadCarriages());
    // } else {
    //   this.carriageService.createCarriage(this.carriageForm)
    // .subscribe(() => this.loadCarriages());
    // }
    this.isModalVisible = false;
  }

  public onCancel(): void {
    this.isModalVisible = false;
  }

  public toggleCollapse(isOpen: boolean): void {
    this.isCollapsed = !isOpen;
  }
}
