import { Estadistica } from './estadistica.model';
export interface Consulta {
  // total_alumnos: {
  //   hombres: Serie;
  //   mujeres: Serie;
  // };
  tarjetas: Tarjeta[];
  rows_tablas: Estadistica[];
}



interface Serie {
  serie: 'Hombres' | 'Mujeres';
  cantidad: number;
}

export interface Tarjeta {
  titulo: string;
  valor?: number | string;
  icono: string;
  clase: string;
}
