import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Desarrollo, Rubro } from '../interfaces/rubro.interface';
import { Consulta, Tarjeta } from '../models/consulta.model';
import { Periodo } from '../models/periodo.model';
import { Trayectoria } from '../interfaces/rubro.interface';

@Injectable({
  providedIn: 'root'
})
export class TrayectoriaEscolarService {

  constructor(
    private http: HttpClient
  ) { }

  getPeriodos(rubro: Rubro<Trayectoria | Desarrollo>) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_periodos`);
  }

  getCampus(rubro: Rubro<Trayectoria | Desarrollo>, periodo: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_campus/${periodo}`);
  }

  getNiveles(rubro: Rubro<Trayectoria | Desarrollo>, periodo: string, campus: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_nivel/${periodo}/${campus}`);
  }

  getProgramas(rubro: Rubro<Trayectoria | Desarrollo>, periodo: string, campus: string, nivel: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_programa/${periodo}/${campus}/${nivel}`);
  }

  getConsulta(rubro: Rubro<Trayectoria | Desarrollo>, periodo: string, campus: string, nivel: string, programa: string) {
    return this.http.get(`${this.getRuta(`/${rubro}`)}/consulta_${rubro}/${periodo}/${campus}/${nivel}/${programa}`).pipe(map((x: any) => {
      let rows_tablas = x[0];
      console.log(rows_tablas);

      let tablasFixed = [];

      rows_tablas.forEach(row => {
        let row_antes = [];
        Object.keys(row).forEach((key, index) => {
          if (index == 2) {
            return;
          }
          if (index == 1) {
            row_antes.unshift(row[key]);
          } else {
            row_antes.push(row[key]);
          }
        });
        tablasFixed.push(row_antes);
      });

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

      tarjetas.unshift({ // Agrega como primera tarjeta, el campus
        titulo: 'Campus',
        valor: campus,
        clase: 'orange-card',
        icono: 'location-sharp'
      })

      return {
        tabla: {
          headers: this.llenarTablas(rubro),
          rows: tablasFixed,
        },
        tarjetas
      };
    }));
  }

  getFechaCorte(rubro: Rubro<Trayectoria>, periodo: Periodo) {
    return this.http.get(`${this.getRuta(`/fecha_corte`)}${periodo.desc}/${rubro}`);
  }

  private getRuta(ruta?: string) {
    return `${environment.server('te')}${ruta ? ruta : ''}`
  }

  private llenarTablas(rubro: Rubro<Trayectoria | Desarrollo>) {
    switch (rubro) {
      case 'matricula':
        return [
          'Programa',
          'Campus',
          'Nuevo ingreso Mujeres',
          'Nuevo ingreso hombres',
          'Nuevo ingreso total',
          'Reingreso Mujeres',
          'Reingreso hombres',
          'Reingreso total',
          'Mujeres total',
          'Hombres total',
          'Matrículas totales',
          'Nivel',
        ];
      case 'aspirantes':
        return [
          'Programa',
          'Campus',
          'Aspirantes Mujeres',
          'Aspirantes hombres',
          'Aspirantes total',
          'Aceptados Mujeres',
          'Aceptados hombres',
          'Aceptados total',
          'Número aceptados Total',
          'Número aceptados Mujeres',
          'Número aceptados Hombres',
          'Tasa Absorción Mujeres',
          'Tasa Absorción Hombres',
          'Tasa Absorción Total',
          'Nivel',
        ];
      case 'aprobacion':
        return [
          'Programa',
          'Campus',
          'Materias aprobadas',
          'Materias reprobadas',
          'Índice de aprobación',
          'Índice de reprobación',
          'Nivel',
        ];
      case 'desercion':
        return [
          'Programa',
          'Campus',
          'Reingreso Esperado',
          'Reingreso Real',
          'Índice de Deserción',
          'Nivel',
        ];
      case 'retencion':
        return [
          'Programa',
          'Campus',
          'Índice retención reingreso',
          'Índice retención nuevo ingreso',
          'Nivel',
        ];
      case 'eficiencia_terminal':
        return [
          'Programa',
          'Campus',
          'Egresados',
          'Duración periodo',
          'Periodo inicio',
          'Índice de Eficiencia Terminal',
          'Nuevo Ingreso Periodo Inicio',
          'Nivel',
        ];
      case 'egresados':
        return [
          'Programa',
          'Campus',
          'Mujeres',
          'Hombres',
          'Total',
          'Nivel',
        ];
      case 'titulados':
        return [
          'Programa',
          'Campus',
          'Mujeres',
          'Hombres',
          'Total',
          'Nivel',
        ];
    }
  }

  private llenarTarjetas(rubro: Rubro<Trayectoria | Desarrollo>) {
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
      case 'retencion':
        return [
          {
            titulo: 'Índice de retención reingreso',
            clase: 'blue-card',
            icono: 'person-add'
          },
          {
            titulo: 'Índice de retención nuevo ingreso',
            clase: 'red-card',
            icono: 'person-add'
          },
        ];
      case 'eficiencia_terminal':
        return [
          {
            titulo: 'Egresados',
            clase: 'blue-card',
            icono: 'person-add'
          },
          {
            titulo: 'Nuevo ingreso periodo inicio',
            clase: 'red-card',
            icono: 'person-add'
          },
          {
            titulo: 'Índice de eficiencia terminal',
            clase: 'red-card',
            icono: 'arrow-up'
          },
        ];
      case 'egresados':
        return [
          {
            titulo: 'Mujeres',
            clase: 'blue-card',
            icono: 'person-add'
          },
          {
            titulo: 'Hombres',
            clase: 'red-card',
            icono: 'person-add'
          },
          {
            titulo: 'Total egresados',
            clase: 'red-card',
            icono: 'arrow-up'
          },
        ];
      case 'titulados':
        return [
          {
            titulo: 'Mujeres',
            clase: 'blue-card',
            icono: 'person-add'
          },
          {
            titulo: 'Hombres',
            clase: 'red-card',
            icono: 'person-add'
          },
          {
            titulo: 'Total de titulados',
            clase: 'red-card',
            icono: 'arrow-up'
          },
        ];
    }
  }
}
