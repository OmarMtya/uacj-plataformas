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

  padron_egreso_licenciatura = [
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

  padron_egreso_posgrado = [
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

  constructor(
    private http: HttpClient
  ) { }

  getCampus(rubro: Rubro<Desarrollo | Trayectoria>, periodo: string) {
    if (rubro == 'seguimiento2') {
      console.log("entro aquí papucho");
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
        consultasSeleccionadas = this.padron_egreso_licenciatura;
        break;
      case 'padron_posgrado':
        consultasSeleccionadas = this.padron_egreso_posgrado;
        break;
      default:
        consultasSeleccionadas = this.padron_egreso_licenciatura;
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
