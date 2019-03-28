import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthServiceService } from '../auth-service.service';
import { WaitingVerificationPage } from './waiting-verification.page';
import { of, Observable } from 'rxjs';
const AuthserviceMock = {
    user: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true}),
    signOut:()=>{this.user = null},
    sendVerification:() => { console.log('vertification sent')}
};

describe('WaitingVerificationPage', () => {
  let component: WaitingVerificationPage;
  let fixture: ComponentFixture<WaitingVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers:[{provide:AuthServiceService, userValue:AuthserviceMock}],
      declarations: [ WaitingVerificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
