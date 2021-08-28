import { ActionReducerMap } from "@ngrx/store";
import { trayectoriareducer, TrayectoriaState } from "./reducers/trayectoria.reducer";

export interface AppState {
  trayectoria: TrayectoriaState
}

export const appreducers: ActionReducerMap<AppState> = {
  trayectoria: trayectoriareducer,
};
