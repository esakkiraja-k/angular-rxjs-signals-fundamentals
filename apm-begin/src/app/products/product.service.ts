import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private productsUrl = 'api/products';

constructor(private http: HttpClient) {  
  
}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(() => console.log('http pipeline'))
      );
  }

  getProduct(id:Number){
    const productUrlWithId = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrlWithId)
    .pipe(
      tap(() => console.log('http get by id Service pipeline'))
    );
  }
}
