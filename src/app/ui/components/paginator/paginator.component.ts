import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent implements OnInit, AfterViewInit {
  /**
   *
   *
   * @type {string}
   * @memberof PaginatorComponent
   */
  @Input() elementId: string = '';
  /**
   *
   *
   * @type {string}
   * @memberof PaginatorComponent
   */
  @Input() totalElements: string = '';
  /**
   *
   *
   * @type {string}
   * @memberof PaginatorComponent
   */
  @Input() elementsPerPage: string = '';
  /**
   *
   *
   * @type {string}
   * @memberof PaginatorComponent
   */
  @Input() perMultipleElements: string  = '';
  /**
   *
   *
   * @type {string}
   * @memberof PaginatorComponent
   */
  /**
   *
   *
   * @type {string}
   * @memberof PaginatorComponent
   */
  @Input() type: string = '';

  /**
   *
   *
   * @type {EventEmitter<number>}
   * @memberof PaginatorComponent
   */
  @Output() onHandleChangePage: EventEmitter<number> = new EventEmitter<number>(true);

  constructor() {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
}
