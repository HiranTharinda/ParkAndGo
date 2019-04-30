import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed , fakeAsync, tick} from '@angular/core/testing';
import { Facebook } from '@ionic-native/facebook/ngx'
import { LoginPage } from './login.page';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { AuthServiceService } from '../auth-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import {  ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import {  Router, RouterOutlet, RouterLinkWithHref} from '@angular/router';
import { By } from '@angular/platform-browser';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { MockComponent } from '../mock/mock.component';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

class Toast{
  present(){
    return 'toast message !';
  }
}


describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let service :ToastController;
  let authService : AuthServiceService;
  let spy : jasmine.Spy;
  let spy2 : jasmine.Spy;
  let de : DebugElement;
  let router : Router;
  let location : Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers:[Facebook,AuthServiceService,
      ToastController, GooglePlus],
      imports :[
        FormsModule,
        IonicModule,
        RouterTestingModule.withRoutes([{ path: 'signup', component : MockComponent }]),
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule
      ],
      declarations: [ LoginPage, MockComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement;
    service = de.injector.get(ToastController);
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    authService = de.injector.get(AuthServiceService);
    spy = spyOn(service,'create').and.returnValue(new Toast());
    spy2 = spyOn(authService,'emailLogin').and.returnValue('LoggedIn');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid when loading' , () => {
    expect(component.todo.valid).toBeFalsy();
  });

  // Form invalid when wrong data given
  it('form is invalid when wrong data given 1' , () => {
    let nativeemail = de.query(By.css('#email'))

    let email = component.todo.controls["email"];
    email.setValue("fakemail");
    let password = component.todo.controls["password"];
    password.setValue("r!ghtp8ss");
    expect(component.todo.valid).toBeFalsy();
    nativeemail.nativeElement.dispatchEvent(new Event('ionBlur'));
    expect(spy).toHaveBeenCalled();
  });

  // Form invalid when wrong data given

  it('form is valid when right data given' , () => {
    let nativeemail = de.query(By.css('#email'));
    let nativepass = de.query(By.css('#password'));
    //let submitbutton = de.query(b)

    let email = component.todo.controls["email"];
    email.setValue("rightmail@mail.com");
    let password = component.todo.controls["password"];
    password.setValue("P!zzahut5");
    expect(component.todo.valid).toBeTruthy();



    nativeemail.nativeElement.dispatchEvent(new Event('ionBlur'));
    nativepass.nativeElement.dispatchEvent(new Event('ionBlur'));
    expect(spy).not.toHaveBeenCalled();

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy2).toHaveBeenCalled();
    expect(component.todo.valid).toBeFalsy();
  });

  /*it('should have link to sign up page', () => {
    let debugelements = de.query(By.directive(RouterLinkWithHref));
    let index = debugelements.findIndex(de => de.attributes['href']==='/signup');
    expect(index).toBeGreaterThan(-1);
  });*/

  it('should route to sign up page when button clicked', fakeAsync(()=> {
    let signupbutton = de.query(By.css('#signupbutton')).nativeElement.dispatchEvent(new Event('click'));
    tick();
    expect(location.path()).toBe('/signup');
  }))
});
