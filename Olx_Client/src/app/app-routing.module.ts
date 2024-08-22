import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { PostAdComponent } from './components/post-ad/post-ad.component';
import { MyAdsComponent } from './components/my-ads/my-ads.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ChatComponent } from './components/chat/chat.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { UpdateAdComponent } from './components/update-ad/update-ad.component';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';
import { AuthGuard } from './services/auth.guard';
import { ErrorComponent } from './components/error/error.component';

const routes: Routes = [
  { path: 'edit-profile/:id', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'view-profile/:id', component: ViewProfileComponent },
  { path: 'post-ad', component: PostAdComponent, canActivate: [AuthGuard] },
  { path: 'my-ads', component: MyAdsComponent, canActivate: [AuthGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: '', component: ProductListComponent },
  { path: 'home', component: ProductListComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'chats/:userId', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'chats', component: ChatComponent, canActivate: [AuthGuard] },
  { path : 'update-ad/:id', component: UpdateAdComponent, canActivate: [AuthGuard] },
  { path: 'payment/:adId', component: PaymentModalComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
