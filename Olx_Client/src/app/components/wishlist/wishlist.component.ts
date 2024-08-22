import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Product } from '../../models/product';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistProducts: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  onClick(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  loadWishlist() {
    const userId = this.localStorageService.getItem('userId');
    if (userId) {
      this.wishlistService.getWishlistByUserId(userId).subscribe(
        (wishlist: string[]) => {
          wishlist.forEach(productId => {
            this.productService.getProductById(productId).subscribe(
              (product: Product) => {
                this.wishlistProducts.push(product);
              },
              error => {
                console.error('Error fetching product:', error);
              }
            );
          });
        },
        error => {
          console.error('Error fetching wishlist:', error);
        }
      );
    } else {
      console.error('User is not logged in');
    }
  }

  removeFromWishlist(productId: string) {
    const userId = this.localStorageService.getItem('userId');
    if (userId) {
      this.wishlistService.removeFromWishlist(userId, productId).subscribe(
        response => {
          this.toastr.success('Product removed from wishlist');
          this.wishlistProducts = this.wishlistProducts.filter(product => product._id !== productId);
        },
        error => {
          this.toastr.error('Failed to remove product from wishlist');
          console.error('Error removing product from wishlist:', error);
        }
      );
    } else {
      console.error('User is not logged in');
    }
  }
}
