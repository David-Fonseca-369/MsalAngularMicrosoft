import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

//Material Angular 
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';


//Componente de redireccionamiento dedicado a controlar las redirecciones
import {MsalModule, MsalRedirectComponent, MsalGuard, MsalInterceptor} from '@azure/msal-angular';
import { PublicClientApplication, InteractionType} from '@azure/msal-browser';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [   
    BrowserModule, 
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    HttpClientModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: '51235a6b-90c9-468d-a2c9-82470338f139', // Application (client) ID from the app registration
        authority: 'https://login.microsoftonline.com/a8b43a93-b46b-4442-860c-8414d0df41b6', // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
        redirectUri: 'http://localhost:4200'// This is your redirect URI
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      }
    }), {
      interactionType : InteractionType.Redirect, //MSAL Guard Configuration
      authRequest: {
        scopes: ['user.read']
      }
    }, {
      interactionType : InteractionType.Redirect, //MSAL Interceptor Configuration
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ])
    })
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard //MsalGuard added as provider here
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
