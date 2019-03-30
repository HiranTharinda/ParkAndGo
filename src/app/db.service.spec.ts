import { TestBed , fakeAsync, tick, flushMicrotasks} from '@angular/core/testing';

import { DbService } from './db.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthServiceService } from './auth-service.service';
import { BehaviorSubject,Observable, of } from 'rxjs';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve({foo:'bar'})),
      }),
    }),
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
    spy2 = spyOn(db,'collection').and.returnValue({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve({foo:'bar'})),
      }),
    });
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
});
