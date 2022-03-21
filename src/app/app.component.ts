import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from './store/app.store';
import { getTrayectoriaCargando } from './store/selectors/trayectoria.selectors';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  cargando$: Observable<boolean>;
  isIframe: boolean = false;
  loginDisplay = false;

  constructor(
    private store: Store<AppState>,
    private authService: MsalService
  ) {
    this.cargando$ = this.store.select(getTrayectoriaCargando);
  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    let allAccounts = this.authService.instance.getAllAccounts();
    console.log(allAccounts);
  }

  login() {
    this.authService.loginRedirect();
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }
}
