import { ProductGateway } from '../../../models/product/gateways/product.gateway';
import { of } from 'rxjs';
import { UpdateProductUseCase } from './validate-product.usecase';

describe('UpdateProductUseCase', () => {
  let updateProductUseCase: UpdateProductUseCase;
  let productGatewayMock: jest.Mocked<ProductGateway>;

  beforeEach(() => {
    productGatewayMock = {
      validateProductId: jest.fn(),
      getProducts: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    };

    updateProductUseCase = new UpdateProductUseCase(productGatewayMock);
  });

  it('should call validateProductId method of ProductGateway', () => {
    const productIdToValidate = '123';
    updateProductUseCase.validateProduct(productIdToValidate);

    expect(productGatewayMock.validateProductId).toHaveBeenCalledWith(
      productIdToValidate
    );
  });

  it('should return an Observable<boolean> from ProductGateway', (done) => {
    productGatewayMock.validateProductId.mockReturnValue(of(true));

    const result$ = updateProductUseCase.validateProduct('123');

    result$.subscribe((result) => {
      expect(result).toEqual(true);
      done();
    });
  });
});
