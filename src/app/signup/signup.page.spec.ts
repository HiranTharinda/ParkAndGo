import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { AuthServiceService } from '../auth-service.service';
import { SignupPage } from './signup.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
const AuthserviceMock = {
    user: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true}),
    signOut:()=>{this.user = null},
    sendVerification:() => { console.log('vertification sent')},
    emailSignup:() => {console.log('mail request recieved')}
};

describe('SignupPage', () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      providers:[{provide:AuthServiceService, userValue:AuthserviceMock}],
      declarations: [ SignupPage ],
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
    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
