import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { AuthServiceService } from '../auth-service.service';
import { SignupPage } from './signup.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import {  ToastController } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
class Toast{
  present(){
    return 'toast message !';
  }
}

describe('SignupPage', () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;
  let service :ToastController;
  let authService : AuthServiceService;
  let spy : jasmine.Spy;
  let spy2 : jasmine.Spy;
  let de : DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      providers:[AuthServiceService,
      ToastController],
      declarations: [ SignupPage ],
      imports :[
        FormsModule,
        IonicModule,
        RouterTestingModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
    service = de.injector.get(ToastController);
    authService = de.injector.get(AuthServiceService);
    spy = spyOn(service,'create').and.returnValue(new Toast());
    spy2 = spyOn(authService,'emailSignup').and.returnValue('signedUp');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Form should be false at start
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
    let repassword = component.todo.controls["repassword"];
    repassword.setValue("r!ghtp8ss");
    expect(component.todo.valid).toBeFalsy();
    nativeemail.nativeElement.dispatchEvent(new Event('ionBlur'));
    expect(spy).toHaveBeenCalled();
  });

  // Form invalid when wrong data given
  it('form is invalid when wrong data given 2' , () => {
    let nativepass = de.query(By.css('#password'))
    let email = component.todo.controls["email"];
    email.setValue("rightmail@mail.com");
    let password = component.todo.controls["password"];
    password.setValue("wrong");


    let repassword = component.todo.controls["repassword"];
    repassword.setValue("wrong");
    expect(component.todo.valid).toBeFalsy();
    nativepass.nativeElement.dispatchEvent(new Event('ionBlur'));
    expect(spy).toHaveBeenCalled();
  });

  it('form is invalid when wrong data given 3' , () => {
    let nativerepass = de.query(By.css('#repassword'))
    let email = component.todo.controls["email"];
    email.setValue("rightmail@mail.com");
    let password = component.todo.controls["password"];
    password.setValue("r!ghtp8ss");
    let repassword = component.todo.controls["repassword"];
    repassword.setValue("r!ghtp8ssbutdiff");


    expect(component.todo.valid).toBeFalsy();
    nativerepass.nativeElement.dispatchEvent(new Event('ionBlur'));
    expect(spy).toHaveBeenCalled();
  });

  it('form is valid when right data given' , () => {
    let nativeemail = de.query(By.css('#email'));
    let nativepass = de.query(By.css('#password'));
    let nativerepass = de.query(By.css('#repassword'));
    //let submitbutton = de.query(b)

    let email = component.todo.controls["email"];
    email.setValue("rightmail@mail.com");
    let password = component.todo.controls["password"];
    password.setValue("P!zzahut5");
    let repassword = component.todo.controls["repassword"];
    repassword.setValue("P!zzahut5");
    expect(component.todo.valid).toBeTruthy();



    nativeemail.nativeElement.dispatchEvent(new Event('ionBlur'));
    nativepass.nativeElement.dispatchEvent(new Event('ionBlur'));
    nativerepass.nativeElement.dispatchEvent(new Event('ionBlur'));
    expect(spy).not.toHaveBeenCalled();

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy2).toHaveBeenCalled();
    expect(component.todo.valid).toBeFalsy();
  });
});
