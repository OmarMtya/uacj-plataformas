import { createReducer, on } from '@ngrx/store';
import { Campus } from 'src/app/models/campus.model';
import { Estadistica } from 'src/app/models/estadistica.model';
import { Nivel } from 'src/app/models/nivel.model';
import { Programa } from 'src/app/models/programas.model';
import { Periodo } from '../../models/periodo.model';
import * as trayectoria from '../actions/trayectoria.actions';

export interface TrayectoriaState {
  cargando: boolean;
  error: any;
  periodos: Periodo[];
  campus: Campus[];
  niveles: Nivel[];
  programas: Programa[];
  consulta: Estadistica[];
};

const initialState: TrayectoriaState = {
  cargando: false,
  error: null,
  periodos: [],
  campus: [],
  niveles: [],
  programas: [],
  consulta: [],
};

export const trayectoriareducer = createReducer(
  initialState,
  on(trayectoria.getPeriodos, (state) => ({
    ...state,
    cargando: true,
    error: null,
  })),
  on(trayectoria.getPeriodosSuccess, (state, { periodos }) => ({
    ...state,
    cargando: false,
    periodos: [...periodos],
  })),
  on(trayectoria.getPeriodosFailure, (state, { error }) => ({
    ...state,
    cargando: false,
    error: { ...error },
  })),
  on(trayectoria.getCampus, (state) => ({
    ...state,
    cargando: true,
    error: null,
  })),
  on(trayectoria.getCampusSuccess, (state, { campus }) => ({
    ...state,
    cargando: false,
    campus: [...campus],
  })),
  on(trayectoria.getCampusFailure, (state, { error }) => ({
    ...state,
    cargando: false,
    error: { ...error },
  })),
  on(trayectoria.getNiveles, (state) => ({
    ...state,
    cargando: true,
    error: null,
  })),
  on(trayectoria.getNivelesSuccess, (state, { niveles }) => ({
    ...state,
    cargando: false,
    niveles: [...niveles],
  })),
  on(trayectoria.getNivelesFailure, (state, { error }) => ({
    ...state,
    cargando: false,
    error: { ...error },
  })),
  on(trayectoria.getNiveles, (state) => ({
    ...state,
    cargando: true,
    error: null,
  })),
  on(trayectoria.getNivelesSuccess, (state, { niveles }) => ({
    ...state,
    cargando: false,
    niveles: [...niveles],
  })),
  on(trayectoria.getNivelesFailure, (state, { error }) => ({
    ...state,
    cargando: false,
    error: { ...error },
  })),
  on(trayectoria.getProgramas, (state) => ({
    ...state,
    cargando: true,
    error: null,
  })),
  on(trayectoria.getProgramasSuccess, (state, { programas }) => ({
    ...state,
    cargando: false,
    programas: [...programas],
  })),
  on(trayectoria.getProgramasFailure, (state, { error }) => ({
    ...state,
    cargando: false,
    error: { ...error },
  })),
  on(trayectoria.getConsulta, (state) => ({
    ...state,
    cargando: true,
    error: null,
  })),
  on(trayectoria.getConsultaSuccess, (state, { consulta }) => ({
    ...state,
    cargando: false,
    consulta: { ...consulta },
  })),
  on(trayectoria.getConsultaFailure, (state, { error }) => ({
    ...state,
    cargando: false,
    error: { ...error },
  })),
);
