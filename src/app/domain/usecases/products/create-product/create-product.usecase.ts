import { Injectable } from "@angular/core";
import { ProductGateway } from "../../../models/product/gateways/product.gateway";
import { Observable } from "rxjs";
import { ProductModel } from "../../../models/product/product.model";

@Injectable()

export class CreateProductUseCase {
  /**
   * Creates an instance of CreateProductUseCase.
   * @param {ProductGateway} productGateway
   * @memberof CreateProductUseCase
   */
  constructor(private productGateway: ProductGateway) {}

  /**
   *
   *
   * @param {ProductModel} product
   * @return {*}  {Observable<ProductModel>}
   * @memberof CreateProductUseCase
   */
  createProduct(product: ProductModel): Observable<ProductModel> {
    return this.productGateway.createProduct(product);
  }
}
