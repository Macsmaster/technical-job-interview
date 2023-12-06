import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { ProductGateway } from '../../../models/product/gateways/product.gateway';
import { ProductModel } from '../../../models/product/product.model';
import { PRODUCT_MOCK } from '../../../../shared/test/product.mock';
import { of } from 'rxjs';
import { CreateProductUseCase } from './create-product.usecase';

describe('ProductService', () => {
  let service: CreateProductUseCase;
  let createProductUseCase: CreateProductUseCase;
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
        CreateProductUseCase,
        { provide: ProductGateway, useValue: productGatewayMock },
      ],
    });
    createProductUseCase = new CreateProductUseCase(productGatewayMock);
    service = TestBed.inject(CreateProductUseCase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createProduct method of ProductGateway', () => {
    const mockProduct: ProductModel = PRODUCT_MOCK;
    createProductUseCase.createProduct(mockProduct);

    expect(productGatewayMock.createProduct).toHaveBeenCalledWith(mockProduct);
  });

  it('should return an Observable of ProductModel from ProductGateway', (done) => {
    const mockProduct: ProductModel = PRODUCT_MOCK;

    (productGatewayMock.createProduct as jest.Mock).mockReturnValue(
      of(mockProduct)
    );

    const result$ = createProductUseCase.createProduct(mockProduct);

    result$.subscribe((result) => {
      expect(result).toEqual(mockProduct);
      done();
    });
  });
});
