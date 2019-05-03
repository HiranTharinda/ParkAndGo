import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AuthServiceService } from './auth-service.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoggedInGuard } from './loggedin.guard';
import { AuthGuard } from './auth.guard';
import { VerificationGuard } from './verification.guard';
import { Facebook } from '@ionic-native/facebook/ngx'
import { IonicStorageModule } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { environment } from '../environments/environment';

import { LocalstorageService } from './localstorage.service';
import { DbService } from './db.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';

import { Firebase } from '@ionic-native/firebase/ngx';

import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { MockComponent } from './mock/mock.component';

@NgModule({
  declarations: [AppComponent, MockComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    AngularFirestoreModule],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    Facebook,
    AuthServiceService ,
    AuthGuard,
    DbService,
    Firebase,
    Geolocation,
    Network,
    LocationAccuracy,
     BackgroundMode,
    LocalstorageService,
    LoggedInGuard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
