import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformeAnualRoutingModule } from './informe-anual-routing.module';
import { InformeAnualComponent } from './informe-anual.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarioComponent } from './calendario/calendario.component';
import { GuiaElaboracionComponent } from './guia-elaboracion/guia-elaboracion.component';
import { EstructuraComponent } from './estructura/estructura.component';
import { ReferenciasComponent } from './referencias/referencias.component';
import { DescargaFormatosComponent } from './descarga-formatos/descarga-formatos.component';
import { SubirArchivosComponent } from './subir-archivos/subir-archivos.component';
import { TableroComponent } from './tablero/tablero.component';
import { ConsultaInformesMedioTerminoComponent } from './consulta-informes-medio-termino/consulta-informes-medio-termino.component';


@NgModule({
  declarations: [
    InformeAnualComponent,
    CalendarioComponent,
    GuiaElaboracionComponent,
    EstructuraComponent,
    ReferenciasComponent,
    DescargaFormatosComponent,
    SubirArchivosComponent,
    TableroComponent,
    ConsultaInformesMedioTerminoComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    InformeAnualRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class InformeAnualModule { }
