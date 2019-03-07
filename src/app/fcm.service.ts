import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private firebase: Firebase,
              private afs: AngularFirestore,
              private platform: Platform) { }

              async getToken(email) {
                let token;

                if (this.platform.is('android')) {
                  token = await this.firebase.getToken();
                }

                if (this.platform.is('ios')) {
                  token = await this.firebase.getToken();
                  await this.firebase.grantPermission();
                }

                this.saveToken(token);
                this.subscribetoParking(email);
              }

              private saveToken(token) {
                if (!token) return;

                const devicesRef = this.afs.collection('devices');

                const data = {
                  token,
                  userId: 'testUserId'
                };

                return devicesRef.doc(token).set(data);
              }

              private subscribetoParking(email){
                this.firebase.subscribe("public");
                console.log(email);
                this.firebase.subscribe(email);
              }

              onNotifications() {
                return this.firebase.onNotificationOpen();
              }
}
