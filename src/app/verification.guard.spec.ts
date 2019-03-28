import { TestBed, async, inject } from '@angular/core/testing';

import { VerificationGuard } from './verification.guard';
import { of, Observable } from 'rxjs';
import { AuthServiceService} from './auth-service.service';
import { Router } from '@angular/router';

const AuthserviceMock = {
    user: of({ uid: 'ABC123' , email:'ranika@gmail.com' , displayName:'okay', photoURL:'/img.jpg', emailVerified:true})
};

class RouterStub {
    navigate(url: String) { return url}
}
const routerstub = new RouterStub();


describe('VerificationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerificationGuard,
      {provide : AuthServiceService, useValue : AuthserviceMock},
      {provide : Router, useValue : routerstub}],
    });
  });

  it('should ...', inject([VerificationGuard], (guard: VerificationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
