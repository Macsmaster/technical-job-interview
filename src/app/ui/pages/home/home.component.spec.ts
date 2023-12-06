import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeComponent } from './home.component';
import { ProductService } from '../../../infrastructure/services/product.service';
import { of } from 'rxjs';
import { PRODUCTS_MOCK, PRODUCT_MOCK } from '../../../shared/test/product.mock';
import { ChangeDetectorRef } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockProductService: any;

  beforeEach(async () => {
    mockProductService = {
      getProducts: jest.fn(() => of([])),
    };
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        ProductService,
        ChangeDetectorRef,
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call _initializeData and _setupSearchControlSubscription on ngOnInit', () => {
    jest.spyOn(component as any, '_initializeData');
    jest.spyOn(component as any, '_setupSearchControlSubscription');
    component.ngOnInit();
    expect(component['_initializeData']).toHaveBeenCalled();
    expect(component['_setupSearchControlSubscription']).toHaveBeenCalled();
  });

  it('should update pageSize and call _updateFilteredProducts on onPageSizeChange', () => {
    const pageSize = 10;
    jest.spyOn(component as any, '_updateFilteredProducts');

    component.onPageSizeChange(pageSize);

    expect(component.pageSize).toBe(pageSize);
    expect(component['_updateFilteredProducts']).toHaveBeenCalledWith(
      component.allProducts
    );
  });

  describe('set Test for _updateFilteredProducts', () => {
    it('should filter products case-insensitively', fakeAsync(() => {
      component.allProducts = PRODUCTS_MOCK;
      const searchTerm = 'PRODUCTC';

      let result: any;
      component['_filterProducts'](searchTerm).subscribe((filteredProducts) => {
        result = filteredProducts;
      });

      tick();

      expect(result).toEqual([
        {
          id: '158',
          name: 'ProductC',
          description: 'product 1 description',
          logo: 'https://picsum.photos/200/300',
          date_release: new Date('2023-12-05'),
          date_revision: new Date('2023-12-05'),
        },
      ]);
    }));
  });

  it('Should set showModal in false', () => {
    component.showModal = true;
    component.onCloseModal();
    expect(component.showModal).toBeFalsy();
  });

  it('should update allProducts and filteredProducts on _updateProductData', () => {
    const products = [PRODUCT_MOCK, PRODUCT_MOCK];

    (component as any)._updateProductData(products);

    expect(component.allProducts).toEqual(products);
    expect(component.filteredProducts).toEqual(products);
  });

  it('Should set showModal in true', () => {
    component.showModal = false;
    component.onOpenModal();
    expect(component.showModal).toBeTruthy();
  });

  it('should update filteredProducts with the first pageSize elements from filteredData on _updateFilteredProducts', () => {
    const filteredData = [PRODUCT_MOCK, PRODUCT_MOCK, PRODUCT_MOCK];
    component.pageSize = 2;

    component['_updateFilteredProducts'](filteredData);

    expect(component.filteredProducts).toEqual(
      filteredData.slice(0, component.pageSize)
    );
  });

  describe('set Test for onDropDownActions', () => {
    it('should navigate to update page when option is edit', () => {
      const option = { product: PRODUCT_MOCK, option: 'edit' };
      const navigateSpy = jest.spyOn(component['router'], 'navigate');

      component.onDropDownActions(option);

      expect(navigateSpy).toHaveBeenCalledWith(
        [`update/${option.product.id}`],
        { state: { product: option.product } }
      );
    });

    it('should call onOpenModal when option is delete', () => {
      const option = { product: PRODUCT_MOCK, option: 'delete' };
      const onOpenModalSpy = jest.spyOn(component, 'onOpenModal');

      component.onDropDownActions(option);

      expect(onOpenModalSpy).toHaveBeenCalled();
    });
  });

  it('should call emitClose on _notificationService when the component is destroyed', () => {
    const emitCloseSpy = jest.spyOn(
      component['_notificationService'],
      'emitClose'
    );

    component.ngOnDestroy();

    expect(emitCloseSpy).toHaveBeenCalled();
  });

  it('should delete the selected product and show a success notification on onDeleteProduct', () => {
    component.selectedProduct = PRODUCT_MOCK;
    const deleteProductSpy = jest
      .spyOn(component['_productService'], 'deleteProduct')
      .mockReturnValue(of({}));
    const showSuccessSpy = jest.spyOn(
      component['_notificationService'],
      'showSuccess'
    );
    const onCloseModalSpy = jest.spyOn(component, 'onCloseModal');

    component.onDeleteProduct();

    expect(deleteProductSpy).toHaveBeenCalledWith(PRODUCT_MOCK.id);
    expect(showSuccessSpy).toHaveBeenCalledWith(
      'Producto eliminado exitosamente'
    );
    expect(component.filteredProducts).not.toContain(PRODUCT_MOCK);
    expect(onCloseModalSpy).toHaveBeenCalled();
  });
});
