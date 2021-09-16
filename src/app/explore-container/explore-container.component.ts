import { Component, OnInit, Input } from '@angular/core';
import { Periodo } from '../models/periodo.model';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { getCampus, getConsulta, getNiveles, getPeriodos, getProgramas } from '../store/actions/trayectoria.actions';
import { ViewDidEnter, ViewDidLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Campus } from '../models/campus.model';
import { Nivel } from '../models/nivel.model';
import { Programa } from '../models/programas.model';
import { Consulta } from '../models/consulta.model';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit, ViewDidLeave, ViewDidEnter {
  @Input() name: string;

  showFilters = false;
  subs: Subscription[] = [];

  // Variables for filters
  periodos: Periodo[] = [];
  campus: Campus[] = [];
  niveles: Nivel[] = [];
  programas: Programa[] = [];
  consulta: Consulta;

  form: FormGroup;

  trayectoriaVirgen = true;


  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      periodo: new FormControl('2021-I', []),
      campus: new FormControl('Todos', []),
      nivel: new FormControl('Todos', []),
      programa: new FormControl(null, []),
    });

    this.subs.push(this.store.select('trayectoria').subscribe(x => {
      this.periodos = x.periodos;
      this.campus = x.campus;
      this.niveles = x.niveles;
      this.programas = x.programas;
      if (this.trayectoriaVirgen && this.periodos.length > 0) {
        this.trayectoriaVirgen = false;
        this.consulta = x.consulta;
        this.store.dispatch(getConsulta({
          rubro: 'matricula',
          campus: 'Todos',
          nivel: 'Todos',
          periodo: x.periodos[0].desc,
          programa: 'Todos'
        }));

        this.form.setValue({
          periodo: x.periodos[0].desc,
          campus: 'Todos',
          nivel: 'Todos',
          programa: 'Todos',
        });
      }
    }));

    this.subs.push(this.form.controls['periodo'].valueChanges.subscribe((x: string) => {
      if (x != null)
        this.store.dispatch(getCampus({ periodo: x, rubro: 'matricula' }));
      this.form.controls['campus'].setValue(null);
      this.form.controls['nivel'].setValue(null);
      this.form.controls['programa'].setValue(null);
    }));
    this.subs.push(this.form.controls['campus'].valueChanges.subscribe(x => {
      if (x != null)
        this.store.dispatch(getNiveles({ campus: x, rubro: 'matricula', periodo: this.form.controls['periodo'].value }));
      this.form.controls['nivel'].setValue(null);
      this.form.controls['programa'].setValue(null);
    }));
    this.subs.push(this.form.controls['nivel'].valueChanges.subscribe(x => {
      if (x != null)
        this.store.dispatch(getProgramas({ nivel: x, rubro: 'matricula', periodo: this.form.controls['periodo'].value, campus: this.form.controls['campus'].value }));
      this.form.controls['programa'].setValue(null);
    }));
    this.subs.push(this.form.controls['programa'].valueChanges.subscribe(x => {
      if (x != null)
        this.store.dispatch(getConsulta({ programa: x, rubro: 'matricula', periodo: this.form.controls['periodo'].value, campus: this.form.controls['campus'].value, nivel: this.form.controls['nivel'].value }));
    }));

    this.subs.push(this.store.select('trayectoria').subscribe(x => {
      this.consulta = x.consulta;
    }));
  }

  ionViewDidEnter(): void {

  }

  generarTarjetas() {

  }

  ionViewDidLeave(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    this.store.dispatch(getPeriodos({ rubro: 'matricula' }));
  }

}
