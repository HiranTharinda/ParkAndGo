import { TestBed } from '@angular/core/testing';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocalstorageService } from './localstorage.service';
import { FcmService } from './fcm.service';
import { BehaviorSubject, of, Observable } from 'rxjs';
const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve()),
      }),
    }),
  };



const firebasemock = {
  getToken: ()=>{return "token"},
  subscribe:(topic:string)=> { console.log("subsribed to topic")},
  unsubscribe:(topic:string)=> { console.log("unsubsribed to topic")}
}

const localstorageMock = {
  provide:() =>({
      then: () => {
        return {currad:"5"}
      }  
  })
}

describe('FcmService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers:[{provide: Firebase,useValue: firebasemock},
    {provide :LocalstorageService,useValue:localstorageMock},
  {provide:AngularFirestore,useValue:FirestoreStub}]
  }));

  it('should be created', () => {
    const service: FcmService = TestBed.get(FcmService);
    expect(service).toBeTruthy();
  });
});
