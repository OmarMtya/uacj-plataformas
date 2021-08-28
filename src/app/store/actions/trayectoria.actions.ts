import { createAction, props } from "@ngrx/store";
import { Rubro } from "src/app/interfaces/rubro.interface";
import { Periodo } from '../../models/periodo.model';

export const getPeriodos = createAction(
  '[Trayectoria] Get Periodos',
  props<{ rubro: Rubro }>()
);

export const getPeriodosSuccess = createAction(
  '[Trayectoria] Get Periodos Success',
  props<{ periodos: Periodo[] }>()
);

export const getPeriodosFailure = createAction(
  '[Trayectoria] Get Periodos Failure',
  props<{ error: any }>()
);
