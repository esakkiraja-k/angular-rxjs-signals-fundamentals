import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { EMPTY, Subscription,catchError,pipe,tap } from 'rxjs';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe,AsyncPipe]
})
export class ProductDetailComponent //implements OnChanges, OnDestroy 
{

  /**
   *
   */
  constructor(private productSvc: ProductService,private cartSvc: CartService) {


  }
  //sub!: Subscription;
  // Just enough here for the template to compile
  //@Input() productId: number = 0;
  errorMessage = '';

  // Product to display
  //product: Product | null = null;
  product$ = this.productSvc.product$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  // Set the page title
  //pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
  pageTitle = 'details ';
  addToCart(product: Product) {
    this.cartSvc.addToCart(product);
  }

  // ngOnChanges(changes: SimpleChanges): void {

  //   const id = changes['productId'].currentValue;
  //   if (id) {
  //     this.sub = this.productSvc.getProduct(id)
  //       .pipe(
  //       //  tap(data => console.log(data))
  //       catchError(err => {
  //         this.errorMessage = err;
  //         return EMPTY;
  //       })
  //       )
  //       .subscribe(
  //         p => this.product = p
  //       );
  //   }
  // }

  // ngOnDestroy(): void {
  //   if(this.sub){
  //     this.sub.unsubscribe();
  //   }
  // }

}
