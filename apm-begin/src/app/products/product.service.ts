import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private productsUrl = 'api/products';
  private errorService = inject(HttpErrorService);
constructor(private http: HttpClient) {  
  
}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(() => console.log('http pipeline')),
        catchError(err => this.handleError(err))
      );
  }

  getProduct(id:Number){
    const productUrlWithId = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrlWithId)
    .pipe(
      tap(() => console.log('http get by id Service pipeline')),
      catchError(err => this.handleError(err))
    );
  }

  private handleError(err:HttpErrorResponse): Observable<never>{
   const formattedMsg = this.errorService.formatError(err);
   return throwError(() => formattedMsg);
  }
}
