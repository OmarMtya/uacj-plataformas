import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaInformesMedioTerminoComponent } from './consulta-informes-medio-termino.component';

describe('ConsultaInformesMedioTerminoComponent', () => {
  let component: ConsultaInformesMedioTerminoComponent;
  let fixture: ComponentFixture<ConsultaInformesMedioTerminoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaInformesMedioTerminoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaInformesMedioTerminoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
