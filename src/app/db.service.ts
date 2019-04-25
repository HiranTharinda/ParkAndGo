import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthServiceService } from './auth-service.service';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
firebase.initializeApp(environment.firebase);
import * as geofirex from 'geofirex';
import { toGeoJSON } from 'geofirex'
const geo = geofirex.init(firebase);
import { switchMap } from 'rxjs/operators';
import { ToastController} from '@ionic/angular';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
  emailVerified?:boolean;
}

interface Settings{
  favno: boolean;
  currno : boolean;
  favshow: boolean;
  currshow : boolean;
  favrad : number;
  currrad : number;
}


@Injectable({
  providedIn: 'root'
})

export class DbService {

  user: User = {
    uid : '',
    email : '',
    photoURL : '',
    displayName : '',
    favoriteColor : '',
    emailVerified: false
  };

  constructor(public toastCtrl: ToastController,private afs : AngularFirestore, private auth : AuthServiceService) {
    this.auth.user.subscribe( val => {
      this.user = val;
      if(val == null ){
        this.user = {
          uid : '',
          email : '',
          photoURL : '',
          displayName : '',
          favoriteColor : '',
          emailVerified: false
        }
      }
      console.log(this.user);
    });
  }

  reportlocation(locationid , collection, issue) {
    this.afs.collection('reports').doc(locationid).collection('reportlist').doc(this.user.uid)
    .set({ time : Date.now(), reason:issue}).then(resp => {
      this.showToast('Issue Posted. We will look into it')
    }).catch(error => {
      this.showToast("Seems like you have already reported this location");
    });
  }

  async showToast(error){
    let toast = await this.toastCtrl.create({
      message: error,
      duration: 3000,
      position: 'top',
      cssClass: 'custom-class'
    });
    toast.present();
  }

  providesetttings() {
    return this.afs.collection('settings').doc<Settings>(this.user.uid);
  }

  savesettings(settings) {
    this.afs.collection('settings').doc(this.user.uid).set(settings).then(res => {
      this.auth.signOut();
    });
  }

  // retrieve private locations within distance of given lat and lang
  locations(distance , mailserver , lat, lng){
      const format = {};
      const cities = geo.collection('private', ref => ref.where("dmn", "array-contains",mailserver ))
      const center = geo.point(lat, lng);
      const field = 'position';
      const query = cities.within(center, distance, field).pipe( toGeoJSON('position', true) );
      return query

  }

  // retrieve public locations within distance of given lat and lang
  publocations(distance, lat, lng){

      const cities = geo.collection('public')
      const center = geo.point(lat, lng);
      const field = 'position';
      const query = cities.within(center, distance, field).pipe( toGeoJSON('position', true) );
      return query

  }

}
