import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-post-ad',
  templateUrl: './post-ad.component.html',
  styleUrls: ['./post-ad.component.scss']
})
export class PostAdComponent implements OnInit {
  postAdForm: FormGroup;
  images: string[] = [''];
  maxImages = 3;
  userId: string | null = '';

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.postAdForm = this.fb.group({
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
        houseNo: [''],
        street: [''],
        landmark: [''],
        state: [''],
        country: [''],
        pincode: ['']
      })
    });
    this.userId = localStorageService.getItem('userId');
  }

  ngOnInit(): void {}

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
    if (this.postAdForm.valid && this.userId) {
      // console.log('User Id', this.userId);
      const formData: any = new FormData();
      formData.append('category', this.postAdForm.get('category')?.value);
      formData.append('name', this.postAdForm.get('name')?.value);
      formData.append('description', this.postAdForm.get('description')?.value);
      formData.append('price', this.postAdForm.get('price')?.value);
      formData.append('details', JSON.stringify(this.postAdForm.get('details')?.value));
      formData.append('address', JSON.stringify(this.postAdForm.get('address')?.value));
      formData.append('sellerId', this.userId);

      this.images.forEach((image, index) => {
        if (image) {
          formData.append(`images`, this.dataURLtoFile(image, `image${index + 1}.jpg`));
        }
      });

      this.productService.addProduct(formData).subscribe(
        response => {
          this.toastr.success('Ad posted successfully');
          // console.log('Product added successfully:', response);
          this.router.navigate(['/']);
        },
        error => {
          console.error('Error adding product:', error);
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
