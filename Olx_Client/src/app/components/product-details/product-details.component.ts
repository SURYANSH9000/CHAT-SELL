import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { LocalStorageService } from '../../services/local-storage-service.service'; 
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  currentImage: string | undefined;
  currentImageIndex = 0;
  loggedUserId!: string;
  userName!: string;
  map: L.Map | undefined;
  isModalOpen = false;
  modalImage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private chatService: ChatService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loggedUserId = this.localStorageService.getItem('userId')!;
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('Product ID:', productId);
    if (productId) {
      this.productService.getProductById(productId).subscribe(
        (product: Product) => {
          this.product = product;
          this.currentImage = 'http://localhost:3000/assets/productImages/' + product.name + '/' + product.images[0];
          product.address = JSON.parse(product.address as unknown as string);
          console.log('Product details:', typeof(this.product.details));
          console.log('Product address:', typeof(this.product.address));
          console.log('Product address:', this.product.address);
          this.initMap(this.product.address);
        },
        error => {
          console.error('Error fetching product:', error);
        }
      );
    }
    if (this.loggedUserId) {
      this.userService.getUserById(Number(this.loggedUserId)).subscribe(
        (user) => {
          this.userName = user.name;
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    }
  }

  changeImage(index: number): void {
    if (this.product) {
      this.currentImageIndex = index;
      this.currentImage = 'http://localhost:3000/assets/productImages/' + this.product.name + '/' + this.product.images[index];
    }
  }

  openModal(image: string): void {
    this.modalImage = image;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  chatWithSeller(): void {
    const loggedUserId = this.localStorageService.getItem('userId');
    if (loggedUserId && this.product) {
      const participants = [(loggedUserId), (this.product.sellerId), this.product._id];
      const productId = this.product._id;
      console.log('Participants are:', participants);
      console.log('Product ID:', productId);
      const initialMessage = { text: `Hi, my name is ${this.userName}. I am interested in your Ad`, sender: participants[0] };
      console.log('Initial message:', initialMessage);
      this.chatService.getChatByParticipants(participants, initialMessage).subscribe(
        (existingChat) => {
          if (existingChat) {
            console.log('Chat found:', existingChat);
            this.router.navigate(['/chats',loggedUserId], {
            });
          }
        },
        (error) => {
          console.error('Error checking for chat:', error);
        }
      );
    } else {
      alert('Please login to chat with the seller');
    }
  }

  async initMap(address: any): Promise<void> {
    const fullAddress = `${address.houseNo}, ${address.street}, ${address.landmark || ''}, ${address.state}, ${address.country}, ${address.pincode}`;
    let latitude: number;
    let longitude: number;
    console.log('Formatted address:', fullAddress);
  
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&addressdetails=1&limit=1`);
      const data = await response.json();
      console.log('Coordinates data:', data);
      if (data.length > 0) {
        const { lat, lon } = data[0];
        latitude = parseFloat(lat);
        longitude = parseFloat(lon);
        console.log('Coordinates found:', latitude, longitude);
      } else {
        throw new Error(`No coordinates found for the address: ${fullAddress}`);
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);

      try {
        const fallbackQuery = `${address.pincode}, ${address.country}`;
        const fallbackResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackQuery)}&limit=1`);
        const fallbackData = await fallbackResponse.json();
  
        if (fallbackData.length > 0) {
          const { lat, lon } = fallbackData[0];
          latitude = parseFloat(lat);
          longitude = parseFloat(lon);
          console.log('Fallback coordinates found based on pincode and country:', latitude, longitude);
        } else {
          throw new Error('No coordinates found for the fallback pincode and country.');
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        this.showErrorMessage();
        return;
      }
    }
  
    // Initialize the map with the fetched coordinates
    if (this.map) {
      this.map.remove();
    }
  
    this.map = L.map('map').setView([latitude, longitude], 15);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  
    L.marker([latitude, longitude]).addTo(this.map)
      .bindPopup('Product Location')
      .openPopup();
  }
  
  showErrorMessage(): void {
    const minimapDiv = document.getElementById('map');
    if (minimapDiv) {
      minimapDiv.innerHTML = '<p>Location could not be determined for the given address.</p>';
      minimapDiv.style.display = 'flex';
      minimapDiv.style.justifyContent = 'center';
      minimapDiv.style.alignItems = 'center';
      minimapDiv.style.height = '200px';
      minimapDiv.style.backgroundColor = '#f8d7da';
      minimapDiv.style.color = '#721c24';
      minimapDiv.style.border = '1px solid #f5c6cb';
      minimapDiv.style.borderRadius = '5px';
    }
  }
  
  viewSeller(): void {
    console.log('View Seller button clicked');
    if (this.product && this.product.sellerId) {
      this.router.navigate(['/view-profile', this.product.sellerId]);
    } else {
      console.error('Seller ID is not available.');
    }
  }  

  copyProductLink(): void {
    const productLink = `${window.location.origin}/product/${this.product._id}`;
    navigator.clipboard.writeText(productLink).then(() => {
      this.toastr.success('Product link copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy product link:', err);
    });
  }
}  