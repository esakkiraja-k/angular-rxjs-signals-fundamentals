import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
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

  private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
  readonly productSelected$ = this.productSelectedSubject.asObservable();

constructor(private http: HttpClient) {  
  
}

productSelected(selectedProductId: number) : void{
  this.productSelectedSubject.next(selectedProductId);
}
readonly products$ = this.http.get<Product[]>(this.productsUrl)
.pipe(
  tap(p => console.log(JSON.stringify(p))),
  shareReplay(1),
  //tap(() => console.log('After Share replay')),
  catchError(err => this.handleError(err))
); 
 readonly product1$ = this.productSelected$
 .pipe(
  filter(Boolean),
  switchMap( id =>{
    const productUrlWithId = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrlWithId)
    .pipe(
      tap(() => console.log('http get by id Service pipeline')),
      switchMap(product  => this.getProductWithReviews(product)),
      catchError(err => this.handleError(err))
    );
  })
 );
  product$ = combineLatest([
    this.productSelected$,
    this.products$
  ]).pipe(
    map(([selectedProductId, products]) =>
      products.find(product => product.id === selectedProductId)
    ),
    filter(Boolean),
    switchMap(product => this.getProductWithReviews(product)),
    tap(x => console.log(x)),
    catchError(err => this.handleError(err))
  );
  // getProduct(id:Number):Observable<Product>{
  //   const productUrlWithId = this.productsUrl + '/' + id;
  //   return this.http.get<Product>(productUrlWithId)
  //   .pipe(
  //     tap(() => console.log('http get by id Service pipeline')),
  //     switchMap(product  => this.getProductWithReviews(product)),
  //     tap(x => console.log(x)),
  //     catchError(err => this.handleError(err))
  //   );
  // }

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
