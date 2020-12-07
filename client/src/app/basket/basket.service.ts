import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<any>(null);
  basket$ = this.basketSource.asObservable();
  private basketToatalSource = new BehaviorSubject<any>(null);
  basketTotal$ = this.basketToatalSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id)
    .pipe(
      map((basket: any) => {
        this.basketSource.next(basket);
        this.calulateTotals();
      })
    );
  }

  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe(
      (response: any) => {
        this.basketSource.next(response);
        this.calulateTotals();
      }, error => {
        console.log(error);
      }
    )
  }

  getCurrentBasketvalue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketvalue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketvalue();
    const foundItemIndex = basket.items.findIndex((i: any) => i.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketvalue();
    const foundItemIndex = basket.items.findIndex((i: any) => i.id === item.id);

    if(basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketvalue();
    console.log(basket);

    if(basket.items.some((x: any) => x.id === item.id)) {
      basket.items = basket.items.filter((i: any) => i.id !== item.id);

      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }  
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(
      () => {
        this.basketSource.next(null);
        this.basketToatalSource.next(null);
        localStorage.removeItem('basket_id');
      }, error => {
        console.log(error);
      }
    )
  }

  private calulateTotals() {
    const basket = this.getCurrentBasketvalue();
    const shipping = 0;
    const subtotal = basket.items.reduce((a: any, b: any) => (b.price * b.quantity) + a, 0);
    const total  = subtotal + shipping;
    this.basketToatalSource.next({shipping, total, subtotal});
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);

    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }

    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }
}
