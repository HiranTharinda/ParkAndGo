import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, fakeAsync, tick, flushMicrotasks, flush } from '@angular/core/testing';
import { BackgroundMode } from '@ionic-native/background-mode/ngx'
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';

import { AuthServiceService } from './auth-service.service';
import { LocalstorageService } from './localstorage.service';
import { FcmService } from './fcm.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { of, BehaviorSubject} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Network } from '@ionic-native/network/ngx';
const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve()),
      }),
    }),
  };
  const NetworkStub = {
      onConnect:()=> new BehaviorSubject({ foo: 'bar' }),
      onDisconnect:()=> new BehaviorSubject({ foo: 'bar' })
    };
  const AngularFireMocks = {
      auth: of({ uid: 'ABC123' }),
      authState: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true})
  };

const geolocationmock = {
  getCurrentPosition:()=> new Promise((resolve,reject) => {resolve()}) ,
  valueChanges:() => new BehaviorSubject({ foo: 'bar' })
}

const backgroundmock = {
  enable: () => {console.log('enabled')},
  on:() => new BehaviorSubject({foo:'bar'}),
  setDefaults:() => { console.log('Options set')},
  disableWebViewOptimizations:() => {console.log('disabled')}
}

const AuthserviceMock = {
    user: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true}),
    signOut:()=>{this.user = null},
    sendVerification:() => { console.log('vertification sent')},
    emailLogin:() => {console.log('logged in request recieved')},
    nonetwork:() => {console.log('network discovered')}
};


const localstorageMock = {
  provide:() =>({
      then: () => {
        return {currad:"5"}
      }
  })
}

const fcmmock = {
  getToken: (id:string)=> {console.log('subed priv')},
  onNotifications: () => new BehaviorSubject({aps:{alert:'this is an alert'}}),
  ManualSubPriv:() => {console.log('subed priv')},
  ManualSubPublic:() => {console.log('subed pub')},
  ManualunsubPriv:() => {console.log('unsubed priv')},
  ManualunsubPublic:() => {console.log('unsubed pub')},
  storage : { provide:() => new Promise((resolve,reject)=> {resolve()})}
}

describe('AppComponent', () => {

  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;
  let spy : jasmine.Spy;
  let spy2 : jasmine.Spy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy , is:() => true });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide : AngularFireAuth , useValue : AngularFireMocks},
       {provide : AngularFirestore , useValue : FirestoreStub},
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        {provide:AuthServiceService, useValue:AuthserviceMock},
        {provide:LocalstorageService, useValue:localstorageMock},
        {provide: BackgroundMode, useValue:backgroundmock},
        {provide :FcmService,useValue:fcmmock},
        {provide:Geolocation, useValue:geolocationmock},
        { provide:Network , useValue:NetworkStub}
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });



  // TODO: add more tests!
  it('should return correct distance', fakeAsync (() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    var d = app.caldistance(50,50,80,80);
    console.log(d);
    expect(d).toBe(3521.723181973181);
    fixture.destroy();
    flush();
  }));
});
