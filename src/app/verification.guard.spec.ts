import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';

import { VerificationGuard } from './verification.guard';
import { of, Observable } from 'rxjs';
import { AuthServiceService} from './auth-service.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from './mock/mock.component';
import { Location } from '@angular/common';
import {  Router, RouterOutlet, RouterLinkWithHref} from '@angular/router';
/*const AuthserviceMock = {
    user: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true})
};*/


describe('VerificationGuard', () => {
  let verificationGuard: VerificationGuard;
  let authService : AuthServiceService;
  let next: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let router : Router;
  let location : Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  MockComponent ],
      imports:[        AngularFireModule.initializeApp(environment.firebase),
              AngularFireAuthModule,
              AngularFirestoreModule,
            RouterTestingModule.withRoutes([{ path: 'home', component : MockComponent },{ path: 'waiting-verification', component : MockComponent }])
          ],
      providers: [VerificationGuard, AuthServiceService],
    }).compileComponents();
  }));

  beforeEach(() => {
    verificationGuard = TestBed.get(VerificationGuard);
    authService = TestBed.get(AuthServiceService);
    router = TestBed.get(Router);
    location = TestBed.get(Location);
  });

  it('should create', inject([VerificationGuard], (guard: VerificationGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('be able to hit route when user is verified', fakeAsync(() => {
    router.navigate(['/home']);
    tick();
    authService.user = of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true});
    verificationGuard.canActivate(next, state).subscribe(bool => {
      expect(bool).toBe(true);
      tick();
      expect(location.path()).toBe('/home');
    })

  }));

  it('not be able to hit route when user is not logged in', fakeAsync(() => {
      router.navigate(['/home']);
      tick();
      authService.user = of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:false});
      verificationGuard.canActivate(next, state).subscribe(bool => {
        expect(bool).toBe(false);
        tick();
        expect(location.path()).toBe('/waiting-verification');
      })


  }));
});
