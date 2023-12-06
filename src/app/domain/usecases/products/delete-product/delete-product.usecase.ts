import { Injectable } from "@angular/core";
import { ProductGateway } from "../../../models/product/gateways/product.gateway";
import { Observable } from "rxjs";

@Injectable()

export class DeleteProductUseCase {
  /**
   * Creates an instance of DeleteProductUseCase.
   * @param {ProductGateway} productGateway
   * @memberof DeleteProductUseCase
   */
  constructor(private productGateway: ProductGateway) {}

  /**
   *
   *
   * @param {string} product
   * @return {*}  {Observable<void>}
   * @memberof DeleteProductUseCase
   */
  deleteProduct(product: string): Observable<{}> {
    return this.productGateway.deleteProduct(product);
  }
}
