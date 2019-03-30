import { TestBed } from '@angular/core/testing';
import { BehaviorSubject,Observable, of} from 'rxjs';
import { AuthServiceService } from './auth-service.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';


class RouterStub {
    navigate(url: String) { return url}
}

const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve()),
      }),
    }),
  };

  const AngularFireMocks = {
      auth: { signOut: ()=> { this.authState = of(null)} },
      authState: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true})
  };

  const AngularFireMocks2 = {
      auth: { signOut: ()=> { this.authState = of(null)} },
      authState: of(null)
  };


describe('AuthServiceService', () => {
  let service: AuthServiceService;
  let afauth: AngularFireAuth;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ {provide : AngularFireAuth , useValue : AngularFireMocks},
    {provide : AngularFirestore , useValue : FirestoreStub},
  { provide: Router, useClass: RouterStub } ]
  }).compileComponents());



  it('should be created', () => {
    service =   TestBed.get(AuthServiceService);
    afauth = TestBed.get(AngularFireAuth);
    expect(service).toBeTruthy();
  });

  //will load user if user has logged in previously or just logs in
  it('should load user if he already logged in' , () => {
    service =   TestBed.get(AuthServiceService);
    afauth = TestBed.get(AngularFireAuth);
    service.user.subscribe(value => {
      expect(value.uid).toBe('ABC123');
    })
  });

  it('should load user if he already logged in' , () => {
    TestBed.overrideProvider(AngularFireAuth, {useValue: AngularFireMocks2});
    service =   TestBed.get(AuthServiceService);
    afauth = TestBed.get(AngularFireAuth);
    service.user.subscribe(value => {
      expect(value).toBe(null);
    })
  });
});
