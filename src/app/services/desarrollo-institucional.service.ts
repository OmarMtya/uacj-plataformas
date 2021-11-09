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

  tipos_consultas = [
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

  constructor(
    private http: HttpClient
  ) { }

  getCampus(rubro: Rubro<Trayectoria | Desarrollo>, periodo: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_campus`);
  }

  getPeriodos(rubro: Rubro<Trayectoria | Desarrollo>) {
    return (<Observable<{ desc: string }[]>>of([{ "desc": "2020" }]));
  }

  getDepartamentos(rubro: Rubro<Trayectoria | Desarrollo>, campus: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/${campus}`);
  }

  getProgramas(rubro: Rubro<Trayectoria | Desarrollo>, campus: string, departamento: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/${campus}/${departamento}`);
  }

  getConsultas(rubro: Rubro<Trayectoria | Desarrollo>, campus: string, departamento: string, programa: string) {
    return forkJoin(this.tipos_consultas.map((consulta) => this.http.get(`${this.getRuta(`/${rubro}`)}/${consulta}/${campus}/${departamento}/${programa}`).pipe(map((x) => ({ consulta, resultado: x })))));
  }

  private getRuta(ruta?: string) {
    return `${environment.server('edi')}${ruta ? ruta : ''}`
  }
}
