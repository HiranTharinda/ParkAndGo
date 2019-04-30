import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthServiceService } from '../auth-service.service';
import { WaitingVerificationPage } from './waiting-verification.page';
import { of, Observable } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { Facebook } from '@ionic-native/facebook/ngx'
import { GooglePlus } from '@ionic-native/google-plus/ngx';
describe('WaitingVerificationPage', () => {
  let component: WaitingVerificationPage;
  let fixture: ComponentFixture<WaitingVerificationPage>;
  let authService : AuthServiceService;
  let spy : jasmine.Spy;
  let spy2 : jasmine.Spy;
  let de : DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers:[Facebook,AuthServiceService,GooglePlus],
      declarations: [ WaitingVerificationPage ],
      imports :[
          RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement;
    authService = de.injector.get(AuthServiceService);
    spy = spyOn(authService,'sendVerifciation').and.returnValue('sent verification mail');
    spy2 = spyOn(authService,'signOut').and.returnValue('logged out');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout when clicking done', ()=>{
    de.query(By.css('#donebutton')).nativeElement.dispatchEvent(new Event('click'));
    expect(spy2).toHaveBeenCalled();
  });

  it('should logout when try with different', ()=>{

      de.query(By.css('#trywithdiffbutton')).nativeElement.dispatchEvent(new Event('click'));
      expect(spy2).toHaveBeenCalled();
  });

  it('should send verification when clicked',()=>{
      de.query(By.css('#verbutton')).nativeElement.dispatchEvent(new Event('click'));
      expect(spy).toHaveBeenCalled();
  });
});
