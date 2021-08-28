import { createReducer, on } from '@ngrx/store';
import { Periodo } from '../../models/periodo.model';
import * as trayectoria from '../actions/trayectoria.actions';

export interface TrayectoriaState {
  cargando: boolean;
  error: any;
  periodos: Periodo[];
};

const initialState: TrayectoriaState = {
  cargando: false,
  error: null,
  periodos: [],
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
);
