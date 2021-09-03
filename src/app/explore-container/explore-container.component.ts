import { Component, OnInit, Input } from '@angular/core';
import { Periodo } from '../models/periodo.model';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { getCampus, getConsulta, getNiveles, getPeriodos, getProgramas } from '../store/actions/trayectoria.actions';
import { ViewDidEnter, ViewDidLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Campus } from '../models/campus.model';

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
  niveles: any[] = [];
  programas: any[] = [];


  form: FormGroup;


  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      periodo: new FormControl('todos', []),
      campus: new FormControl('todos', []),
      nivel: new FormControl('todos', []),
      programa: new FormControl('todos', []),
    });

    this.subs.push(this.store.select('trayectoria').subscribe(x => {
      console.log(x);
      this.periodos = x.periodos;
      this.campus = x.campus;
      this.niveles = x.niveles;
      this.programas = x.programas;
    }));

    this.subs.push(this.form.controls['periodo'].valueChanges.subscribe((x: string) => {
      console.log("entre");
      this.store.dispatch(getCampus({ periodo: x, rubro: 'matricula' }));
      // this.store.dispatch(getNiveles({ periodo: x, rubro: 'matricula', campus: this.form.controls['campus'].value }));
    }));
    this.subs.push(this.form.controls['campus'].valueChanges.subscribe(x => {
      this.store.dispatch(getNiveles({ campus: x, rubro: 'matricula', periodo: this.form.controls['periodo'].value }));
    }));
    this.subs.push(this.form.controls['nivel'].valueChanges.subscribe(x => {
      this.store.dispatch(getProgramas({ nivel: x, rubro: 'matricula', periodo: this.form.controls['periodo'].value, campus: this.form.controls['campus'].value }));
    }));
    this.subs.push(this.form.controls['programa'].valueChanges.subscribe(x => {
      this.store.dispatch(getConsulta({ programa: x, rubro: 'matricula', periodo: this.form.controls['periodo'].value, campus: this.form.controls['campus'].value, nivel: this.form.controls['nivel'].value }));
    }));
  }

  ionViewDidEnter(): void {

  }

  ionViewDidLeave(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    this.store.dispatch(getPeriodos({ rubro: 'matricula' }));
  }

}
