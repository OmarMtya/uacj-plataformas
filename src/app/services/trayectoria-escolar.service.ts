import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Rubro } from '../interfaces/rubro.interface';
import { Tarjeta } from '../models/consulta.model';
import { Periodo } from '../models/periodo.model';

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
      let rows_tablas = x[0];
      let total = x[1][0];

      let valores = [];
      Object.keys(total).forEach(function (key, index) {
        if (index == 0) { // Ignorar el valor "Serie"
          return;
        }
        valores.push(total[key]);
      });

      let tarjetas: Tarjeta[] = this.llenarTarjetas(rubro);

      Object.keys(tarjetas).forEach(function (key, index) {
        tarjetas[key].valor = valores[key];
      });

      tarjetas.unshift({
        titulo: 'Campus',
        valor: campus,
        clase: 'orange-card',
        icono: 'location-sharp'
      })

      return { rows_tablas, tarjetas };
    }));
  }

  getFechaCorte(rubro: Rubro, periodo: Periodo) {
    return this.http.get(`${this.getRuta(`/fecha_corte`)}${periodo.desc}/${rubro}`);
  }

  private getRuta(ruta?: string) {
    return `${environment.server}${ruta ? ruta : ''}`
  }


  private llenarTarjetas(rubro: Rubro) {
    switch (rubro) {
      case 'matricula':
        return [
          {
            titulo: 'Nuevo ingreso mujeres',
            clase: 'red-card',
            icono: 'woman'
          },
          {
            titulo: 'Nuevo ingreso hombres',
            clase: 'blue-card',
            icono: 'man'
          },
          {
            titulo: 'Total nuevo ingreso',
            clase: 'green-card',
            icono: 'person-add'
          },
          {
            titulo: 'Reingreso mujeres',
            clase: 'purple-card',
            icono: 'woman'
          },
          {
            titulo: 'Reingreso hombres',
            clase: 'orange-card',
            icono: 'man'
          },
          {
            titulo: 'Total reingreso',
            clase: 'red-card',
            icono: 'refresh'
          },
          {
            titulo: 'Total mujeres',
            clase: 'yellow-card',
            icono: 'woman'
          },
          {
            titulo: 'Total hombres',
            clase: 'blue-card',
            icono: 'man'
          },
          {
            titulo: 'Total matrícula',
            clase: 'green-card',
            icono: 'people'
          },
        ];
      case 'aspirantes':
        return [
          {
            titulo: 'Aspirantes Hombres',
            clase: 'blue-card',
            icono: 'man'
          },
          {
            titulo: 'Aspirantes Mujeres',
            clase: 'red-card',
            icono: 'woman'
          },
          {
            titulo: 'Aspirantes Total',
            clase: 'green-card',
            icono: 'person-add'
          },
          {
            titulo: 'Aceptados Hombres',
            clase: 'orange-card',
            icono: 'man'
          },
          {
            titulo: 'Aceptados Mujeres',
            clase: 'purple-card',
            icono: 'woman'
          },
          {
            titulo: 'Aceptados Total',
            clase: 'red-card',
            icono: 'checkmark'
          },
          {
            titulo: 'Absorcion Total',
            clase: 'yellow-card',
            icono: 'bar-chart'
          },
        ];
      case 'aprobacion':
        return [
          {
            titulo: 'Materias aprobadas',
            clase: 'blue-card',
            icono: 'checkmark'
          },
          {
            titulo: 'Materias reprobadas',
            clase: 'red-card',
            icono: 'close'
          },
          {
            titulo: 'Índice de aprobación',
            clase: 'green-card',
            icono: 'arrow-up'
          },
          {
            titulo: 'Índice de reprobación',
            clase: 'orange-card',
            icono: 'arrow-down'
          },
        ];
      case 'desercion':
        return [
          {
            titulo: 'Reingreso esperado',
            clase: 'blue-card',
            icono: 'man'
          },
          {
            titulo: 'Reingreso real',
            clase: 'red-card',
            icono: 'man'
          },
          {
            titulo: 'Índice de deserción',
            clase: 'green-card',
            icono: 'arrow-up'
          },
        ];
    }
  }
}
