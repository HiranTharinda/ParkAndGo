import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthServiceService } from './auth-service.service';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
firebase.initializeApp(environment.firebase);
import * as geofirex from 'geofirex';
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


  providesetttings(){
    return this.afs.collection('settings').doc<Settings>(this.user.uid);
  }

  savesettings(settings){
    this.afs.collection('settings').doc(this.user.uid).set(settings)
  }


}
