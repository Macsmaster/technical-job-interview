import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../infrastructure/services/product.service';
import { Observable } from 'rxjs';
import { ProductModel } from '../../../domain/models/product/product.model';
import { DataEndpoint } from '../../../shared/models/api.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
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
  @Input() products$!: Observable<ProductModel[]>;

  @Input() pageSize: number = 5;

  @Output() onMakeDropdownAction: EventEmitter<string> = new EventEmitter<string>();

  trackByFn(index: number, item: any): number {
    return index;
  }

  onDropdownAction(productId: string): void {
    this.onMakeDropdownAction.emit(productId)
  }

}
