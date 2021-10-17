import { createAction, props } from "@ngrx/store";
import { Rubro } from "src/app/interfaces/rubro.interface";
import { Campus } from "src/app/models/campus.model";
import { Estadistica } from "src/app/models/estadistica.model";
import { Nivel } from "src/app/models/nivel.model";
import { Programa } from "src/app/models/programas.model";
import { Periodo } from '../../models/periodo.model';
import { Consulta } from '../../models/consulta.model';


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

export const seleccionarRubro = createAction(
  '[Trayectoria] Seleccionar Rubro',
  props<{ rubro: Rubro }>()
);
