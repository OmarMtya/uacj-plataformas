import { createReducer, on } from '@ngrx/store';
import { Campus } from 'src/app/models/campus.model';
import { Estadistica } from 'src/app/models/estadistica.model';
import { Nivel } from 'src/app/models/nivel.model';
import { Programa } from 'src/app/models/programas.model';
import { Periodo } from '../../models/periodo.model';
import * as trayectoria from '../actions/trayectoria.actions';

import { Consulta } from '../../models/consulta.model';
import { Rubro } from 'src/app/interfaces/rubro.interface';

export interface TrayectoriaState {
  cargando: boolean;
  error: any;
  periodos: Periodo[];
  campus: Campus[];
  niveles: Nivel[];
  programas: Programa[];
  consulta: Consulta;
  rubroSeleccionado: Rubro;
};

const initialState: TrayectoriaState = {
  cargando: false,
  error: null,
  periodos: [],
  campus: [],
  niveles: [],
  programas: [],
  consulta: null,
  rubroSeleccionado: 'matricula'
};

export const trayectoriareducer = createReducer(
  initialState,
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
  on(trayectoria.seleccionarRubro, (state, { rubro }) => ({
    ...state,
    rubroSeleccionado: rubro
  }))
);
