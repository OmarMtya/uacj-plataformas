import { createReducer, on, State } from '@ngrx/store';
import { Campus } from 'src/app/models/campus.model';
import { Nivel } from 'src/app/models/nivel.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programa } from 'src/app/models/programas.model';
import * as form from '../actions/form.actions';

export interface FormState {
  periodos: Periodo[];
  campus: Campus[];
  niveles: Nivel[];
  programas: Programa[];
};

const initialState: FormState = {
    periodos: [],
    campus: [],
    niveles: [],
    programas: []
};

export const formreducer = createReducer(
  initialState,
  on(form.getPeriodos, (state) => ({
    ...state,
    cargando: true,
    error: null,
  })),
  on(form.getPeriodosSuccess, (state, { periodos }) => ({
    ...state,
    cargando: false,
    periodos: [...periodos],
  })),
  on(form.getPeriodosFailure, (state, { error }) => ({
    ...state,
    cargando: false,
    error: { ...error },
  })),
  on(form.getCampus, (state) => ({
    ...state,
    cargando: true,
    error: null,
  })),
  on(form.getCampusSuccess, (state, { campus }) => ({
    ...state,
    cargando: false,
    campus: [...campus],
  })),
  on(form.getCampusFailure, (state, { error }) => ({
    ...state,
    cargando: false,
    error: { ...error },
  })),
  on(form.getNiveles, (state) => ({
    ...state,
    cargando: true,
    error: null,
  })),
  on(form.getNivelesSuccess, (state, { niveles }) => ({
    ...state,
    cargando: false,
    niveles: [...niveles],
  })),
  on(form.getNivelesFailure, (state, { error }) => ({
    ...state,
    cargando: false,
    error: { ...error },
  })),
  on(form.getNiveles, (state) => ({
    ...state,
    cargando: true,
    error: null,
  })),
  on(form.getNivelesSuccess, (state, { niveles }) => ({
    ...state,
    cargando: false,
    niveles: [...niveles],
  })),
  on(form.getNivelesFailure, (state, { error }) => ({
    ...state,
    cargando: false,
    error: { ...error },
  })),
  on(form.getProgramas, (state) => ({
    ...state,
    cargando: true,
    error: null,
  })),
  on(form.getProgramasSuccess, (state, { programas }) => ({
    ...state,
    cargando: false,
    programas: [...programas],
  })),
  on(form.getProgramasFailure, (state, { error }) => ({
    ...state,
    cargando: false,
    error: { ...error },
  })),
);
