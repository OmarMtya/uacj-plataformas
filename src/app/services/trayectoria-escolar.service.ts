import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    return this.http.get(`${this.getRuta()}/${rubro}/consulta_periodos`);
  }

  private getRuta(ruta?: string) {
    return `${environment.server}${ruta ? ruta : ''}`
  }
}
