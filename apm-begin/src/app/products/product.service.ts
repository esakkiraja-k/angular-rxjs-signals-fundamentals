import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private productsUrl = 'api/products';
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);
constructor(private http: HttpClient) {  
  
}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(() => console.log('http pipeline')),
        catchError(err => this.handleError(err))
      );
  }

  getProduct(id:Number):Observable<Product>{
    const productUrlWithId = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrlWithId)
    .pipe(
      tap(() => console.log('http get by id Service pipeline')),
      //map(product  => this.getProductWithReviews(product)),
      tap(x => console.log(x)),
      catchError(err => this.handleError(err))
    );
  }

  private getProductWithReviews(Product:Product): Observable<Product>{
    if(Product.hasReviews){
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(Product.id))
      .pipe(
        map(reviews => ({...Product,reviews} as Product))
    )
    }else{
        return of(Product);
    }
  }
  private handleError(err:HttpErrorResponse): Observable<never>{
   const formattedMsg = this.errorService.formatError(err);
   return throwError(() => formattedMsg);
  }
}
