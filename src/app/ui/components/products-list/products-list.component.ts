import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductModel } from '../../../domain/models/product/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent {
  /**
   *
   *
   * @type {string[]}
   * @memberof ProductsListComponent
   */
  @Input() headers!: string[];
  /**
   *
   *
   * @type {any[]}
   * @memberof ProductsListComponent
   */
  @Input() data!: any[];
  /**
   *
   *
   * @type {boolean}
   * @memberof ProductsListComponent
   */
  @Input() hasHeader!: boolean;

  /**
   *
   *
   * @type {Observable<DataEndpoint<ProductModel[]>>}
   * @memberof ProductsListComponent
   */
  @Input() products$!: ProductModel[];

  /**
   *
   *
   * @type {number}
   * @memberof ProductsListComponent
   */
  @Input() pageSize: number = 5;
  /**
   *
   *
   * @type {boolean}
   * @memberof ProductsListComponent
   */
  @Input() showDropdown: boolean = false;

  /**
   *
   *
   * @type {EventEmitter<any>}
   * @memberof ProductsListComponent
   */
  @Output() onMakeDropdownAction: EventEmitter<any> = new EventEmitter<any>();
  /**
   *
   *
   * @type {EventEmitter<any>}
   * @memberof ProductsListComponent
   */
  @Output() doPageSizeChangeAction: EventEmitter<any> = new EventEmitter<any>();



  /**
   *
   *
   * @param {number} index
   * @param {*} item
   * @return {*}  {number}
   * @memberof ProductsListComponent
   */
  trackByFn(index: number, item: any): number {
    return index;
  }

  /**
   *
   *
   * @param {ProductModel} product
   * @param {string} option
   * @memberof ProductsListComponent
   */
  onDropdownAction(product: ProductModel, option: string): void {
    const action = {
      product,
      option
    }
    this.onMakeDropdownAction.emit(action)
  }

  /**
   *
   *
   * @memberof ProductsListComponent
   */
  openDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  /**
   *
   *
   * @memberof ProductsListComponent
   */
  onPageSizeChange() {
    this.doPageSizeChangeAction.emit(this.pageSize)
  }

  /**
   *
   *
   * @param {string} name
   * @return {*}  {string}
   * @memberof ProductsListComponent
   */
  getInitials(name: string): string {
    const words = name.split(' ');
    let initials = '';

    for (const word of words) {
      initials += word.charAt(0);
      if (initials.length >= 2) {
        break;
      }
    }
    return initials.toUpperCase();
  }

  /**
   *
   *
   * @param {string} url
   * @return {*}  {boolean}
   * @memberof ProductsListComponent
   */
  imageExists(url: string): boolean {
    const img = new Image();
    img.src = url;
    return img.complete || (img.width + img.height) > 0;
  }

}
