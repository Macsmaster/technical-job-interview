
import { ProductGateway } from '../../../models/product/gateways/product.gateway';
import { of } from 'rxjs';
import { ProductModel } from '../../../models/product/product.model';
import { UpdateProductUseCase } from './update-product.usecase';
import { PRODUCT_MOCK } from '../../../../shared/test/product.mock';

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

  it('should call updateProduct method of ProductGateway', () => {

    const mockProduct: ProductModel =PRODUCT_MOCK;
    updateProductUseCase.update(mockProduct);


    expect(productGatewayMock.updateProduct).toHaveBeenCalledWith(mockProduct);
  });

  it('should return an Observable<ProductModel> from ProductGateway', (done) => {
    const mockProduct: ProductModel =PRODUCT_MOCK;


    (productGatewayMock.updateProduct as jest.Mock).mockReturnValue(of(mockProduct));


    const result$ = updateProductUseCase.update(mockProduct);


    result$.subscribe((result) => {

      expect(result).toEqual(mockProduct);
      done();
    });
  });
});
