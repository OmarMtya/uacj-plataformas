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
