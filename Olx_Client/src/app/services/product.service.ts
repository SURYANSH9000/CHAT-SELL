import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { LocalStorageService } from './local-storage-service.service';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://chat-sell-1.onrender.com/products';

  constructor(private http: HttpClient) { }

  addProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/add`, productData)
      .pipe(catchError(this.handleError));
  }

  searchProducts(searchQuery: string,locationQuery: string,page: number, limit: number, excludeUserId?: string): Observable<Product[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('searchQuery', searchQuery)
      .set('locationQuery', locationQuery);
      if (excludeUserId) {
        params = params.set('excludeUserId', excludeUserId);
      }
    return this.http.get<Product[]>(`${this.baseUrl}`, { params })
      .pipe(catchError(this.handleError));
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}`)
      .pipe(catchError(this.handleError));
  }

  updateProduct(productId: string, productData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${productId}`, productData);
  }
  
  getProducts(page: number, limit: number, excludeUserId?: string): Observable<Product[]> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    if (excludeUserId) {
      params = params.set('excludeUserId', excludeUserId);
    }
    return this.http.get<Product[]>(`${this.baseUrl}`, { params })
      .pipe(catchError(this.handleError));
  }


  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getProductsByUserId(userId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  sponsorAd(productId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${productId}/sponsor`, {})
      .pipe(catchError(this.handleError));
  }  

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof HttpErrorResponse) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
