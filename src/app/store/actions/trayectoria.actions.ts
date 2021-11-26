import { createAction, props } from "@ngrx/store";
import { Desarrollo, Rubro, Trayectoria } from "src/app/interfaces/rubro.interface";
import { Campus } from "src/app/models/campus.model";
import { Estadistica } from "src/app/models/estadistica.model";
import { Nivel } from "src/app/models/nivel.model";
import { Programa } from "src/app/models/programas.model";
import { Periodo } from '../../models/periodo.model';
import { Consulta } from '../../models/consulta.model';


export const getConsulta = createAction(
  '[Trayectoria] Get Consulta',
  props<{ rubro: Rubro<Trayectoria>, periodo: string, campus: string, nivel: string, programa: string }>()
);

export const getConsultaSuccess = createAction(
  '[Trayectoria] Get Consulta Success',
  props<{ consulta: Consulta }>()
);

export const getConsultaFailure = createAction(
  '[Trayectoria] Get Consulta Failure',
  props<{ error: any }>()
);

export const seleccionarRubro = createAction(
  '[Trayectoria] Seleccionar Rubro',
  props<{ rubro: Rubro<Trayectoria | Desarrollo> }>()
);

export const getCorteInformacion = createAction(
  '[Trayectoria] Get Corte Informacion',
  props<{ rubro: Rubro<Trayectoria | Desarrollo>, periodo: string }>()
);

export const getCorteInformacionSuccess = createAction(
  '[Trayectoria] Get Corte Informacion Success',
  props<{ data: { fuente: string; fecha_corte: string } }>()
);

export const getCorteInformacionFailure = createAction(
  '[Trayectoria] Get Corte Informacion Failure',
  props<{ error: any }>()
);
