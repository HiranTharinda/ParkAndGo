import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthServiceService} from './auth-service.service';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class LoggedInGuard implements CanActivate {
    constructor(private auth: AuthServiceService, private router: Router) {}

    // If user exists do not activate gaurd
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean>{
        return this.auth.user.pipe(
        take(1),
        map(user => !user),
        tap(loggedIn => {
          console.log(loggedIn);
          if (!loggedIn) {
            console.log('access already');
            this.router.navigate(['/home']);
          }else{
            console.log('continue to login');
          }
        })
        )
    }
}
