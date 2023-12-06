import { Observable } from "rxjs";
import { ProductModel } from "../product.model";


export abstract class ProductGateway {

    /**
   *
   *
   * @abstract
   * @return {*}  {Observable<boolean>}
   * @memberof ProductGateway
   */
    abstract validateProductId(id: string): Observable<boolean>;

  /**
   *
   *
   * @abstract
   * @return {*}  {Observable<ProductModel[]>}
   * @memberof ProductGateway
   */
  abstract getProducts(): Observable<ProductModel[]>;

  /**
   *
   *
   * @abstract
   * @param {ProductModel} product
   * @return {*}  {Observable<ProductModel>}
   * @memberof ProductGateway
   */
  abstract createProduct(product: ProductModel): Observable<ProductModel>;
  /**
   *
   *
   * @abstract
   * @param {ProductModel} product
   * @return {*}  {Observable<ProductModel>}
   * @memberof ProductGateway
   */
  abstract updateProduct(product: ProductModel): Observable<ProductModel>;
  /**
   *
   *
   * @abstract
   * @param {string} id
   * @return {*}  {Observable<void>}
   * @memberof ProductGateway
   */
  abstract deleteProduct(id: string): Observable<{}>;
}
