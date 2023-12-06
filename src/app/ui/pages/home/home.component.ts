import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { ProductService } from '../../../infrastructure/services/product.service';
import {
  Observable,
  Subscription,
  debounceTime,
  filter,
  merge,
  of,
  pairwise,
  skip,
  startWith,
  switchMap,
} from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ProductModel } from '../../../domain/models/product/product.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from '../../../core/services/loader/loader.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { TABLE_HEADERS } from '../constants/table.const';
import { ProductGateway } from '../../../domain/models/product/gateways/product.gateway';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    ProductsListComponent,
    HttpClientModule,
    CommonModule,
    ButtonComponent,
    RouterModule,
    ModalComponent,
    ReactiveFormsModule,
    LoaderComponent,
    PaginatorComponent,
  ],
  providers: [
    ProductService,
    { provide: ProductGateway, useClass: ProductService },
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('modalDelete') modalDelete!: ModalComponent;

  /**
   *
   *
   * @type {string[]}
   * @memberof HomeComponent
   */
  headers: string[] = TABLE_HEADERS;
  /**
   *
   *
   * @type {boolean}
   * @memberof HomeComponent
   */
  showModal: boolean = false;

  /**
   *
   *
   * @type {ProductModel[]}
   * @memberof HomeComponent
   */
  /**
   *
   *
   * @type {ProductModel[]}
   * @memberof HomeComponent
   */
  allProducts: ProductModel[] = [];
  /**
   *
   *
   * @type {ProductModel[]}
   * @memberof HomeComponent
   */
  filteredProducts: ProductModel[] = [];
  /**
   *
   *
   * @type {FormControl}
   * @memberof HomeComponent
   */
  searchControl: FormControl = new FormControl('');
  /**
   *
   *
   * @type {(ProductModel | null)}
   * @memberof HomeComponent
   */
  selectedProduct: ProductModel | null = null;
  /**
   *
   *
   * @type {number}
   * @memberof HomeComponent
   */
  pageSize: number = 5;
  /**
   * Creates an instance of HomeComponent.
   * @param {ProductService} _productService
   * @memberof HomeComponent
   */

  /**
   *
   *
   * @memberof HomeComponent
   */
  public loadingView$ = this.loaderService.visibility$;

  subscriptions$: Subscription[] = [];

  /**
   * Creates an instance of HomeComponent.
   * @param {ProductService} _productService
   * @param {Router} router
   * @param {ChangeDetectorRef} cd
   * @param {NotificationService} _notificationService
   * @param {LoaderService} loaderService
   * @memberof HomeComponent
   */
  constructor(
    private _productService: ProductService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private _notificationService: NotificationService,
    private loaderService: LoaderService,
    private ngZone: NgZone
  ) {}

  currentPage: number = 1;

  /**
   *
   *
   * @param {number} page
   * @memberof ProductsListComponent
   */
  onPageChange(page: number): void {
    this.currentPage = page;
  }


  /**
   *
   *
   * @readonly
   * @type {ProductModel[]}
   * @memberof ProductsListComponent
   */
  get paginatedProducts(): ProductModel[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.allProducts.length);

    return this.filteredProducts.slice(startIndex, endIndex);
  }


  /**
   *
   *
   * @readonly
   * @type {number}
   * @memberof ProductsListComponent
   */
  get totalPages(): number {
    return Math.ceil(this.allProducts.length / this.pageSize);
  }

  /**
   *
   *
   * @memberof ProductsListComponent
   */
  ngOnInit(): void {
    this._initializeData();
    this._setupSearchControlSubscription();
    this.onPageSizeChange(this.pageSize)
  }

  /**
   *
   *
   * @memberof HomeComponent
   */
  ngOnDestroy(): void {
    if (this.subscriptions$.length > 0) {
      this.subscriptions$.forEach((subscription) => subscription.unsubscribe());
    }
    this._notificationService.emitClose();
  }

  /**
   *
   *
   * @param {number} pageSize
   * @memberof HomeComponent
   */
  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this._updateFilteredProducts(this.allProducts);

  }

  /**
   *
   *
   * @private
   * @memberof HomeComponent
   */
  private _initializeData(): void {
    this.subscriptions$.push(
      this._productService.getProducts().subscribe((products) => {
        this._updateProductData(products);
        this.cd.detectChanges();
      })
    );
  }

  /**
   *
   *
   * @private
   * @memberof HomeComponent
   */
  private _setupSearchControlSubscription(): void {
    const inputChanges$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((searchTerm: any) => this._filterProducts(searchTerm))
    );

    const blurChanges$ = this.searchControl.valueChanges.pipe(
      skip(1),
      pairwise(),
      filter(([prev, current]) => prev !== current),
      switchMap(() => this._filterProducts(this.searchControl.value))
    );

    merge(inputChanges$, blurChanges$).subscribe((filteredData) =>
      this._updateFilteredProducts(filteredData)
    );
  }

  /**
   *
   *
   * @private
   * @param {string} searchTerm
   * @return {*}  {Observable<any[]>}
   * @memberof HomeComponent
   */
  private _filterProducts(searchTerm: string): Observable<any[]> {
    return of(
      this.allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  /**
   *
   *
   * @private
   * @param {ProductModel[]} products
   * @memberof HomeComponent
   */
  private _updateProductData(products: ProductModel[]): void {
    this.allProducts = this.filteredProducts = products;
  }

  /**
   *
   *
   * @private
   * @param {ProductModel[]} filteredData
   * @memberof HomeComponent
   */
  private _updateFilteredProducts(filteredData: ProductModel[]): void {
    this.filteredProducts = filteredData.slice(0, this.pageSize);
  }

  /**
   *
   *
   * @param {*} option
   * @memberof HomeComponent
   */
  onDropDownActions(option: any) {
    this.selectedProduct = option.product;
    if (option.option === 'edit') {
      const navigationExtras: NavigationExtras = {
        state: {
          product: this.selectedProduct,
        },
      };
      this.ngZone.run(() => {
        this.router.navigate([`update/${option.product.id}`], navigationExtras);
      });
    }
    if (option.option === 'delete') {
      this.onOpenModal();
    }
  }

  /**
   *
   *
   * @memberof HomeComponent
   */
  onOpenModal() {
    this.showModal = true;
  }

  /**
   *
   *
   * @memberof HomeComponent
   */
  onCloseModal() {
    this.showModal = false;
  }

  /**
   *
   *
   * @return {*}
   * @memberof HomeComponent
   */
  onDeleteProduct() {
    if (this.selectedProduct === null) {
      return;
    }

    const s$ = this._productService
      .deleteProduct(this.selectedProduct?.id)
      .subscribe(() => {
        this._notificationService.showSuccess(
          'Producto eliminado exitosamente'
        );
      });
    this.subscriptions$.push(s$);
    this._notificationService.showSuccess('Producto eliminado exitosamente');
    this.filteredProducts = this.filteredProducts.filter(
      (product) => product.id !== this.selectedProduct?.id
    );

    this.onCloseModal();
  }
}
