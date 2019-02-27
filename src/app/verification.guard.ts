import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthServiceService} from './auth-service.service';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VerificationGuard implements CanActivate {
  constructor(private auth: AuthServiceService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>{

      return this.auth.user.pipe(
      take(1),
      map(user => user.emailVerified),
      tap(verified => {
        if (!verified) {
        console.log('not verified');
        this.router.navigate(['/waiting-verification']);
      }else{
        console.log('verified');
      }
      })
      )
  }
}
