import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarioComponent } from './calendario/calendario.component';
import { ConsultaInformesMedioTerminoComponent } from './consulta-informes-medio-termino/consulta-informes-medio-termino.component';
import { DescargaFormatosComponent } from './descarga-formatos/descarga-formatos.component';
import { EstructuraComponent } from './estructura/estructura.component';
import { GuiaElaboracionComponent } from './guia-elaboracion/guia-elaboracion.component';
import { InformeAnualComponent } from './informe-anual.component';
import { ReferenciasComponent } from './referencias/referencias.component';
import { SubirArchivosComponent } from './subir-archivos/subir-archivos.component';
import { TableroComponent } from './tablero/tablero.component';

const routes: Routes = [
  {
    path: '',
    component: InformeAnualComponent,
    children: [
      {
        path: 'calendario',
        component: CalendarioComponent
      },
      {
        path: 'elaboracion',
        component: GuiaElaboracionComponent
      },
      {
        path: 'estructura',
        component: EstructuraComponent
      },
      {
        path: 'referencias',
        component: ReferenciasComponent
      },
      {
        path: 'formatos',
        component: DescargaFormatosComponent
      },
      {
        path: 'subir-archivos',
        component: SubirArchivosComponent
      },
      {
        path: 'tablero',
        component: TableroComponent
      },
      {
        path: 'consulta',
        component: ConsultaInformesMedioTerminoComponent
      },
      {
        path: '',
        redirectTo: 'calendario',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'calendario',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformeAnualRoutingModule { }
