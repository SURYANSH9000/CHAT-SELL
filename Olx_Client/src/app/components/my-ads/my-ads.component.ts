import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-my-ads',
  templateUrl: './my-ads.component.html',
  styleUrls: ['./my-ads.component.scss']
})
export class MyAdsComponent implements OnInit {
  ads: Product[] = [];
  userId: number | undefined;
  selectedAdId: string | null = null;

  @ViewChild('paymentModal') paymentModal!: ElementRef;

  constructor(
    private productService: ProductService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = +this.localStorageService.getItem('userId')!;
    if (this.userId) {
      this.fetchUserAds();
    }
  }

  fetchUserAds() {
    if (this.userId !== undefined) {
      this.productService.getProductsByUserId(this.userId).subscribe(
        (products: Product[]) => {
          this.ads = products;
        },
        error => {
          console.error('Error fetching user ads:', error);
        }
      );
    }
  }

  updateAd(productId: string) {
    this.router.navigate([`/update-ad/${productId}`]);
  }

  onClick(productId: string) {
    this.router.navigate([`/product/${productId}`]);
  }

  sponsorAd(event: Event, productId: string): void {
    event.stopPropagation(); // Prevent the click from propagating to the card
    this.selectedAdId = productId;
    this.router.navigate(['/payment', this.selectedAdId]);
  }  

  handleSponsorshipConfirmed() {
    if (this.selectedAdId) {
      this.productService.sponsorAd(this.selectedAdId).subscribe(
        () => {
          alert('Your ad has been sponsored successfully!');
          this.fetchUserAds(); // Refresh the ads list
        },
        error => {
          console.error('Error sponsoring ad:', error);
        }
      );
    }
  }
  
  deleteAd(event: Event, productId: string): void {
    event.stopPropagation(); // Prevent the click from propagating to the card
    if (confirm('Are you sure you want to delete this ad?')) {
      this.productService.deleteProduct(productId).subscribe(
        () => {
          alert('Ad deleted successfully!');
          this.fetchUserAds(); // Refresh the ads list
        },
        error => {
          console.error('Error deleting ad:', error);
        }
      );
    }
  }
  
}
