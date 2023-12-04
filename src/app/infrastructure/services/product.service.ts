import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataEndpoint } from '../../shared/models/api.interface';
import { ProductModel } from '../../domain/models/product/product.model';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private _API_URL: string = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products';
  constructor(private httpClient: HttpClient) {}


  /**
   *
   *
   * @return {*}  {Observable<ProductModel[]>}
   * @memberof ProductService
   */
  getProducts(): Observable<ProductModel[]> {
    const headers = new HttpHeaders().set('authorId', '108');
   return this.httpClient.get<ProductModel[]>(this._API_URL, { headers });
  }

  /**
   *
   *
   * @param {string} id
   * @return {*}  {Observable<ProductModel>}
   * @memberof ProductService
   */
  getProductsById(id: string): Observable<ProductModel> {
    const headers = new HttpHeaders().set('authorId', '108');
    const url = `${this._API_URL}/${id}`;
   return this.httpClient.get<ProductModel>(url, { headers });
  }

  /**
   *
   *
   * @param {ProductModel} data
   * @return {*}  {Observable<ProductModel>}
   * @memberof ProductService
   */
  createProduct(data: ProductModel): Observable<ProductModel> {
    const headers = new HttpHeaders().set('authorId', '108');
   return this.httpClient.post<ProductModel>(this._API_URL, data, { headers })
  }


  /**
   *
   *
   * @param {ProductModel} data
   * @return {*}  {Observable<ProductModel>}
   * @memberof ProductService
   */
  updateProduct(data: ProductModel): Observable<ProductModel> {
    const headers = new HttpHeaders().set('authorId', '108');
   return this.httpClient.put<ProductModel>(this._API_URL, data, { headers });
  }

  /**
   *
   *
   * @param {string} id
   * @return {*}  {Observable<{}>}
   * @memberof ProductService
   */
  deleteProduct(id: string): Observable<{}> {
    const headers = new HttpHeaders().set('authorId', '108');
    const url = `${this._API_URL}/${id}`;
    return this.httpClient.delete(url, { headers });
  }
}
