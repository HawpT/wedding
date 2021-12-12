import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '@service/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public apiService: ApiService,
    public router: Router,
    private ngZone: NgZone
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.apiService.isLoggedIn !== true) {

      // not logged in so redirect to login page with the return url
      this.ngZone.run(() => this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } }));
      // not authorized
      return false;
    }

    return true;
  }
}
