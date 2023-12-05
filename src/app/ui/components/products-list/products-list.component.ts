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

  @Input() pageSize: number = 5;
  @Input() showDropdown: boolean = false;

  @Output() onMakeDropdownAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() doPageSizeChangeAction: EventEmitter<any> = new EventEmitter<any>();



  trackByFn(index: number, item: any): number {
    return index;
  }

  onDropdownAction(product: ProductModel, option: string): void {
    const action = {
      product,
      option
    }
    this.onMakeDropdownAction.emit(action)
  }

  openDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  onPageSizeChange() {
    this.doPageSizeChangeAction.emit(this.pageSize)
  }

}
