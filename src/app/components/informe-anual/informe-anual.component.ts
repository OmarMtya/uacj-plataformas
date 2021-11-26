import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-informe-anual',
  templateUrl: './informe-anual.component.html',
  styleUrls: ['./informe-anual.component.css']
})
export class InformeAnualComponent implements OnInit {
  @ViewChild('containerRubros') containerRubros: ElementRef;
  rubrosDisponibles = [
    {
      nombre: 'Calendario',
      ruta: ['/plataformas', 'indicadores', 'iaa', 'calendario']
    },
    {
      nombre: 'Guía de elaboración',
      ruta: ['/plataformas', 'indicadores', 'iaa', 'elaboracion']
    },
    {
      nombre: 'Estructura',
      ruta: ['/plataformas', 'indicadores', 'iaa', 'estructura']
    },
    {
      nombre: 'Referencias',
      ruta: ['/plataformas', 'indicadores', 'iaa', 'referencias']
    },
    {
      nombre: 'Descarga de formatos',
      ruta: ['/plataformas', 'indicadores', 'iaa', 'formatos']
    },
    {
      nombre: 'Subir archivos',
      ruta: ['/plataformas', 'indicadores', 'iaa', 'subir-archivos']
    },
    {
      nombre: 'Tablero',
      ruta: ['/plataformas', 'indicadores', 'iaa', 'tablero']
    },
    {
      nombre: 'Consulta informes de medio término',
      ruta: ['/plataformas', 'indicadores', 'iaa', 'consulta']
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

  clickRubro(rubro: HTMLElement) {
    if (rubro != null) {
      document.querySelectorAll('.activo').forEach(x => x.classList.remove('activo')); // Quita a todos la clase de activo
      this.containerRubros.nativeElement.scroll({ left: rubro.offsetLeft - (this.containerRubros.nativeElement.offsetWidth / 2) + (rubro.offsetWidth / 4), behavior: 'smooth' }); // Hace scroll al elemento para poder verlo en el centro
      rubro.classList.add('activo'); // Le pone la clase de activo al elemento seleccionado
    }
  }

}
