import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../services/api';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
  encapsulation: ViewEncapsulation.None   // ✅ THIS IS THE KEY
})
export class ProductDetails implements OnInit {

  product: any = null;
  activeImageIndex = 0;
  descriptionPoints: string[] = [];

  constructor(private route: ActivatedRoute, private api: Api) { }

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(productId);
  }

  loadProduct(productId: number) {
    this.api.get(`/product/get/${productId}`).subscribe({
      next: (res: any) => {
        const images = [
          res.imageUrl,
          res.imageUrl1,
          res.imageUrl2,
          res.imageUrl3,
          res.imageUrl4,
          res.imageUrl5,
          res.imageUrl6,
          res.imageUrl7
        ].filter(Boolean);

        this.product = {
          ...res,
          images
        };

        this.descriptionPoints = res.productDescription
          ? res.productDescription
            .split(/\r?\n/)
            .map((d: string) => d.trim())
            .filter(Boolean)
          : [];

        this.activeImageIndex = 0;
      },
      error: err => console.error('Failed to load product', err)
    });
  }

  nextImage() {
    if (this.product?.images?.length) {
      this.activeImageIndex =
        (this.activeImageIndex + 1) % this.product.images.length;
    }
  }

  prevImage() {
    if (this.product?.images?.length) {
      this.activeImageIndex =
        (this.activeImageIndex - 1 + this.product.images.length) %
        this.product.images.length;
    }
  }
}
