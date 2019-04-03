import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SettingsPage } from './settings.page';
import { LocalstorageService } from '../localstorage.service';
import { FcmService } from '../fcm.service';
import { AuthServiceService } from '../auth-service.service';
import { AlertController } from '@ionic/angular';
const fcmmock = {
  ManualSubPriv:() => {console.log('subed priv')},
  ManualSubPublic:() => {console.log('subed pub')},
  ManualunsubPriv:() => {console.log('unsubed priv')},
  ManualunsubPublic:() => {console.log('unsubed pub')}
}
const localstorageMock = {
  provide:() =>({
      then: () => {
        return {currno:true}
      }
  }),
  set:(id:string,value:string)=> {console.log("set")}
}
const AuthserviceMock = {
    user: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true}),
    signOut:()=>{this.user = null},
    sendVerification:() => { console.log('vertification sent')},
    emailSignup:() => {console.log('mail request recieved')}
};

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let spy: jasmine.Spy;
  let spy2 : jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers:[ {provide :AuthServiceService,useValue:AuthserviceMock},{provide :FcmService,useValue:fcmmock},{provide:LocalstorageService,useValue:localstorageMock} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('subsribe if option set', () => {
    const local = TestBed.get(AlertController);
    spy = spyOn(local,'create').and.returnValue('done');
    component.currno = true;
    component.Save();
    expect(spy).toHaveBeenCalled();
  });

});
