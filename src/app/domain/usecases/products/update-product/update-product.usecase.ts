import { Injectable } from "@angular/core";
import { ProductGateway } from "../../../models/product/gateways/product.gateway";
import { Observable } from "rxjs";
import { ProductModel } from "../../../models/product/product.model";

@Injectable()

export class UpdateProductUseCase {
  /**
   * Creates an instance of UpdateProductUseCase.
   * @param {ProductGateway} productGateway
   * @memberof UpdateProductUseCase
   */
  constructor(private productGateway: ProductGateway) {}

  /**
   *
   *
   * @param {ProductModel} product
   * @return {*}  {Observable<ProductModel>}
   * @memberof UpdateProductUseCase
   */
  update(product: ProductModel): Observable<ProductModel> {
    return this.productGateway.updateProduct(product);
  }
}
