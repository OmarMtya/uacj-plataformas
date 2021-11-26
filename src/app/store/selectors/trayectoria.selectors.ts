import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TrayectoriaState } from "../reducers/trayectoria.reducer";

const getTrayectoriaState = createFeatureSelector<TrayectoriaState>('trayectoria');

export const getRubro = createSelector(
  getTrayectoriaState,
  (state: TrayectoriaState) => state.rubroSeleccionado
);

export const getConsulta = createSelector(
  getTrayectoriaState,
  (state: TrayectoriaState) => state.consulta
);

export const getTrayectoriaCargando = createSelector(getTrayectoriaState, (state: TrayectoriaState) => state.cargando);

export const getfechaCorte = createSelector(getTrayectoriaState, (state: TrayectoriaState) => state.fechaCorte);
