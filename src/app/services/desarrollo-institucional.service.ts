import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Desarrollo, Rubro, Trayectoria } from '../interfaces/rubro.interface';

@Injectable({
  providedIn: 'root'
})
export class DesarrolloInstitucionalService {

  constructor(
    private http: HttpClient
  ) { }

  getCampus(rubro: Rubro<Trayectoria | Desarrollo>, periodo: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_campus/${periodo}`);
  }

  getPeriodos(rubro: Rubro<Trayectoria | Desarrollo>) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_periodos`);
  }

  private getRuta(ruta?: string) {
    return `${environment.server('edi')}${ruta ? ruta : ''}`
  }
}
