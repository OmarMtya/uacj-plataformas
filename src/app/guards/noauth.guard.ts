import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoauthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: MsalService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let logueado = this.authService.instance.getAllAccounts().length > 0;
    if (logueado) {
      console.log("a plataformas");
      this.router.navigate(['/plataformas']);
    }
    return !logueado;
  }

}
