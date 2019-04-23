import { TestBed, fakeAsync, tick } from '@angular/core/testing';
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

  let spy1 : jasmine.Spy;
  let spy2 : jasmine.Spy;
  let spy3 : jasmine.Spy;
  let service : FcmService;
  let firebase : Firebase;

  beforeEach(() => TestBed.configureTestingModule({
    providers:[{provide: Firebase,useValue: firebasemock},
    {provide :LocalstorageService,useValue:localstorageMock},
  {provide:AngularFirestore,useValue:FirestoreStub}]
}).compileComponents());

    beforeEach(() => {
      service= TestBed.get(FcmService);
      firebase = TestBed.get(Firebase);
      spy1 = spyOn(firebase,'subscribe').and.returnValue('subscribed');
      spy2 = spyOn(firebase,'unsubscribe').and.returnValue('unsubscibed');
      });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('subscribe if settings say so', () => {
    service.settings = {currno:true,favno:true}
    service.subscribetoParking('me');
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('not subscribe if settings say so', () => {
    service.settings = {currno:false,favno:false}
    service.subscribetoParking('me');
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });
});
