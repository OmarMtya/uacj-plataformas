import { Estadistica } from './estadistica.model';
export interface Consulta {
  tarjetas: Tarjeta[];
  tabla: {
    headers: string[];
    rows: any[][];
  }
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
