import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Rubro } from '../interfaces/rubro.interface';

@Injectable({
  providedIn: 'root'
})
export class TrayectoriaEscolarService {

  constructor(
    private http: HttpClient
  ) { }

  getPeriodos(rubro: Rubro) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_periodos`);
  }

  getCampus(rubro: Rubro, periodo: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_campus/${periodo}`);
  }

  getNiveles(rubro: Rubro, periodo: string, campus: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_nivel/${periodo}/${campus}`);
  }

  getProgramas(rubro: Rubro, periodo: string, campus: string, nivel: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_programa/${periodo}/${campus}/${nivel}`);
  }

  getConsulta(rubro: Rubro, periodo: string, campus: string, nivel: string, programa: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_${rubro}/${periodo}/${campus}/${nivel}/${programa}`).pipe(map((x: any) => {
      let tarjetas = x[0][0];
      let total = x[1][0];
      let total_alumnos = {hombres: x[2][0], mujeres: x[2][1]};
      return { tarjetas, total, total_alumnos };
    }));
  }

  private getRuta(ruta?: string) {
    return `${environment.server}${ruta ? ruta : ''}`
  }
}
