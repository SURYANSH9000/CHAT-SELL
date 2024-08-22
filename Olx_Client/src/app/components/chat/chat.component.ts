import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { Chat, Message } from '../../models/chat';
import { LocalStorageService } from 'src/app/services/local-storage-service.service';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

export interface ExtendedChat extends Chat {
  productImage: string;
  sellerName: string;
  productName: string;
  productDescription: string;
  unreadCount: number;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chats: ExtendedChat[] = [];
  selectedChat: ExtendedChat | null = null;
  newMessage: string = '';
  loggedUserId: string = '';
  
  private chatQueues: { [chatId: string]: Message[] } = {}; 
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private productService: ProductService,
    private localStorageService: LocalStorageService,
    private socket: Socket,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedUserId = this.localStorageService.getItem('userId') || '';
    this.loadChats();
  
// Handle receiving a message
  this.socket.on('receiveMessage', (data: { chatId: string; message: Message }) => {
    const { chatId, message } = data;
    const chat = this.chats.find(c => c._id === chatId);

    if (chat) {
      chat.messages.push(message); // Add the message to the chat

      if (this.selectedChat && this.selectedChat._id === chatId) {
        // If the chat is selected, add the message to the selected chat
        this.selectedChat.messages = chat.messages;
      } else {
        console.log('Chat not found, reloading chats...');
        window.location.reload();
        // If the chat is not selected, increase the unread count
        chat.unreadCount = (chat.unreadCount || 0) + 1;
        console.log('Unread count:', chat.unreadCount);
      }
    } else {
      this.loadChats();
    }
  });

}
  
  
  ngOnDestroy(): void {
    this.socket.removeAllListeners('receiveMessage');
  }

  loadChats(): void {
    this.chatService.getChatsWithProductsByUserId(Number(this.loggedUserId)).subscribe(chats => {
      chats.forEach(chat => {
        let k = 1;
        if (chat.participants[1] == this.loggedUserId) {
          k = 0;
        }
        this.userService.getUserById(chat.participants[k]).subscribe(user => {
          (chat as unknown as ExtendedChat).sellerName = user.name; // Fetch seller name
        });

        this.productService.getProductById(chat.participants[2]).subscribe(product => {
          (chat as unknown as ExtendedChat).productName = product.name; // Fetch product name
          (chat as unknown as ExtendedChat).productDescription = product.description; // Fetch product description
          (chat as unknown as ExtendedChat).productImage ='http://localhost:3000/assets/productImages/'+ product.name +'/' + product.images[0]; // Fetch product image
        },
        error => {
          console.error('Error fetching product:', error);
          // If product not found or other error, then name is 'Product Expired'
          (chat as unknown as ExtendedChat).productName = 'Product Expired';
          (chat as unknown as ExtendedChat).productDescription = 'Expired Product';
        });
        (chat as unknown as ExtendedChat).unreadCount = 0;
      });
      this.chats = chats as unknown as ExtendedChat[];
    });
  }

  selectChat(chat: ExtendedChat): void {
    console.log('Selected chat:', chat);
    chat.unreadCount = 0;
    // Ensure messages is an array
    if (!Array.isArray(chat.messages)) {
      chat.messages = [chat.messages];
    }

    this.selectedChat = chat;
    // console.log('Selected chat participants:', this.selectedChat.participants);
    // console.log('Selected chat messages:', this.selectedChat.messages);
    this.joinChatRoom(chat._id);
  }

  
  joinChatRoom(chatId: string): void {
    this.socket.emit('joinChat', { chatId, userId: this.loggedUserId });
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedChat) {
      const message: Message = { text: this.newMessage, sender: this.loggedUserId };
      this.chatService.sendMessage(this.selectedChat._id, message).subscribe(() => {
        this.socket.emit('sendMessage', { chatId: this.selectedChat!._id,roomId: this.selectedChat!._id, message });
        // this.selectedChat!.messages.push(message);
        this.newMessage = '';
      });
    }
  }

  onClick(): void {
    this.router.navigate(['/product/' + this.selectedChat!.participants[2]]);
  }
}
