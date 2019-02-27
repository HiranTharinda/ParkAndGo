import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthServiceService } from './auth-service.service';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
  emailVerified?:boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['appcomponent.page.scss']
})
export class AppComponent {

  user: User = {
    uid : "",
    email : "",
    photoURL : "",
    displayName : "",
    favoriteColor : "",
    emailVerified: false
  };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth : AuthServiceService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.auth.user.subscribe( val => {
        this.user = val;
        if(val == null ){
          this.user = {
            uid : "",
            email : "",
            photoURL : "",
            displayName : "",
            favoriteColor : "",
            emailVerified: false
          }
        }
      });
    });
  }
}
