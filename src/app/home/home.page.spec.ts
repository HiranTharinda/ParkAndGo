import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed ,fakeAsync, tick} from '@angular/core/testing';

import { HomePage } from './home.page';

import { DbService } from '../db.service';
import { AuthServiceService } from '../auth-service.service';
import { LocalstorageService } from '../localstorage.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { of , Observable, BehaviorSubject } from 'rxjs';

const geolocationmock = {
  getCurrentPosition:()=> new Promise((resolve,reject) => {resolve()}) ,
  valueChanges:() => new BehaviorSubject({ foo: 'bar' })
}
const AuthserviceMock = {
    user: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true}),
    signOut:()=>{this.user = null},
    sendVerification:() => { console.log('vertification sent')},
    emailLogin:() => {console.log('logged in request recieved')}
};

const localstorageMock = {
  provide:() =>({
      then: () => {
        return {currad:"5"}
      }
  })
}
const dbservicemock = {
  locations:() => ({
    valueChanges:() => new BehaviorSubject({ foo: 'bar' })
  }),
  publocations:() => ({
    valueChanges:() => new BehaviorSubject({ foo: 'bar' })
  }),
  savesettings:() => 'saved'
}


describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      providers:[{provide:AuthServiceService, useValue:AuthserviceMock},
      {provide:DbService, useValue:dbservicemock},
      {provide:LocalstorageService, useValue:localstorageMock},
      {provide:Geolocation, useValue:geolocationmock}],
      imports :[
        FormsModule,
        IonicModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],

      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
