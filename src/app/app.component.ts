import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthServiceService } from './auth-service.service';
import { LocalstorageService } from './localstorage.service';

import { FcmService } from './fcm.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

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
  settings : any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FcmService,
    private auth : AuthServiceService,
    private storage : LocalstorageService,
    private geolocation: Geolocation,
    private localNotifications: LocalNotifications
  ) {
    this.storage.provide().then(settings => {
      this.settings = settings;
    })
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
    this.fcm.getToken(mailsplit);
    this.fcm.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          console.log('msg recieved');
          console.log(msg)
          this.geolocation.getCurrentPosition().then((resp) => {
            var distance = this.caldistance(resp.coords.latitude,resp.coords.longitude,msg.lat,msg.lng)
            console.log(distance)
            if(distance < this.settings.currrad){
              this.localNotifications.schedule({
                id: 1,
                text: 'New Location Pop up'
              });
            }
          });

        }
      });
  }
  deg2rad(deg) {
   return deg * (Math.PI/180)
  }

  caldistance(lat1,lon1,lat2,lon2){
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
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
