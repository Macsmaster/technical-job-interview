import { Injectable } from "@angular/core";
import { ProductGateway } from "../../../models/product/gateways/product.gateway";
import { Observable } from "rxjs";
import { ProductModel } from "../../../models/product/product.model";

@Injectable()

export class GetProductsUseCase {
  /**
   * Creates an instance of GetProductsUseCase.
   * @param {ProductGateway} productGateway
   * @memberof GetProductsUseCase
   */
  constructor(private productGateway: ProductGateway) {}

  /**
   *
   *
   * @return {*}  {Observable<ProductModel[]>}
   * @memberof GetProductsUseCase
   */
  getProducts(): Observable<ProductModel[]> {
    return this.productGateway.getProducts();
  }
}
