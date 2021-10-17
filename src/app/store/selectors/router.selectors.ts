import { RouterReducerState } from "@ngrx/router-store";
import { createFeatureSelector, createSelector } from "@ngrx/store";

const getRouterState = createFeatureSelector<RouterReducerState>('router');

export const getRubroTE = createSelector(
  getRouterState,
  (state: RouterReducerState) => state.state.root.firstChild.firstChild.firstChild.firstChild.params.rubro
);
