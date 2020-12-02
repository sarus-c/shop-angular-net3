import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() product: IProduct = {
    id: 0,
    name: 'No product name',
    description: 'No product description',
    price: 0.0,
    pictureUrl: 'https://localhost:4200/assets/placeholder.png',
    productType: 'No Brand',
    productBrand: 'No Type',
  };

  constructor() { }

  ngOnInit(): void { }
}
