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
      auth: of({ uid: 'ABC123' }),
      authState: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true})
  };

describe('AuthServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ {provide : AngularFireAuth , useValue : AngularFireMocks},
    {provide : AngularFirestore , useValue : FirestoreStub},
  { provide: Router, useClass: RouterStub } ]
  }).compileComponents());

  it('should be created', () => {
    const service: AuthServiceService = TestBed.get(AuthServiceService);
    expect(service).toBeTruthy();
  });
});
