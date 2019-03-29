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
    uid : "",
    email : "",
    photoURL : "",
    displayName : "",
    favoriteColor : "",
    emailVerified: false
  };

  constructor(private afs : AngularFirestore, private auth : AuthServiceService) {
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
      console.log(this.user);
    });
  }

  reportlocation(locationid , collection){
    /*const sfDocRef = this.afs.firestore.collection(collection).doc(locationid);
    this.afs.firestore.runTransaction(transaction => {
      return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                console.log("doc doesnt exist");
            }
            const initialreports = sfDoc.data().reports
            if( initialreports == undefined){
              const newPopulation = 1;
              transaction.update(sfDocRef, { reports: newPopulation });
            }else{
              const newPopulation = sfDoc.data().reports + 1;
              transaction.update(sfDocRef, { reports: newPopulation });
            }
        });
    }).then(() => {
        console.log("Transaction successfully committed!");
    }).catch(error => {
        console.log("Transaction failed: ", error);
    });*/
    this.afs.collection('reports').add({ location:locationid , time : Date.now()})
  }
  
  providesetttings(){
    return this.afs.collection('settings').doc<Settings>(this.user.uid);
  }

  savesettings(settings){
    this.afs.collection('settings').doc(this.user.uid).set(settings).then(res => {
      this.auth.signOut();
    });
  }

  locations(distance , mailserver , lat,lng){
      const format = {};
      const cities = geo.collection('private', ref=>ref.where("dmn", "array-contains",mailserver ))
      const center = geo.point(lat,lng);
      const radius = 100; // km
      const field = 'position';
      const query = cities.within(center, distance, field).pipe( toGeoJSON('position', true) );
      return query

  }

  publocations(distance,lat,lng){

      const cities = geo.collection('public')
      const center = geo.point(lat,lng);
      const radius = 100; // km
      const field = 'position';
      const query = cities.within(center, distance, field).pipe( toGeoJSON('position', true) );
      return query

  }


}
