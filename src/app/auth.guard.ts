import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthServiceService} from './auth-service.service';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthServiceService, private router: Router) {}

    // Allow to activate if authservice maintains a user instance
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean>{

        return this.auth.user.pipe(
        take(1),
        map(user => !!user),
        tap(loggedIn => {
          if (!loggedIn) {
          console.log('access denied')
          this.router.navigate(['/login']);
          }
        })
        )
    }
}
