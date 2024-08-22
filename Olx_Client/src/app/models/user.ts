import { Address } from "./address";
import { Chat } from "./chat";

export class User {
    _id: number;
    name: string;
    description: string;
    phoneNumber: number;
    email: string;
    password: string;
    dob: Date;
    address: Address;
    profilePic: any;
    likedProd: string[];
    myProd: string[];
    createdAt: Date;
    updatedAt: Date;
    chat: Chat[];

    constructor(
        _id: number = 0,
        name: string = '',
        description: '',
        phoneNumber: number = 0,
        email: string = '',
        password: string = '',
        dob: Date = new Date(),
        address: Address , 
        profilePic: any = '',
        likedProd: string[] = [],
        myProd: string[] = [],
        createdAt: Date = new Date(),
        updatedAt: Date = new Date(),
        chat: Chat[] = []
    ) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
        this.dob = dob;
        this.address = address;
        this.profilePic = profilePic;
        this.likedProd = likedProd;
        this.myProd = myProd;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.chat = chat;
    }
}
