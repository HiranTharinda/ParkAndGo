import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed ,fakeAsync, tick , flushMicrotasks} from '@angular/core/testing';
import { Network } from '@ionic-native/network/ngx';
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
    getuser:() => ({
      subscribe:() => {console.log('got user')}
    }),
    signOut:()=>{this.user = null},
    sendVerification:() => { console.log('vertification sent')},
    emailLogin:() => {console.log('logged in request recieved')}
};
const NetworkStub = {
    type : 'WiFi',
    onConnect:()=> new BehaviorSubject({ foo: 'bar' }),
    onDisconnect:()=> new BehaviorSubject({ foo: 'bar' })
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
  let service;
  let compspy : jasmine.Spy;
  let storspy : jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      providers:[{provide:AuthServiceService, useValue:AuthserviceMock},
      {provide:DbService, useValue:dbservicemock},
      {provide:LocationAccuracy, useValue:locationmock},
      {provide:LocalstorageService, useValue:localstorageMock},
      {provide:Geolocation, useValue:geolocationmock},
      { provide:Network , useValue:NetworkStub}
    ],
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

  it('should intializemap when network present' ,fakeAsync(() => {
    service = TestBed.get(AuthServiceService)
    var storage = TestBed.get(LocalstorageService);
    spy = spyOn(service, 'getuser').and.returnValue(of({email:'rnisalm@gmail.com'}))
    storspy = spyOn(storage,'provide').and.returnValue(new Promise( (resolve,reject) => resolve({foo:'bar'})));
    compspy = spyOn(component, 'initializeMap');
    component.ngOnInit();

    flushMicrotasks();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(storspy).toHaveBeenCalled();
    expect(compspy).toHaveBeenCalled();
  }));



});
