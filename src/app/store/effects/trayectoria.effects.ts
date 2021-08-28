import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as appActions from '../actions/trayectoria.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TrayectoriaEscolarService } from '../../services/trayectoria-escolar.service';
import { Periodo } from '../../models/periodo.model';

@Injectable({
  providedIn: 'root'
})
export class TrayectoriaEffects {
  constructor(
    private actions$: Actions,
    private trayectoria: TrayectoriaEscolarService
  ) { }

  getPeriodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(appActions.getPeriodos),
      switchMap(({ rubro }) =>
        this.trayectoria.getPeriodos(rubro).pipe(
          map((data: Periodo[]) => appActions.getPeriodosSuccess({ periodos: data })),
          catchError(error => of(appActions.getPeriodosFailure({ error }))))
      ),
    );
  });

}
