import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Desarrollo, Rubro, Trayectoria } from '../interfaces/rubro.interface';

@Injectable({
  providedIn: 'root'
})
export class DesarrolloInstitucionalService {

  constructor(
    private http: HttpClient
  ) { }

  getCampus(rubro: Rubro<Desarrollo | Trayectoria>, periodo: string) {
    if (rubro == 'seguimiento2' || rubro == 'seguimiento5') {
      return of(([
        {
          "desc": "DMNCG"
        },
        {
          "desc": "DMC"
        },
        {
          "desc": "DMCU"
        },
        {
          "desc": "IADA"
        },
        {
          "desc": "ICB"
        },
        {
          "desc": "ICSA"
        },
        {
          "desc": "IIT"
        }
      ]));
    }
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_campus`);
  }

  getPeriodos(rubro: Rubro<Desarrollo | Trayectoria>) {
    if (rubro == 'avance_padron_egreso') {
      return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_periodos`);
    }
    return (<Observable<{ desc: string }[]>>of([{ "desc": "2020" }]));
  }

  getDepartamentos(rubro: Rubro<Desarrollo | Trayectoria>, campus: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/${campus}`);
  }

  getProgramas(rubro: Rubro<Desarrollo | Trayectoria>, campus: string, departamento: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/${campus}/${departamento}`);
  }

  getConsultas(rubro: Rubro<Desarrollo | Trayectoria>, campus: string, departamento: string, programa: string): Observable<any[]> {

    let consultasSeleccionadas;
    switch (rubro) {
      case 'padron_licenciatura':
        consultasSeleccionadas = [
          'estado_civil',
          'sexo',
          'lugar_origen',
          'dependientes_economicos',
          'beca',
          'beca_tipo',
          'estancia_academica',
          'estancia_academica_tipo',
          'estancia_academica_apoyo',
          'estancia_academica_destino',
          'servicio_social',
          'practicas_profesionales',
          'estudio_interrumpido',
          'estudio_interrumpido_tipo',
          'trabajo_actual',
          'trabajo_acutal_sector',
          'trabajo_acutal_tipo_contrato',
          'trabajo_acutal_relacion_carrera',
          'trabajo_acutal_ingreso_mensual',
          'trabajo_estudio',
          'evaluacion_plan',
          'comentarios',
          'escoger_uacj',
          'estudiar_posgrado_uacj',
        ];
        break;
      case 'padron_posgrado':
        consultasSeleccionadas = [
          'estado_civil',
          'sexo',
          'lugar_origen',
          'dependientes_economicos',
          'tipo_residencia',
          'beca',
          'beca_tipo',
          'estancia_academica',
          'estancia_academica_tipo',
          'estancia_academica_apoyo',
          'estancia_academica_destino',
          'publicaciones',
          'publicaciones_tipo',
          'trabajo_actual',
          'trabajo_acutal_sector',
          'trabajo_acutal_tipo_contrato',
          'trabajo_acutal_relacion_carrera',
          'trabajo_acutal_ingreso_mensual',
          'evaluacion_plan',
          'comentarios',
          'escoger_uacj',
        ];
        break;
      case 'seguimiento2':
        consultasSeleccionadas = [
          'estado_civil',
          'sexo',
          'rango_edad',
          'dependientes_economicos',
          'tipo_residencia',
          'titulacion',
          'titulacion_dificultad',
          'grado_maximo',
          'estudios_posgrado',
          'tipo_beca',
          'beca_posgrado',
          'trabajo_actual',
          'trabajo_actual_tiempo',
          'trabajo_acutal_uso_ingles',
          'trabajo_acutal_regimen_juridico',
          'trabajo_acutal_tipo_contrato',
          'trabajo_acutal_nivel_jerarquico',
          'trabajo_acutal_relacion_carrera',
          'formacion_uacj',
          'trabajo_acutal_ingreso_mensual',
          'trabajo_acutal_valoracion',
          'trabajo_acutal_promocion',
          'evaluacion_uacj',
          'comentarios',
        ];
      case 'seguimiento5':
        consultasSeleccionadas = [
          'estado_civil',
          'sexo',
          'rango_edad',
          'dependientes_economicos',
          'tipo_residencia',
          'titulacion',
          'titulacion_dificultad',
          'grado_maximo',
          'estudios_posgrado',
          'tipo_beca',
          'beca_posgrado',
          'trabajo_actual',
          'trabajo_actual_tiempo',
          'trabajo_acutal_uso_ingles',
          'trabajo_acutal_regimen_juridico',
          'trabajo_acutal_tipo_contrato',
          'trabajo_acutal_nivel_jerarquico',
          'trabajo_acutal_relacion_carrera',
          'trabajo_acutal_ingreso_mensual',
          'trabajo_acutal_valoracion',
          'trabajo_acutal_promocion',
          'evaluacion_uacj',
          'comentarios',
        ];
        break;
      case 'avance_padron_egreso':
        consultasSeleccionadas = [
          'consulta_avance'
        ];
        break;
    }
    return forkJoin((consultasSeleccionadas).map((consulta) => this.http.get(`${this.getRuta(`/${rubro}`)}/${consulta}/${campus}/${departamento}/${programa}`).pipe(map((x: any[]) => {
      switch (consulta) { // Debido a que los datos que devuelve el backend son diferentes, se hace un switch para cada consulta diferente, para que quede genérico
        case 'sexo':
          return ({
            consulta, resultado: [
              {
                serie: 'Hombres',
                cantidad: x[0].hombres
              },
              {
                serie: 'Mujeres',
                cantidad: x[0].mujeres
              },
            ]
          });
        case 'evaluacion_plan':
          return ({ consulta, resultado: x[0] });
        case 'evaluacion_uacj':
          return ({ consulta, resultado: x[0] });
        case 'comentarios':
          return ({ consulta, resultado: x });
        default:
          return ({ consulta, resultado: x });
      }

    }))));
  }

  private getRuta(ruta?: string) {
    return `${environment.server('edi')}${ruta ? ruta : ''}`
  }
}
