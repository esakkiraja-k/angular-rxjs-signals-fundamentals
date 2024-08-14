import { computed, effect, Injectable, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<CartItem[]>([]);
  
  cartCount = computed(() => this.cartItems()
          .reduce((accQty,item) => accQty + item.quantity,0)
        );

subTotal = computed(() => this.cartItems())        
  eLength = effect(() => console.log('cart array len', this.cartItems().length));

  addToCart(product:Product): void {
    this.cartItems.update( items => [...items,{product,quantity:1 }]);
  }
}
