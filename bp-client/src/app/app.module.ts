import { BrowserModule } from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AlertComponent } from './alert/alert.component';
import {UserService} from './services/user.service';
import {AlertService} from './services/alert.service';
import {ErrorInterceptorProvider} from './guards/error.interceptor';
import {JwtInterceptorProvider} from './guards/jwt.interceptor';
import {AuthenticationService} from './services/authentication.service';
import {AuthGuard} from './guards/auth.guard';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {HomeModule} from './home/home.module';
import {SimpleLoaderModule} from './simple-loader/simple-loader.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AlertComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    SimpleLoaderModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    HomeModule,
    AppRoutingModule,
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    JwtInterceptorProvider,
    ErrorInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
