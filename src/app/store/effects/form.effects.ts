import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Periodo } from 'src/app/models/periodo.model';
import { DesarrolloInstitucionalService } from 'src/app/services/desarrollo-institucional.service';
import { TrayectoriaEscolarService } from 'src/app/services/trayectoria-escolar.service';
import * as appActions from '../actions/form.actions';

@Injectable({
  providedIn: 'root'
})
export class FormEffects {
  constructor(
    private actions$: Actions,
    private trayectoria: TrayectoriaEscolarService,
    private desarrollo: DesarrolloInstitucionalService
  ) { }

  getPeriodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(appActions.getPeriodos),
      switchMap(({ rubro, plataforma }) => {
        return this.getService(plataforma).getPeriodos(rubro).pipe(
          map((data: Periodo[]) => appActions.getPeriodosSuccess({ periodos: data })),
          catchError(error => of(appActions.getPeriodosFailure({ error }))))
      }),
    );
  });

  getCampus = createEffect(() => {
    return this.actions$.pipe(
      ofType(appActions.getCampus),
      switchMap(({ rubro, periodo, plataforma }) =>
        this.getService(plataforma).getCampus(rubro, periodo).pipe(
          map((data: any[]) => {
            return appActions.getCampusSuccess({ campus: data });
          }),
          catchError(error => of(appActions.getCampusFailure({ error }))))
      ),
    );
  });

  getNiveles = createEffect(() => {
    return this.actions$.pipe(
      ofType(appActions.getNiveles),
      switchMap(({ rubro, periodo, campus, departamento, plataforma }) =>
        this.getService(plataforma).getNiveles(rubro, periodo, campus, departamento).pipe(
          map((data: any[]) => appActions.getNivelesSuccess({ niveles: data })),
          catchError(error => of(appActions.getNivelesFailure({ error }))))
      ),
    );
  });

  getProgramas = createEffect(() => {
    return this.actions$.pipe(
      ofType(appActions.getProgramas),
      switchMap(({ rubro, periodo, campus, nivel, plataforma, departamento }) =>
        // En desarrollo no le pasan periodo, solamente utilizan 2020, van a tener un gran problema cuando quieran agregar otro periodo. Lo correcto sería haber aceptado el periodo aunque siempre sea el mismo, permitiría el procesado dinámico de distintos periodos
        this.getService(plataforma).getProgramas(rubro, periodo, campus, nivel, departamento).pipe(
          map((data: any[]) => appActions.getProgramasSuccess({ programas: data })),
          catchError(error => of(appActions.getProgramasFailure({ error }))))
      ),
    );
  });

  getDepartamentos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(appActions.getDepartamentos),
      switchMap(({ rubro, campus, periodo }) =>
        this.desarrollo.getDepartamentos(rubro, campus, periodo).pipe(
          map((data: any[]) => appActions.getDepartamentosSuccess({ departamentos: data })),
          catchError(error => of(appActions.getDepartamentosFailure({ error }))))
      ),
    );
  });

  getService(servicio: 'trayectoria' | 'desarrollo') {
    switch (servicio) {
      case 'trayectoria':
        return this.trayectoria;
      case 'desarrollo':
        return this.desarrollo;
    }
  }

}
