import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import * as bootstrap from 'bootstrap';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  user: User | undefined;
  currentUserId: number | undefined;
  searchQuery: string = '';
  locationQuery: string = '';
  @ViewChild('loginModal', { static: false }) loginModal!: ElementRef;
  @ViewChild('registerModal', { static: false }) registerModal!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private productService: ProductService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.localStorageService.getItem('token');

    const userId = this.localStorageService.getItem('userId');
    if (userId) {
      this.currentUserId = +userId; // Ensure currentUserId is a number
      if (this.currentUserId) {
        this.userService.getUserById(this.currentUserId).subscribe(user => {
          this.user = user; // Assign user to the user property
        });
      }
    }
  }
  logout() {
    this.localStorageService.removeItem('token');
    this.localStorageService.removeItem('userId'); // Remove user ID
    this.isLoggedIn = false;
    this.currentUserId = undefined;
    this.user = undefined;
    window.location.reload();
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalId === 'loginModal') {
      bootstrap.Modal.getInstance(this.loginModal.nativeElement)?.hide();
    } else if (modalId === 'registerModal') {
      bootstrap.Modal.getInstance(this.registerModal.nativeElement)?.hide();
    }
  }

  editProfile(userId?: number): void {
    console.log(this.user);
    userId = userId || this.user?._id;
    console.log(this.user?.name);
    
    if (userId !== undefined) {
      console.log(`Navigating to /edit-profile/${userId}`);
      this.router.navigate([`/edit-profile/${userId}`])
        .then(success => {
          if (success) {
            console.log('Navigation successful');
          } else {
            console.error('Navigation failed');
          }
        })
        .catch(err => console.error('Navigation error:', err));
    } else {
      console.error('User ID is undefined');
    }
  }
  

  myAds() {
    if (this.currentUserId !== undefined) {
      this.router.navigate([`/my-ads`]);
    } else {
      console.error('Current user ID is not defined');
      this.toastr.error('Please login to view your ads');
    }
  }

  myWishlist() {
    if (this.currentUserId !== undefined) {
      this.router.navigate([`/wishlist`]);
    } else {
      console.error('Current user ID is not defined');
      this.toastr.error('Please login to view your wishlist');
    }
  }

  postAd() {
    if (this.currentUserId !== undefined) {
      this.router.navigate([`/post-ad`]);
    }
    else {
      console.error('Current user ID is not defined');
      this.toastr.error('Please login to post an ad');
    }
  }
  
  search() {
    this.searchQuery = this.searchQuery.trim();
    if (this.searchQuery || this.locationQuery) {
      this.router.navigate(['/products'], { 
        queryParams: { 
          searchQuery: this.searchQuery, 
          locationQuery: this.locationQuery || 'India'
        } 
      });
    }
  }

  searchByLocation() {
    this.locationQuery = this.locationQuery.trim();
    if (this.locationQuery || this.searchQuery) {
      this.router.navigate(['/products'], { 
        queryParams: { 
          locationQuery: this.locationQuery, 
          searchQuery: this.searchQuery
        } 
      });
    }
  }

  onChat(){
    this.router.navigate(['/chats',this.currentUserId]);
  }
}
