import { Component, OnInit, Input } from '@angular/core';
import { Periodo } from '../models/periodo.model';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { getPeriodos } from '../store/actions/trayectoria.actions';
import { ViewDidEnter, ViewDidLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';

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
  campus: any[] = [];
  niveles: any[] = [];
  programas: any[] = [];


  constructor(
    private store: Store<AppState>
  ) {
    this.subs.push(this.store.select('trayectoria').subscribe(x => {
      console.log(x);

      this.periodos = x.periodos;
      // this.campus = this.getCampus(periodos);
      // this.niveles = this.getNiveles(periodos);
      // this.programas = this.getProgramas(periodos);
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
