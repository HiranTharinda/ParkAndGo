import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ToastController} from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
  emailVerified?:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  user: Observable<User>;

  constructor(
    private gplus: GooglePlus,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    public toastCtrl: ToastController
  ) {

      //// Get auth data, then get store data or store null
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return of( {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                  emailVerified : user.emailVerified
                });
          } else {
            return of(null)
          }
        })
      )
    }

  sendVerifciation(){
    this.afAuth.auth.currentUser.sendEmailVerification();
  }

  googleLogin() {
    this.loggoo()
  }

  async loggoo(){
    try {
      console.log('this shit runs');
      const gplusUser = await this.gplus.login({
        'webClientId': '320215829065-p31tecv30i8ttac4u65uhn7um9qgl2vn.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })

      this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)).then( token => {
        this.router.navigate(['/home']);
      })

    } catch(err) {
      console.log(err)
    }
  }

  nonetwork(){
    this.showToast("Internet Connection Lost some functionality might be unavailable")
  }

  forgotpassword(email){
    this.afAuth.auth.sendPasswordResetEmail(email)
    .then(() => this.showToast("Email sent please check your inbox"))
    .catch((error) => this.showToast("No user account found for the email"))
  }

  facebookLogin(){

  }

  emailLogin(email, password){

    this.afAuth.auth.signInWithEmailAndPassword(email, password).then( token => {
      this.router.navigate(['/home']);
    }).catch(error => {
      this.showToast("Wrong Username or Password, or User doesn't exist");
    });
  }

  emailSignup(email, password){
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then( token => {
      this.sendVerifciation();
      this.router.navigate(['/home']);
    }).catch(error => {
      this.signOut();
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

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        console.log(credential.user);
        this.router.navigate(['/home']);
      })
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/']);
    });
  }
}
