import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AuthServiceService } from './auth-service.service';

import { LoggedInGuard } from './loggedin.guard';
import { AuthGuard } from './auth.guard';
import { VerificationGuard } from './verification.guard';

import { IonicStorageModule } from '@ionic/storage';

import { environment } from '../environments/environment';

import { LocalstorageService } from './localstorage.service';
import { DbService } from './db.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';

import { Firebase } from '@ionic-native/firebase/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    IonicStorageModule.forRoot(),
    AngularFirestoreModule],
  providers: [
    StatusBar,
    SplashScreen,
    AuthServiceService ,
    AuthGuard,
    DbService,
    Firebase,
    Geolocation,
    LocalstorageService,
    LoggedInGuard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
