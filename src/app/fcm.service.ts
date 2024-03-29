import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

              settings: any;
              constructor(private storage: LocalstorageService,private firebase: Firebase,private afs: AngularFirestore
                ,  private platform: Platform) {
                this.storage.provide().then(settings => {
                  this.settings = settings;
                })
              }

              // Get unique device token identifier
              async getToken(email) {
                let token;

                if (this.platform.is('android')) {
                  token = await this.firebase.getToken();
                }

                if (this.platform.is('ios')) {
                  token = await this.firebase.getToken();
                  await this.firebase.grantPermission();
                }
                // Maintain token in db
                this.saveToken(token);
                this.subscribetoParking(email);
              }

              private saveToken(token) {
                if (!token) { return } ;

                const devicesRef = this.afs.collection('devices');

                const data = {
                  token,
                  userId: 'testUserId'
                };

                return devicesRef.doc(token).set(data);
              }

              // Subscribe to notifications depending on user settings when loading app
              subscribetoParking(email) {
                console.log('about to subsribe')
                console.log(this.settings)
                if (this.settings.currno) {
                  console.log('subscribed');
                  this.firebase.subscribe("public");
                }
                if (this.settings.favno) {
                  console.log(email);
                  this.firebase.subscribe(email);
                }
              }

              // User manually subscribes/unsubscribes to retrieve notifications
              public ManualSubPublic(email){
                this.firebase.subscribe("public");
                console.log(email);
              }

              public ManualSubPriv(email){
                console.log(email);
                this.firebase.subscribe(email);
              }

              public ManualunsubPublic(email){
                this.firebase.unsubscribe("public");
                console.log(email);
              }

              public ManualunsubPriv(email){
                console.log(email);
                this.firebase.unsubscribe(email);
              }

              onNotifications() {
                return this.firebase.onNotificationOpen();
              }
}
