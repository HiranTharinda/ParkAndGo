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
import { Facebook } from '@ionic-native/facebook/ngx'

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
    public facebook: Facebook,
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

  getuser(){
    return this.user;
  }

  async loggoo(){
    try {
      const gplusUser = await this.gplus.login({
        'webClientId': '320215829065-p31tecv30i8ttac4u65uhn7um9qgl2vn.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })

      this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)).then( token => {
        this.router.navigate(['/home']);
      }).catch(error => {
        this.showToast('You have already made an account with this email Please Verify it or Try another account');
      })

    } catch(err) {
      this.showToast('You have already made an account with this email Please Verify it or Try another account');
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
    this.facebook.login(['public_profile', 'user_friends', 'email'])
        .then( response => {
          const facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(response.authResponse.accessToken);

          this.afAuth.auth.signInWithCredential(facebookCredential)
            .then( success => {
              this.router.navigate(['/home']);
            }).catch(error => {
              this.showToast('You have already made an account with this email Please Verify it or Try another account');
            });

        }).catch((error) => { this.showToast('You have already made an account with this email Please Verify it or Try another account'); });
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
      this.showToast('You have already made an account with this email Please  Verify it or Try another account');
      this.signOut();
    });
  }

  // Helper function to show Toast Message
  async showToast(error){
    let toast = await this.toastCtrl.create({
      message: error,
      duration: 3000,
      position: 'top',
      cssClass: 'custom-class'
    });
    toast.present();
  }

  //Take credential provided by the Login Method and store user and Navigate
  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        console.log(credential.user);
        this.router.navigate(['/home']);
      })
  }

  //signout
  signOut() {
    this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/']);
    });
  }
}
