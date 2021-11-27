export type Rubro<T> = T;

export type Trayectoria = 'matricula' | 'aspirantes' | 'aprobacion' | 'desercion' | 'retencion' | 'eficiencia_terminal' | 'egresados' | 'titulados';
export type Desarrollo = 'padron_licenciatura' | 'padron_posgrado' | 'seguimiento2' | 'seguimiento5' | 'avance_padron_egreso' | 'avance_seguimiento_2' | 'avance_seguimiento_5';

export const Trayectorias = [
  { rubro: 'matricula', display: 'matricula' },
  { rubro: 'aspirantes', display: 'aspirantes' },
  { rubro: 'aprobacion', display: 'aprobación' },
  { rubro: 'desercion', display: 'deserción' },
  { rubro: 'retencion', display: 'retención' },
  { rubro: 'eficiencia_terminal', display: 'eficiencia_terminal' },
  { rubro: 'egresados', display: 'egresados' },
  { rubro: 'titulados', display: 'titulados' }
];
export const Desarrollos = [
  { rubro: 'padron_licenciatura', display: 'padrón_licenciatura' },
  { rubro: 'padron_posgrado', display: 'padrón_posgrado' },
  { rubro: 'seguimiento2', display: 'seguimiento2' },
  { rubro: 'seguimiento5', display: 'seguimiento5' },
  { rubro: 'avance_padron_egreso', display: 'avance_padrón_egreso' },
  { rubro: 'avance_seguimiento_2', display: 'avance_seguimiento_2' },
  { rubro: 'avance_seguimiento_5', display: 'avance_seguimiento_5' }
];
