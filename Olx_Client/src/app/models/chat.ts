export interface Message {
    text: string;
    sender: string; // senderId
  }
  
  export interface Chat {
    _id: string;
    participants: any[]; //loggedUserId, sellerId, productId order
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
  }
  