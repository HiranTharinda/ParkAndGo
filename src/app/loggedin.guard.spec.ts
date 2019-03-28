import { TestBed, async, inject } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { LoggedInGuard } from './loggedin.guard';
import { AuthServiceService} from './auth-service.service';
import { Router } from '@angular/router';

const AuthserviceMock = {
    user: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true})
};

class RouterStub {
    navigate(url: String) { return url}
}
const routerstub = new RouterStub();

describe('LoggedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedInGuard ,
        {provide : AuthServiceService, useValue : AuthserviceMock},
        {provide : Router, useValue : routerstub}
      ]
    });
  });

  it('should ...', inject([LoggedInGuard], (guard: LoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});
