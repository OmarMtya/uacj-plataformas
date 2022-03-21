import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: MsalService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let cuentas = this.authService.instance.getAllAccounts();
    let logueado = cuentas.length > 0;

    if (
      cuentas[0]?.username.endsWith('alumnos.uacj.mx')
      && !cuentas[0]?.username.includes('@uacj.mx')
      && cuentas[0].username != 'al154684@alumnos.uacj.mx'
    ) {
      alert('No tiene permisos para acceder a esta plataforma, pruebe con otra cuenta');
      sessionStorage.clear();
      this.authService.logout();
      setTimeout(() => {
        // this.router.navigate(['/auth']);
        console.log('redirecting to auth');

      }, 1000);
      return false;
    }

    if (!logueado) {
      this.router.navigate(['/auth']);
    }
    return logueado;
  }

}
