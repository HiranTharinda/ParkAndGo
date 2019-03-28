import { TestBed, async, inject } from '@angular/core/testing';
import { AuthServiceService} from './auth-service.service';
import { AuthGuard } from './auth.guard';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';


class RouterStub {
    navigate(url: String) { return url}
}
const routerstub = new RouterStub();
const AuthserviceMock = {
    user: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true})
};

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard ,
        {provide : AuthServiceService, useValue : AuthserviceMock},
        {provide : Router, useValue : routerstub}
      ]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
