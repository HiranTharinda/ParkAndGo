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

  const NetworkStub2 = {
      type : 'none',
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
  let netspy : jasmine.Spy;
  let locspy2 : jasmine.Spy;
  let locspy : jasmine.Spy;
  let locspy3 : jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      providers:[{provide:AuthServiceService, useValue:AuthserviceMock},
      {provide:DbService, useValue:dbservicemock},
      {provide:LocationAccuracy, useValue:locationmock},
      {provide:Geolocation, useValue:geolocationmock},
      {provide:LocalstorageService, useValue:localstorageMock},
      { provide:Network , useValue:NetworkStub2}
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
    TestBed.overrideProvider(Network, {useValue: NetworkStub});
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

  it('should build map when initialized', fakeAsync(() => {

    component.map = { flyTo: () => console.log('fly')}
    component.tempbool = false;
    fixture.detectChanges();
    var locacc = TestBed.get(LocationAccuracy)
    var loc =TestBed.get(Geolocation);

    locspy = spyOn(locacc , 'canRequest').and.returnValue(new Promise((resolve,reject)=> {resolve(true)}));
    locspy2 = spyOn(locacc , 'request').and.returnValue(new Promise((resolve,reject)=> {resolve()}));
    locspy3 = spyOn(loc, 'getCurrentPosition').and.returnValue(new Promise((resolve,reject)=> {resolve({coords :{latitude:'1',longitude:'1'}})}));
    compspy = spyOn(component, 'buildMap');

    component.initializeMap({currad:5},'gmail.com');
    flushMicrotasks();
    expect(locspy).toHaveBeenCalled();
    expect(locspy2).toHaveBeenCalled();
    expect(locspy3).toHaveBeenCalled();
    expect(compspy).toHaveBeenCalled();
  }));

  it('should initialize on network connect if map not initialized', fakeAsync(()=>{
    component.mapInitialized = false;
    fixture.detectChanges();
    service = TestBed.get(AuthServiceService)
    var storage = TestBed.get(LocalstorageService);
    var network = TestBed.get(Network);
    spy = spyOn(service, 'getuser').and.returnValue(of({email:'rnisalm@gmail.com'}))
    netspy = spyOn(network, 'onConnect').and.returnValue(of({type:'Wifi'}))
    storspy = spyOn(storage,'provide').and.returnValue(new Promise( (resolve,reject) => resolve({foo:'bar'})));
    compspy = spyOn(component, 'initializeMap');
    component.ngOnInit();

    flushMicrotasks();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(netspy).toHaveBeenCalled();
    expect(storspy).toHaveBeenCalled();
    expect(compspy).toHaveBeenCalled();
  }));

  it('should update map on return to page', fakeAsync(()=> {
    component.timesentered = 1
    component.map = {resize:()=>{console.log('resized')}}
    fixture.detectChanges();
    var storage = TestBed.get(LocalstorageService);
    storspy = spyOn(storage,'provide').and.returnValue(new Promise( (resolve,reject) => resolve({foo:'bar'})));
    compspy = spyOn(component, 'changetype');

    component.ionViewWillEnter();
    flushMicrotasks();
    expect(compspy).toHaveBeenCalled();
    expect(storspy).toHaveBeenCalled();
  }));

  it('should not ininitialize on network connect if map initialized',fakeAsync(()=> {
    component.mapInitialized = true;
    fixture.detectChanges();
    service = TestBed.get(AuthServiceService);
    var network = TestBed.get(Network);
    var storage = TestBed.get(LocalstorageService);
    spy = spyOn(service, 'getuser').and.returnValue(of({email:'rnisalm@gmail.com'}))
    console.log("b"+component.mapInitialized);
    netspy = spyOn(network, 'onConnect').and.returnValue(of({type:'Wifi'}))
    storspy = spyOn(storage,'provide').and.returnValue(new Promise( (resolve,reject) => resolve({foo:'bar'})));
    compspy = spyOn(component, 'initializeMap');
    component.ngOnInit();

    flushMicrotasks();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(netspy).toHaveBeenCalled();
    expect(storspy).not.toHaveBeenCalled();
    expect(compspy).not.toHaveBeenCalled();
  }));

});
