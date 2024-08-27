import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service'; // Import WishlistService
import { Product } from '../../models/product';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  page = 1;
  limit = 20;
  hasMore = true;
  excludeUserId: number | undefined;
  searchQuery: string | undefined;
  locationQuery: string | undefined;

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService, 
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    this.excludeUserId = +this.localStorageService.getItem('userId')!;
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['searchQuery'];
      this.locationQuery = params['locationQuery'] || 'India';
      this.page = 1;
      this.products = [];
      this.loadProducts();
    });
  }

  loadProducts() {
    const userId = this.excludeUserId ? this.excludeUserId.toString() : undefined;
    this.productService.searchProducts(this.searchQuery || '',this.locationQuery || '', this.page, this.limit, userId).subscribe(
      (newProducts: Product[]) => {
        console.log('Fetched products:', newProducts);
        this.products = [...this.products, ...newProducts];
        if (newProducts.length < this.limit) {
          this.hasMore = false;
        }
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  viewProductDetails(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  loadMore() {
    this.page++;
    this.loadProducts();
  }

  addToWishlist(productId: string, event: Event) {
    event.stopPropagation(); 
    const userId = this.localStorageService.getItem('userId');
    if (!userId) {
      this.toastr.error('Please log in to add products to your wishlist'); 
      // alert('Please log in to add products to your wishlist');
      console.error('User is not logged in');
      return;
    }
    this.wishlistService.addToWishlist(userId, productId).subscribe(
      response => {
        this.toastr.success('Product has been added to your wishlist'); // Display success message
        console.log('Product added to wishlist:', response);
        // alert('Product added to wishlist');
      },
      error => {
        this.toastr.error('Product already in wishlist'); 
        console.error('Error adding product to wishlist or Product already in wishlist:', error);
      }
    );
  }
}