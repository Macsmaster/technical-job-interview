import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { GetProductsUseCase } from './get-products.usecase';
import { ProductGateway } from '../../../models/product/gateways/product.gateway';
import { ProductModel } from '../../../models/product/product.model';
import { PRODUCTS_MOCK } from '../../../../shared/test/product.mock';
import { of } from 'rxjs';

describe('ProductService', () => {
  let service: GetProductsUseCase;
  let getProductsUseCase: GetProductsUseCase;
  let productGatewayMock: ProductGateway;
  beforeEach(() => {
    productGatewayMock = {
      validateProductId: jest.fn(),
      getProducts: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    };
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        GetProductsUseCase,
        { provide: ProductGateway, useValue: productGatewayMock },
      ],
    });
    getProductsUseCase = new GetProductsUseCase(productGatewayMock);
    service = TestBed.inject(GetProductsUseCase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getProducts method of ProductGateway', () => {
    getProductsUseCase.getProducts();
    expect(productGatewayMock.getProducts).toHaveBeenCalled();
  });

  it('should return an Observable of ProductModel[] from ProductGateway', (done) => {
    const mockProducts: ProductModel[] = [
      ...PRODUCTS_MOCK
    ];
    productGatewayMock.getProducts = jest.fn().mockReturnValue(of(mockProducts));

    const result$ = getProductsUseCase.getProducts();

    result$.subscribe((result) => {
      expect(result).toEqual(mockProducts);
      done();
    });
  });
});
