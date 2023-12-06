import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { ProductGateway } from '../../../models/product/gateways/product.gateway';
import { DeleteProductUseCase } from './delete-product.usecase';
import { of } from 'rxjs';

describe('ProductService', () => {
  let service: DeleteProductUseCase;
  let deleteProductUseCase: DeleteProductUseCase;
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
        DeleteProductUseCase,
        { provide: ProductGateway, useValue: productGatewayMock },
      ],
    });
    deleteProductUseCase = new DeleteProductUseCase(productGatewayMock);
    service = TestBed.inject(DeleteProductUseCase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call deleteProduct method of ProductGateway', () => {
    const productIdToDelete = '123';
    deleteProductUseCase.deleteProduct(productIdToDelete);

    expect(productGatewayMock.deleteProduct).toHaveBeenCalledWith(
      productIdToDelete
    );
  });
});
