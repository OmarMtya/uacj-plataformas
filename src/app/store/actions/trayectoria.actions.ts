import { createAction, props } from "@ngrx/store";
import { Rubro } from "src/app/interfaces/rubro.interface";
import { Campus } from "src/app/models/campus.model";
import { Estadistica } from "src/app/models/estadistica.model";
import { Nivel } from "src/app/models/nivel.model";
import { Programa } from "src/app/models/programas.model";
import { Periodo } from '../../models/periodo.model';
import { Consulta } from '../../models/consulta.model';

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

export const getCampus = createAction(
  '[Trayectoria] Get Campus',
  props<{ rubro: Rubro, periodo: string }>()
);

export const getCampusSuccess = createAction(
  '[Trayectoria] Get Campus Success',
  props<{ campus: Campus[] }>()
);

export const getCampusFailure = createAction(
  '[Trayectoria] Get Campus Failure',
  props<{ error: any }>()
);

export const getNiveles = createAction(
  '[Trayectoria] Get Niveles',
  props<{ rubro: Rubro, periodo: string, campus: string }>()
);

export const getNivelesSuccess = createAction(
  '[Trayectoria] Get Niveles Success',
  props<{ niveles: Nivel[] }>()
);

export const getNivelesFailure = createAction(
  '[Trayectoria] Get Niveles Failure',
  props<{ error: any }>()
);

export const getProgramas = createAction(
  '[Trayectoria] Get Programas',
  props<{ rubro: Rubro, periodo: string, campus: string, nivel: string }>()
);

export const getProgramasSuccess = createAction(
  '[Trayectoria] Get Programas Success',
  props<{ programas: Programa[] }>()
);

export const getProgramasFailure = createAction(
  '[Trayectoria] Get Programas Failure',
  props<{ error: any }>()
);

export const getConsulta = createAction(
  '[Trayectoria] Get Consulta',
  props<{ rubro: Rubro, periodo: string, campus: string, nivel: string, programa: string }>()
);

export const getConsultaSuccess = createAction(
  '[Trayectoria] Get Consulta Success',
  props<{ consulta: Consulta }>()
);

export const getConsultaFailure = createAction(
  '[Trayectoria] Get Consulta Failure',
  props<{ error: any }>()
);
