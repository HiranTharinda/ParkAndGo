import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthServiceService } from './auth-service.service';
import { LocalstorageService } from './localstorage.service';

import { FcmService } from './fcm.service';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
  emailVerified?:boolean;
}

interface Row {
  id: string;
  url : string;
  lat : string;
  lng : string;
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
    private fcm: FcmService,
    private auth : AuthServiceService,
    private storage : LocalstorageService
  ) {
    this.initializeApp();
  }

  private /*async*/ presentToast(message) {
    /*const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();*/
    console.log(message);
  }

  private notificationSetup(mail) {
    var mailsplitarray = mail.split('@');
    var mailsplit = mailsplitarray[mailsplitarray.length -1]
    this.fcm.getToken(mail);
    this.fcm.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          this.presentToast(msg.body);
        }
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.auth.user.subscribe( val => {
        this.user = val;
        this.notificationSetup(this.user.email);
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
