import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-ad',
  templateUrl: './update-ad.component.html',
  styleUrls: ['./update-ad.component.scss']
})

export class UpdateAdComponent implements OnInit {
  updateAdForm: FormGroup;
  images: string[] = [];
  maxImages = 3;
  productId: string;
  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productId = this.route.snapshot.paramMap.get('id') as string;

    this.updateAdForm = this.fb.group({
      category: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      details: this.fb.group({
        type: ['', Validators.required],
        ownerType: ['', Validators.required],
        year: ['', Validators.required],
        otherDetails: ['']
      }),
      address: this.fb.group({
        houseNo: ['', Validators.required],
        street: ['', Validators.required],
        landmark: ['',Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
      })
    });
  }

  ngOnInit(): void {
    this.productService.getProductById(this.productId).subscribe(product => {
      console.log('Fetched product:', product); // Debugging line
      console.log('address:', product.address); // Debugging line
      // Check if product.details and product.address are strings
      const details = typeof product.details === 'string' ? JSON.parse(product.details) : product.details;
      const address = typeof product.address === 'string' ? JSON.parse(product.address) : product.address;

      // Patch the main form fields
      this.updateAdForm.patchValue({
        category: product.category || '',
        name: product.name || '',
        description: product.description || '',
        price: product.price || ''
      });

      // Patch the nested details form group
      this.updateAdForm.get('details')?.patchValue({
        type: details.type || '',
        ownerType: details.ownerType || '',
        year: details.year || '',
        otherDetails: details.otherDetails || ''
      });

      // Patch the nested address form group
      this.updateAdForm.get('address')?.patchValue({
        houseNo: address.houseNo || '',
        street: address.street || '',
        landmark: address.landmark || '',
        state: address.state || '',
        country: address.country || '',
        pincode: address.pincode || ''
      });
      console.log("imgs:", product.images); // Debugging line

      // Populate the images array
      this.images = (product.images || []).map(image => 
        `https://res.cloudinary.com/dkrnlzsvw/image/upload/v1725272246/${image}.png`
      );
    });
  }

  onFileChange(event: any, index: number): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.images[index] = reader.result as string;
        if (this.images.length < this.maxImages && !this.images[this.images.length - 1]) {
          this.images.push('');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    this.images.splice(index, 1); 
    if (this.images.length < this.maxImages && !this.images.includes('')) {
      this.images.push(''); 
    }
  }

  onSubmit(): void {
    if (this.updateAdForm.valid) {
      const formData: FormData = new FormData();
      formData.append('category', this.updateAdForm.get('category')?.value);
      formData.append('name', this.updateAdForm.get('name')?.value);
      formData.append('description', this.updateAdForm.get('description')?.value);
      formData.append('price', this.updateAdForm.get('price')?.value);
      formData.append('details', JSON.stringify(this.updateAdForm.get('details')?.value));
      formData.append('address', JSON.stringify(this.updateAdForm.get('address')?.value));
      
      this.images.forEach((image, index) => {
        if (image && image.startsWith('data:')) { // Check if image is a valid data URL
          formData.append('images', this.dataURLtoFile(image, `image${index + 1}.jpg`));
        }
      });

      this.productService.updateProduct(this.productId, formData).subscribe(
        response => {
          console.log('Product updated successfully:', response);
          this.toastr.success('Product updated successfully');
          this.router.navigate(['/product', this.productId]);
        },
        error => {
          console.error('Error updating product:', error);
        }
      );
    }
  }

  dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
