import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
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
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './carriages.component.html',
  styleUrl: './carriages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagesComponent implements OnInit {
  carriages: Carriage[] = [];
  carriageForm: Carriage = { name: '', rows: 16, leftSeats: 2, rightSeats: 3 };
  isModalVisible = false;

  constructor(private carriageService: CarriageService) {}

  ngOnInit(): void {
    this.loadCarriages();
  }

  private loadCarriages(): void {
    this.carriageService.getCarriages().subscribe((data) => {
      this.carriages = data;
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
    if (this.carriageForm.code) {
      this.carriageService
        .updateCarriage(this.carriageForm.code, this.carriageForm)
        .subscribe(() => this.loadCarriages());
    } else {
      this.carriageService.createCarriage(this.carriageForm).subscribe(() => this.loadCarriages());
    }
    this.isModalVisible = false;
  }

  public onCancel(): void {
    this.isModalVisible = false;
  }
}
