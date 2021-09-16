import { Estadistica } from './estadistica.model';
export interface Consulta {
  total_alumnos: {
    hombres: Serie;
    mujeres: Serie;
  };
  total: Estadistica;
  tarjetas: Estadistica[];

}



interface Serie {
  serie: 'Hombres' | 'Mujeres';
  cantidad: number;
}
