import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthServiceService } from './auth-service.service';
import { LocalstorageService } from './localstorage.service';

import { FcmService } from './fcm.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@ionic-native/network/ngx';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
  emailVerified?: boolean;
}

interface Row {
  id: string;
  url: string;
  lat: string;
  lng: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['appcomponent.page.scss']
})
export class AppComponent {

  user: User = {
    uid : '',
    email : '',
    photoURL : '',
    displayName : '',
    favoriteColor : '',
    emailVerified: false
  };
  settings : any;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FcmService,
    private auth: AuthServiceService,
    private storage: LocalstorageService,
    private geolocation: Geolocation,
    private network: Network,
    private localNotifications: LocalNotifications
  ) {
    this.storage.provide().then(settings => {
      this.settings = settings;
    })
    this.initializeApp();
  }

  private presentToast(message) {

    console.log(message);
  }

  logout(){
    var mailsplitarray =this.user.email.split('@');
    var mailsplit = mailsplitarray[mailsplitarray.length - 1];
    this.fcm.ManualunsubPublic(mailsplit);
    this.fcm.ManualunsubPriv(mailsplit);
    this.storage.savetodb();
  }

  closemenu(){
    this.menu.close();
  }

  // Setup notifications when loading up the application
  private notificationSetup(mail) {
    // Find domain of the email
    var mailsplitarray = mail.split('@');
    var mailsplit = mailsplitarray[mailsplitarray.length - 1];
    // Pass data to fcm service to create notifications
    console.log(mailsplit)
    this.fcm.getToken(mailsplit);

    // When recieving notifcations display it only if it is within the radius specified by the user
    this.fcm.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          console.log('msg recieved');
          console.log(msg)
          this.geolocation.getCurrentPosition().then((resp) => {
            var distance = this.caldistance(resp.coords.latitude, resp.coords.longitude, msg.lat, msg.lng)
            console.log(distance)
            if(msg.type == 'public'){
              if (distance < this.settings.currrad){
                this.localNotifications.schedule({
                  id: 1,
                  text: 'New Public Location Updated'
                });
              }
            }else if (msg.type == 'private'){
              if (distance < this.settings.favrad){
                this.localNotifications.schedule({
                  id: 1,
                  text: 'New Private Location Updated'
                });
              }
            }

          });

        }
      });
  }

  // convert degrees to radians
  deg2rad(deg) {
   return deg * (Math.PI/180)
  }

  // Calculate distance
  caldistance(lat1, lon1, lat2, lon2){
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt( 1 - a ));
    var d = R * c; // Distance in km
    return d;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // Ensure network connection is available
      console.log(this.network.type)
      if(this.network.type == 'none' || this.network.type == undefined ){
        this.auth.nonetwork();
      }else{
        this.auth.user.subscribe( val => {
          console.log('got user');
          if ( val == null ) {
            this.user = {
              uid : '',
              email : '',
              photoURL : '',
              displayName : '',
              favoriteColor : '',
              emailVerified: false
            }
          }
          if(val != null){
            this.user = val;
            this.notificationSetup(this.user.email);

          }

        });
      }
      this.network.onDisconnect().subscribe( () => {
        this.auth.nonetwork();
      });
      this.network.onConnect().pipe(take(1)).subscribe(() => {this.auth.user.subscribe( val => {
        console.log('oh no')

        if(val != null){
          this.user = val;
          this.notificationSetup(this.user.email);

        }

        if ( val == null ) {
          this.user = {
            uid : '',
            email : '',
            photoURL : '',
            displayName : '',
            favoriteColor : '',
            emailVerified: false
          }
        }
      });
    });

    });
  }
}
