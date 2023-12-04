import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
@Input() showModal: boolean = false;
 @Input() cardTitle: string = '';
 @Input() modalText: string = '';
 @Input() cardImage: string = '';
 @Input() buttonLink: string = '';

 @Input() showPrimaryBtn: boolean = true;
 @Input() showSecondaryBtn: boolean = true;
 @Output() primaryBtnAction: EventEmitter<any> = new EventEmitter<any>();
 @Output() secondaryBtnAction: EventEmitter<any> = new EventEmitter<any>();

 onPrimaryButtonClick(event: any) {
    this.primaryBtnAction.emit(event)
  }

  onSecondaryButtonClick(event: any) {
    this.secondaryBtnAction.emit(event)
  }

}
