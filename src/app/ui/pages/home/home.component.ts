import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { ProductService } from '../../../infrastructure/services/product.service';
import { Observable, debounceTime, filter, merge, of, pairwise, skip, startWith, switchMap } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ProductModel } from '../../../domain/models/product/product.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { LoaderService } from '../../../core/services/loader/loader.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

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
    SharedModule,
    ReactiveFormsModule,
    LoaderComponent
  ],
  providers: [ProductService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('modalDelete') modalDelete!: ModalComponent;

  headers: string[] = [
    'Logo',
    'Nombre del producto',
    'Descripción',
    'Fecha de liberación',
    'Fecha de revisión',
    '',
  ];
  showModal: boolean = false;

  tableData: ProductModel[] = [];
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  searchControl: FormControl = new FormControl('');
  selectedProduct: ProductModel | null = null;
  pageSize!: number;
  /**
   * Creates an instance of HomeComponent.
   * @param {ProductService} _productService
   * @memberof HomeComponent
   */

  public loadingView$ = this.loaderService.visibility$
  constructor(
    private _productService: ProductService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private notificationService: NotificationService,
    private loaderService: LoaderService
  ) {}

  /**
   *
   *
   * @memberof ProductsListComponent
   */
  ngOnInit(): void {
    this._initializeData();
    this._setupSearchControlSubscription();
  }

  ngOnDestroy(): void {
      this.notificationService.emitClose();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this._updateFilteredProducts(this.allProducts);
  }

  private _initializeData(): void {
    this._productService.getProducts().subscribe((products) => {
      this._updateProductData(products);
      this.cd.detectChanges();
    });
  }

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

    merge(inputChanges$, blurChanges$).subscribe((filteredData) => this._updateFilteredProducts(filteredData));
  }

  private _filterProducts(searchTerm: string): Observable<any[]> {
    return of(
      this.allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  private _updateProductData(products: any[]): void {
    this.allProducts = this.filteredProducts = products;
  }

  private _updateFilteredProducts(filteredData: any[]): void {
    this.filteredProducts = filteredData.slice(0, this.pageSize);
  }

  onDropDownActions(option: any) {
    this.selectedProduct = option.product;
    if (option.option === 'edit') {
      const navigationExtras: NavigationExtras = {
        state: {
          product: this.selectedProduct
        }
      };
      this.router.navigate([`update/${option.product.id}`], navigationExtras);
    }
    if (option.option === 'delete') {
      this.onOpenModal();
    }
  }

  onOpenModal() {
    this.showModal = true;
  }

  onCloseModal() {
    this.showModal = false;
  }
  onDeleteProduct() {
    if (this.selectedProduct === null) {
      return;
    }

    this._productService
      .deleteProduct(this.selectedProduct?.id)
      .subscribe((response) => {
        this.notificationService.showSuccess('Producto eliminado exitosamente');
      });
      this.notificationService.showSuccess('Producto eliminado exitosamente');
    this.filteredProducts = this.filteredProducts.filter(product => product.id !== this.selectedProduct?.id);

    this.onCloseModal();
  }
}
