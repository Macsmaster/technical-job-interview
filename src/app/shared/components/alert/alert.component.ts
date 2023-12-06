// alert.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() title: string = '';
  @Input() text: string = '';
  @Input() type: 'success' | 'error' = 'success';
  @Output() close: EventEmitter<void> = new EventEmitter<void>();


  constructor(private notificationService: NotificationService) {}

  getIcon(): string {
    return this.type === 'success' ? '✔️' : '❌';
  }

  closeAlert(): void {
   this.notificationService.emitClose();
  }
}
