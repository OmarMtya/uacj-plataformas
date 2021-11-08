import { createAction, props } from "@ngrx/store";
import { Desarrollo, Rubro, Trayectoria } from "src/app/interfaces/rubro.interface";
import { Campus } from "src/app/models/campus.model";
import { Nivel } from "src/app/models/nivel.model";
import { Periodo } from "src/app/models/periodo.model";
import { Programa } from "src/app/models/programas.model";

export const getPeriodos = createAction(
  '[Form] Get Periodos',
  props<{ rubro: Rubro<Trayectoria | Desarrollo>, plataforma: 'trayectoria' | 'desarrollo' }>()
);

export const getPeriodosSuccess = createAction(
  '[Form] Get Periodos Success',
  props<{ periodos: Periodo[] }>()
);

export const getPeriodosFailure = createAction(
  '[Form] Get Periodos Failure',
  props<{ error: any }>()
);

export const getCampus = createAction(
  '[Form] Get Campus',
  props<{ rubro: Rubro<Trayectoria>, periodo: string }>()
);

export const getCampusSuccess = createAction(
  '[Form] Get Campus Success',
  props<{ campus: Campus[] }>()
);

export const getCampusFailure = createAction(
  '[Form] Get Campus Failure',
  props<{ error: any }>()
);

export const getNiveles = createAction(
  '[Form] Get Niveles',
  props<{ rubro: Rubro<Trayectoria | Desarrollo>, periodo: string, campus: string, plataforma: 'trayectoria' | 'desarrollo' }>()
);

export const getNivelesSuccess = createAction(
  '[Form] Get Niveles Success',
  props<{ niveles: Nivel[] }>()
);

export const getNivelesFailure = createAction(
  '[Form] Get Niveles Failure',
  props<{ error: any }>()
);

export const getProgramas = createAction(
  '[Form] Get Programas',
  props<{ rubro: Rubro<Trayectoria | Desarrollo>, periodo: string, campus: string, nivel: string, plataforma: 'trayectoria' | 'desarrollo' }>()
);

export const getProgramasSuccess = createAction(
  '[Form] Get Programas Success',
  props<{ programas: Programa[] }>()
);

export const getProgramasFailure = createAction(
  '[Form] Get Programas Failure',
  props<{ error: any }>()
);
