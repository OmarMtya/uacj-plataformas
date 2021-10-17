import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FormState } from "../reducers/form.reducer";

const getFormState = createFeatureSelector<FormState>('form');

export const getCampus = createSelector(
  getFormState,
  (state: FormState) => state.campus
);

export const getPeriodos = createSelector(
  getFormState,
  (state: FormState) => state.periodos
);

export const getNiveles = createSelector(
  getFormState,
  (state: FormState) => state.niveles
);

export const getProgramas = createSelector(
  getFormState,
  (state: FormState) => state.programas
);
