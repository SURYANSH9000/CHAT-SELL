export class wishlist{
    _id:string;
    userId:string;
    productId:string;
    createdAt:Date;
    constructor(
        _id:string='',
        userId:string='',
        productId:string='',
        createdAt:Date=new Date()
    ){
        this._id=_id;
        this.userId=userId;
        this.productId=productId;
        this.createdAt=createdAt;
    }
}