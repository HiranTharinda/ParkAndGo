import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed ,fakeAsync, tick , flushMicrotasks} from '@angular/core/testing';

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
  getCurrentPosition:()=> new Promise((resolve,reject) => {resolve({coords: {latitude:80,longitude:80}})}) ,
  valueChanges:() => new BehaviorSubject({ foo: 'bar' })
}

const locationmock = {
  canRequest:() => new Promise((resolve,reject)=> {resolve(true)}),
  request:(options:any)=> new Promise((resolve,reject)=> {resolve()})
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
const mapmock ={
  flyTo: (cords:any)=> {console.log('d')}
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
  let spy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      providers:[{provide:AuthServiceService, useValue:AuthserviceMock},
      {provide:DbService, useValue:dbservicemock},
      {provide:LocationAccuracy, useValue:locationmock},
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

  it('should build the map', fakeAsync(() => {
    spy = spyOn(component,'buildMap');
    component.map = mapmock;
    component.initializeMap({currad:8},'@gmail.com');
    flushMicrotasks();
    expect(spy).toHaveBeenCalled();
  }));
});
