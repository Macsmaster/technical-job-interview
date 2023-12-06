import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() showModal: boolean = true;
  @Input() modalTitle: string = '';
  @Input() modalText: string = '';
  @Input() buttonLink: string = '';
  @Input() btnPrimaryName: string = '';
  @Input() btnSecondaryName: string = '';

  @Input() showPrimaryBtn: boolean = true;
  @Input() showSecondaryBtn: boolean = true;
  @Output() primaryBtnAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() secondaryBtnAction: EventEmitter<any> = new EventEmitter<any>();

  /**
   *
   *
   * @param {*} event
   * @memberof ModalComponent
   */
  onPrimaryButtonClick(event: any) {
    this.primaryBtnAction.emit(event);
  }

  /**
   *
   *
   * @param {*} event
   * @memberof ModalComponent
   */
  closeModal(event: any) {
    this.secondaryBtnAction.emit(event);
  }

  /**
   *
   *
   * @param {Event} event
   * @memberof ModalComponent
   */
  preventClosing(event: Event): void {
    event.stopPropagation();
  }
}
