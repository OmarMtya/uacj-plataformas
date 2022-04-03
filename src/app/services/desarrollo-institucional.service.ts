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
    } else {
      return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_campus/${periodo}`);
    }
  }

  getPeriodos(rubro: Rubro<Desarrollo | Trayectoria>) {
    if (rubro == 'avance_padron_egreso' || rubro == 'avance_seguimiento_2' || rubro == 'avance_seguimiento_5') {
      return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_periodos`);
    }
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_periodo`);
  }

  getDepartamentos(rubro: Rubro<Desarrollo | Trayectoria>, campus: string, periodo: string) {
    if (rubro == 'avance_padron_egreso' || rubro == 'avance_seguimiento_2' || rubro == 'avance_seguimiento_5') {
      return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_departamento/${periodo}/${campus}`);
    }
    return this.http.get(`${this.getRuta(`/${rubro}`)}/${periodo}/${campus}`);
  }

  getProgramas(rubro: Rubro<Trayectoria | Desarrollo>, periodo: string, campus: string, nivel: string, departamento: string) {
    if (rubro == 'avance_padron_egreso' || rubro == 'avance_seguimiento_2' || rubro == 'avance_seguimiento_5') {
      return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_programa/${periodo}/${campus}/${departamento}/${nivel}`);
    }
    return this.http.get(`${this.getRuta(`/${rubro}`)}/${periodo}/${campus}/${departamento}`);
  }

  getNiveles(rubro: Rubro<Trayectoria | Desarrollo>, periodo: string, campus: string, departamento: string) {
    if (rubro == 'avance_padron_egreso' || rubro == 'avance_seguimiento_2' || rubro == 'avance_seguimiento_5') {
      return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_nivel/${periodo}/${campus}/${departamento}`);
    }

    return this.http.get(`${this.getRuta(`/${rubro}`)}/${periodo}/${campus}/${departamento}`);
  }

  getConsultas(rubro: Rubro<Desarrollo | Trayectoria>, campus: string, departamento: string, programa: string, nivel: string, periodo: string): Observable<any[]> {

    let consultasSeleccionadas;
    switch (rubro) {
      case 'padron_licenciatura':
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
          'servicio_social',
          'practicas_profesionales',
          'estudio_interrumpido',
          'estudio_interrumpido_tipo',
          'trabajo_estudio',
          'trabajo_actual',
          'trabajo_acutal_sector',
          'trabajo_acutal_tipo_contrato',
          'trabajo_acutal_relacion_carrera',
          'trabajo_acutal_ingreso_mensual',
          'evaluacion_plan',
          'evaluacion_plan',
          'evaluacion_plan',
          'comentarios',
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
          'estudios_posgrado',
          'grado_maximo',
          'beca_posgrado',
          'tipo_beca',
          'titulacion',
          'titulacion_dificultad',
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
          'evaluacion_uacj',
          'comentarios',
        ];
        break;
      case 'seguimiento5':
        consultasSeleccionadas = [
          'estado_civil',
          'sexo',
          'rango_edad',
          'dependientes_economicos',
          'tipo_residencia',
          'estudios_posgrado',
          'grado_maximo',
          'beca_posgrado',
          'tipo_beca',
          'titulacion',
          'titulacion_dificultad',
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
          'evaluacion_uacj',
          'comentarios',
        ];
        break;
    }

    if (rubro == 'avance_padron_egreso' || rubro == 'avance_seguimiento_2' || rubro == 'avance_seguimiento_5') {
      return forkJoin([this.http.get<any[]>(`${this.getRuta(`/${rubro}`)}/consulta_avance/${periodo}/${campus}/${departamento}/${nivel}/${programa}`).pipe(map((x) => {
        if (programa != 'Todos') {
          return [{
            consulta: programa,
            resultado: x[0],
            original: x
          }];
        }

        return x[0].map((y) => ({
          consulta: y.serie,
          resultado: [
            {
              serie: 'Contestadas',
              cantidad: y.contestadas
            },
            {
              serie: 'No Contestadas',
              cantidad: y.no_contestadas
            }
          ],
          original: x
        }));
      }))]);
    }

    let evaluacionEncontrada = 0;
    let evaluacionEncontradaUACJ = 0;

    return forkJoin((consultasSeleccionadas).map((consulta) => this.http.get(`${this.getRuta(`/${rubro}`)}/${consulta}/${periodo}/${campus}/${departamento}/${programa}`).pipe(map((x: any[]) => {
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
          let evaluacion = x[evaluacionEncontrada];

          if (isNaN(evaluacion)) {

            switch (evaluacionEncontrada++) {
              case 0:
                consulta = 'valoracion_del_programa_educativo';
                break;
              case 1:
                consulta = 'valoracion_de_la_institucion';
                break;
            }

            return ({ consulta, resultado: evaluacion });
          }
          return ({ consulta, resultado: evaluacion, ignorar: true });
        case 'evaluacion_uacj':
          let evaluacion2 = x[evaluacionEncontradaUACJ];

          if (isNaN(evaluacion2)) {
            switch (evaluacionEncontradaUACJ++) {
              case 0:
                consulta = 'valoracion_del_programa_educativo';
                break;
            }
            return ({ consulta, resultado: evaluacion2 });
          }
          return ({ consulta, resultado: evaluacion2, ignorar: true });
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
