import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpInterceptor } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContentComponent } from './components/content/content.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from './services/local-storage-service.service';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { PostAdComponent } from './components/post-ad/post-ad.component';
import { MyAdsComponent } from './components/my-ads/my-ads.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ChatComponent } from './components/chat/chat.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // import BrowserAnimationsModule
import { ToastrModule } from 'ngx-toastr';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { MatBadgeModule } from '@angular/material/badge';
import { UpdateAdComponent } from './components/update-ad/update-ad.component';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';
import { ErrorComponent } from './components/error/error.component'; // import MatBadgeModule
const config: SocketIoConfig = { url: 'https://chat-sell-1.onrender.com', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContentComponent,
    FooterComponent,
    EditProfileComponent,
    ViewProfileComponent,
    PostAdComponent,
    MyAdsComponent,
    ProductListComponent,
    LoginComponent,
    RegisterComponent,
    ProductDetailsComponent,
    ChatComponent,
    WishlistComponent,
    UpdateAdComponent,
    PaymentModalComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }), 
    MatBadgeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    LocalStorageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
