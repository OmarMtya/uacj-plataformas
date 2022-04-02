import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { effects } from './store/effects/index';
import { appreducers } from './store/app.store';
import { HttpClientModule } from '@angular/common/http';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { SharedModule } from './components/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DesarrolloInstitucionalModule } from './components/desarrollo-institucional/desarrollo-institucional.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MsalGuard, MsalModule, MsalRedirectComponent, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE } from '@azure/msal-angular';
import { Configuration, InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '3a5ec684-86af-4e1b-be6e-e636b0b3ec6c',
      redirectUri: environment.redirectMSAL,
    },
    cache: {
      cacheLocation: 'localStorage'
    }
  })
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(appreducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot(),
    SharedModule,
    ReactiveFormsModule,
    MsalModule.forRoot(MSALInstanceFactory(), {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read']
      }
    }, {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ])
    }),
    DesarrolloInstitucionalModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }) // Marca un error si no lo importas en el módulo principal
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    // {
    //   provide: MSAL_INSTANCE,
    //   useFactory: MSALInstanceFactory
    // },
    MsalService,
    MsalGuard
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule { }


MsalModule.forRoot(new PublicClientApplication({
  auth: {
    clientId: 'Enter_the_Application_Id_Here',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: isIE,
  }
}), {
  interactionType: InteractionType.Redirect,
  authRequest: {
    scopes: ['user.read']
  }
}, {
  interactionType: InteractionType.Redirect,
  protectedResourceMap: new Map([
    ['https://graph.microsoft.com/v1.0/me', ['user.read']]
  ])
})
