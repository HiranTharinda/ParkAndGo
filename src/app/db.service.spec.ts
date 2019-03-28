import { TestBed } from '@angular/core/testing';

import { DbService } from './db.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthServiceService } from './auth-service.service';
import { BehaviorSubject,Observable, of } from 'rxjs';

const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve()),
      }),
    }),
  };
  const AuthserviceMock = {
      user: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true})
  };

describe('DbService', () => {
  beforeEach(() => TestBed.configureTestingModule({providers: [
    {provide : AngularFirestore , useValue : FirestoreStub},
    {provide : AuthServiceService, useValue : AuthserviceMock}
  ]
}));

  it('should be created', () => {
    const service: DbService = TestBed.get(DbService);
    expect(service).toBeTruthy();
  });
});
