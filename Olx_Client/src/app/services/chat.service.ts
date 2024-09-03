import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Chat } from '../models/chat';
import { Product } from '../models/product';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'https://chat-sell-1.onrender.com';
  private chatSubject = new BehaviorSubject<Chat>({} as Chat);
  currentChat = this.chatSubject.asObservable();
  private socket: Socket;

  constructor(private http: HttpClient) {
    // Initialize Socket.io connection
    this.socket = io(environment.apiUrl);
  }

  // Method to get chat by participants (via HTTP)
  getChatByParticipants(participants: any[], messages: any): Observable<Chat> {
    return this.http.post<Chat>(`${this.baseUrl}/chats/participants`, { participants, messages })
      .pipe(
        catchError(error => {
          console.error('Error in getChatByParticipants:', error);
          return throwError(error);
        })
      );
  }

// Add this method in chat.service.ts
  getChatById(chatId: string): Observable<Chat> {
  return this.http.get<Chat>(`${this.baseUrl}/chats/${chatId}`)
    .pipe(
      catchError(error => {
        console.error('Error fetching chat by ID:', error);
        return throwError(error);
      })
    );
  }


  // Method to create a new chat (via HTTP)
  createChat(participants: any[], initialMessage: any): Observable<Chat> {
    console.log("Creating chat with initial message:", initialMessage);
    return this.http.post<Chat>(`${this.baseUrl}/chats`, { participants, initialMessage })
      .pipe(
        catchError(error => {
          console.error('Error in createChat:', error);
          return throwError(error);
        })
      );
  }

  // Method to send a message (via HTTP)
  sendMessage(chatId: string, message: any): Observable<any> {
    const roomId = chatId;  // Assuming roomId is the same as chatId
    console.log('Sending message:', message);
    console.log('Chat ID:', chatId);
    console.log('Room ID:', roomId);  // Added to verify the room ID is correctly set
    return this.http.put<any>(`${this.baseUrl}/chats/${chatId}/messages`, { chatId, roomId, message })
      .pipe(
        catchError(error => {
          console.error('Error in sendMessage:', error);
          return throwError(error);
        })
      );
  }  

  // Method to get all chats for a user, including associated products (via HTTP)
  getChatsWithProductsByUserId(userId: number): Observable<(Chat & { product: any })[]> {
    return this.http.get<(Chat & { product: any })[]>(`${this.baseUrl}/chats/user/${userId}`);
  }

  // Method to join a chat room using WebSocket
  joinChatRoom(chatId: string): void {
    console.log('Joining chat room:', chatId);
    this.socket.emit('joinChat', { chatId, userId: this.chatSubject.getValue().participants[0] });
  }

  // Method to send a message via WebSocket
  sendMessageViaSocket(chatId: string, message: any): void {
    const roomId = chatId;  // Assuming roomId is the same as chatId
    console.log('Sending message via socket:', message);
    console.log('Chat ID:', chatId);
    console.log('Room ID:', roomId);  // Added to verify the room ID is correctly set
    this.socket.emit('sendMessage', { chatId, roomId, message });
    console.log('Message sent via socket:', message);
  }

  // Method to receive messages in real-time via WebSocket
  receiveMessage(callback: (message: any) => void): void {
    this.socket.on('receiveMessage', callback);
  }

  // Method to join a chat (via HTTP) and update the current chat state
  joinChat(chatId: string): void {
    this.http.get<Chat>(`${this.baseUrl}/chats/${chatId}`).subscribe(chat => {
      this.chatSubject.next(chat);
    });
  }

  // Method to get product details by ID (via HTTP)
  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${productId}`);
  }
}
