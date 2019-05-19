import { TestBed , fakeAsync, tick, flushMicrotasks} from '@angular/core/testing';

import { DbService } from './db.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthServiceService } from './auth-service.service';
import { BehaviorSubject,Observable, of } from 'rxjs';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';


class GeoPoint{
  constructor(coordinates){
    return "something"
  }
}
const doc = {
  set:  jasmine.createSpy('set').and.returnValue(new Promise((resolve,reject)=> resolve()))
}

const nextlevelcol = {
    doc: jasmine.createSpy('doc').and.returnValue(doc)
  };

const nextlevelcollection = {
    collection:  jasmine.createSpy('collection').and.returnValue(nextlevelcol),
    delete : jasmine.createSpy('delete').and.returnValue(new Promise((resolve,reject)=> resolve())),
    update : jasmine.createSpy('update').and.returnValue(new Promise((resolve,reject)=> resolve())),
    set : jasmine.createSpy('set').and.returnValue(new Promise((resolve,reject)=> resolve())),
  };

const collectionStub = {
  doc:  jasmine.createSpy('doc').and.returnValue(nextlevelcollection)
}

const batchStub = {
  set:  jasmine.createSpy('set').and.returnValue('set'),
  commit : jasmine.createSpy('commit').and.returnValue(new Promise((resolve,reject)=> resolve()))
}

const FirestoreStub = {
    collection:  jasmine.createSpy('collection').and.returnValue(collectionStub),
    firestore : {
      collection : jasmine.createSpy('collection').and.returnValue(collectionStub),
      batch : jasmine.createSpy('batch').and.returnValue(batchStub)
    }
  };
  const AuthserviceMock = {
      user: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true}),
      signOut : () => new Promise((resolve,reject)=> resolve())
  };

describe('DbService', () => {
  let spy : jasmine.Spy;
  let service : DbService;
  let auth : AuthServiceService;
  let spy2 : jasmine.Spy;
  let db : AngularFirestore;

  beforeEach(() => TestBed.configureTestingModule({providers: [
    {provide : AngularFirestore , useValue : FirestoreStub},
    {provide : AuthServiceService, useValue : AuthserviceMock}
  ]
}).compileComponents());

  beforeEach(() => {
    service= TestBed.get(DbService);
    auth = TestBed.get(AuthServiceService);
    db = TestBed.get(AngularFirestore);
    spy = spyOn(auth,'signOut').and.returnValue(new Promise((resolve,reject)=> resolve()));
    spy2 = spyOn(service,'showToast').and.returnValue('Made notification');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call signout when save method called', fakeAsync(() => {
    service.user.uid = 'randomvalue';
    service.savesettings({random:'random'});
    flushMicrotasks();
    expect(spy).toHaveBeenCalled();
  }));

  it('should report correctly ', fakeAsync(() => {
    service.user = { uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true}
    service.reportlocation('loc123','private',{issue:"Something Bad happened"});
    flushMicrotasks();
    expect(db.collection).toHaveBeenCalledWith('privreports');
    expect(db.collection('privreports').doc).toHaveBeenCalledWith('loc123');
    expect(db.collection('privreports').doc('loc123').collection).toHaveBeenCalledWith('reportlist');
    expect(db.collection('privreports').doc('loc123').collection('reportlist').doc).toHaveBeenCalledWith('ABC123');
  }));

  it('should display error if already reported ', fakeAsync(() => {

  }));
});
