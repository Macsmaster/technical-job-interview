import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() textBtn: string = '';
  @Input() type: string = 'submit';
  @Input() isDisabled: boolean = false;
  @Input() isPrimary: boolean = false;
  @Input() size: 'small' | 'medium' |  'large' | 'xl' = 'medium' ;

}
