import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit {
  adId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.adId = this.route.snapshot.paramMap.get('adId');
  }

  confirmSponsorship() {
    if (this.adId) {
      this.productService.sponsorAd(this.adId).subscribe(
        response => {
          this.toastr.success('Your ad has been sponsored successfully!');
          // alert('Your ad has been sponsored successfully!');
          this.router.navigate(['/my-ads']); // Redirect back to My Ads
        },
        error => {
            // alert('This ad is already sponsored.');
            this.toastr.error('This ad is already sponsored.');
        }
      );
    }
  }

  cancel() {
    this.router.navigate(['/my-ads']); // Redirect back to My Ads
  }
}
