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

  constructor(
    private actions$: Actions,
    private trayectoria: TrayectoriaEscolarService
  ) { }
}
