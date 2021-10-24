import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Periodo } from 'src/app/models/periodo.model';
import { TrayectoriaEscolarService } from 'src/app/services/trayectoria-escolar.service';
import * as appActions from '../actions/form.actions';

@Injectable({
  providedIn: 'root'
})
export class FormEffects {
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

  getCampus = createEffect(() => {
    return this.actions$.pipe(
      ofType(appActions.getCampus),
      switchMap(({ rubro, periodo }) =>
        this.trayectoria.getCampus(rubro, periodo).pipe(
          map((data: any) => appActions.getCampusSuccess({ campus: data })),
          catchError(error => of(appActions.getCampusFailure({ error }))))
      ),
    );
  });

  getNiveles = createEffect(() => {
    return this.actions$.pipe(
      ofType(appActions.getNiveles),
      switchMap(({ rubro, periodo, campus }) =>
        this.trayectoria.getNiveles(rubro, periodo, campus).pipe(
          map((data: any) => appActions.getNivelesSuccess({ niveles: data })),
          catchError(error => of(appActions.getNivelesFailure({ error }))))
      ),
    );
  });

  getProgramas = createEffect(() => {
    return this.actions$.pipe(
      ofType(appActions.getProgramas),
      switchMap(({ rubro, periodo, campus, nivel }) =>
        this.trayectoria.getProgramas(rubro, periodo, campus, nivel).pipe(
          map((data: any) => appActions.getProgramasSuccess({ programas: data })),
          catchError(error => of(appActions.getProgramasFailure({ error }))))
      ),
    );
  });

}