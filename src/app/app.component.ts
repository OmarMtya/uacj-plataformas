import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from './store/app.store';
import { getTrayectoriaCargando } from './store/selectors/trayectoria.selectors';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  cargando$: Observable<boolean>;
  constructor(
    private store: Store<AppState>
  ) {
    this.cargando$ = this.store.select(getTrayectoriaCargando)
  }
}
