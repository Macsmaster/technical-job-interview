import { Injectable } from "@angular/core";
import { ProductGateway } from "../../../models/product/gateways/product.gateway";
import { Observable } from "rxjs";


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
   * @param {string} product
   * @return {*}  {Observable<boolean>}
   * @memberof UpdateProductUseCase
   */
  validateProduct(product: string): Observable<boolean> {
    return this.productGateway.validateProductId(product);
  }
}
