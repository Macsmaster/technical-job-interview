import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { InputFilterComponent } from '../../components/input-filter/input-filter.component';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { TableComponent } from '../../components/table/table.component';
import { ProductService } from '../../../infrastructure/services/product.service';
import { Observable } from 'rxjs';
import { DataEndpoint } from '../../../shared/models/api.interface';
import { HttpClientModule } from '@angular/common/http';
import { ProductModel } from '../../../domain/models/product/product.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    InputFilterComponent,
    ProductsListComponent,
    TableComponent,
    HttpClientModule,
    CommonModule,
    ButtonComponent,
    RouterModule
  ],
  providers: [ProductService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  headers: string[] = [
    'Nombre',
    'Descripción',
    'Logo',
    'Fecha de creación',
    'Fecha de revisión',
    ''
  ];

  tableData$!: Observable<ProductModel[]>;
  /**
   * Creates an instance of HomeComponent.
   * @param {ProductService} _productService
   * @memberof HomeComponent
   */
  constructor(private _productService: ProductService, private router: Router) {}

  /**
   *
   *
   * @memberof ProductsListComponent
   */
  ngOnInit(): void {
    this.tableData$ = this._productService.getProducts();
  }

  onNavigateEditionPage(productId: string) {
    console.log(productId)
    this.router.navigateByUrl(`update/${productId}`);
  }
}
