import { ActionReducerMap } from "@ngrx/store";
import { trayectoriareducer, TrayectoriaState } from "./reducers/trayectoria.reducer";
import * as fromRouter from "@ngrx/router-store";
import { Params } from "@angular/router";
import { formreducer, FormState } from "./reducers/form.reducer";

export interface AppState {
  trayectoria: TrayectoriaState,
  router: fromRouter.RouterReducerState,
  form: FormState
}

export const appreducers: ActionReducerMap<AppState> = {
  trayectoria: trayectoriareducer,
  form: formreducer,
  router: fromRouter.routerReducer
};
