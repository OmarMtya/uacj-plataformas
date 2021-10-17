import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as appActions from '../actions/trayectoria.actions';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TrayectoriaEscolarService } from '../../services/trayectoria-escolar.service';
import { Periodo } from '../../models/periodo.model';
import { AppState } from '../app.store';
import { Store } from '@ngrx/store';
import { getPeriodos } from '../actions/form.actions';

@Injectable({
  providedIn: 'root'
})
export class TrayectoriaEffects {

  getConsulta = createEffect(() => {
    return this.actions$.pipe(
      ofType(appActions.getConsulta),
      switchMap(({ rubro, periodo, campus, nivel, programa }) =>
        this.trayectoria.getConsulta(rubro, periodo, campus, nivel, programa).pipe(
          map((data: any) => appActions.getConsultaSuccess({ consulta: data })),
          catchError(error => of(appActions.getConsultaFailure({ error }))))
      ),
    );
  });

  // seleccionarRubro$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(appActions.seleccionarRubro),
  //     tap(({ rubro }) => {
  //       this.store.dispatch(getPeriodos({ rubro }));
  //     }),
  //   );
  // }, {
  //   dispatch: false
  // });

  constructor(
    private actions$: Actions,
    private trayectoria: TrayectoriaEscolarService,
    private store: Store<AppState>
  ) { }
}
