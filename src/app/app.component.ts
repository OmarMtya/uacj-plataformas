import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
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
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {
    this.cargando$ = this.store.select(getTrayectoriaCargando);
  }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
    let allAccounts = this.authService.instance.getAllAccounts();

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        window.location.reload();
        console.log(result);
      });
  }

  login() {
    this.authService.loginRedirect();
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }
}
