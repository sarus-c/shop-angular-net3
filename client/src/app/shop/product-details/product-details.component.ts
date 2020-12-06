import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: IProduct = {
    id: 0,
    name: 'No name',
    description: 'No description',
    price: 0.00,
    pictureUrl: '',
    productType: '',
    productBrand: ''
};

  constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const productId = parseInt(this.activatedRoute.snapshot.paramMap.get('id') || "", 10);
    this.shopService.getProduct(productId).subscribe(
      product => {
        this.product = product;
      }, error => {
        console.log(error);
      }
    );
  }
}
