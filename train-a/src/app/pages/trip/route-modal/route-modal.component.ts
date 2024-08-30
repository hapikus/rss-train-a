import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Station } from '../../../models/station';
import { ModalData } from '../models';
import { DurationsPipe } from '../pipes/durations.pipe';


@Component({
  selector: 'app-route-modal',
  standalone: true,
  imports: [NzTypographyModule, NzTimelineModule, NzModalModule, CommonModule, DurationsPipe],
  templateUrl: './route-modal.component.html',
  styleUrl: './route-modal.component.scss',
})
export class RouteModalComponent {
  @Input() public modalData: ModalData[] = [];
  @Input() public showModal: boolean = false;
  @Output() toggleShowModal = new EventEmitter<boolean>();
  public stations: Station[] = [];

  public closeModal(): void {
    this.toggleShowModal.emit();
  }
}
