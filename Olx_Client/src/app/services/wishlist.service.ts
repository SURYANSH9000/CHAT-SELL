import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private baseUrl = 'https://chat-sell-1.onrender.com/wishlist'; // Adjust to your API URL

  constructor(private http: HttpClient) {}

  addToWishlist(userId: string, productId: string): Observable<any> {
    console.log('Adding to wishlist:', userId, productId);
    return this.http.post<any>(`${this.baseUrl}/add`, { userId, productId });
  }
  getWishlistByUserId(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/${userId}`);
  }

  removeFromWishlist(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}/${productId}`);
  }
}
