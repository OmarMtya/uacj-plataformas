import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Desarrollo, Desarrollos, Rubro, Trayectoria } from 'src/app/interfaces/rubro.interface';
import { Periodo } from 'src/app/models/periodo.model';
import { getCampus, getNiveles, getPeriodos, getPeriodosSuccess, getProgramas } from 'src/app/store/actions/form.actions';
import { getConsulta, seleccionarRubro } from 'src/app/store/actions/trayectoria.actions';
import { AppState } from 'src/app/store/app.store';
import { getRubro } from 'src/app/store/selectors/trayectoria.selectors';
import * as formSelectors from 'src/app/store/selectors/form.selectors';

@Component({
  selector: 'app-desarrollo-institucional',
  templateUrl: './desarrollo-institucional.component.html',
  styleUrls: ['./desarrollo-institucional.component.css']
})
export class DesarrolloInstitucionalComponent implements OnInit, OnDestroy {

  showFilters = false;
  form: FormGroup;
  periodos: any[];
  campus: any[];
  departamentos: any[];
  programas: any[];
  @ViewChild('containerRubros') containerRubros: ElementRef;
  unsuscribe$ = new Subject();
  rubroSeleccionado: Rubro<Trayectoria> = 'matricula'; // Entra por default a matrícula
  rubrosDisponibles: string[] = Desarrollos;

  constructor(
    private fb: FormBuilder,
    private actions$: Actions,
    private store: Store<AppState>
  ) {
    this.form = this.fb.group({
      periodo: this.fb.control(null, []),
      campus: this.fb.control(null, []),
      nivel: this.fb.control(null, []),
      programa: this.fb.control(null, []),
    });
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
  }

  ngOnInit(): void {
  }

  localizarRubro(rubro: HTMLElement, rubroObj: string) {
    document.querySelectorAll('.activo').forEach(x => x.classList.remove('activo'));
    this.containerRubros.nativeElement.scroll({ left: rubro.offsetLeft - (this.containerRubros.nativeElement.offsetWidth / 2) + (rubro.offsetWidth / 4), behavior: 'smooth' });
    rubro.classList.add('activo');
    this.unsuscribe$.next(); // Me desuscribo de todos lados

    this.store.dispatch(getPeriodos({ rubro: <Rubro<Desarrollo>>rubroObj, plataforma: 'desarrollo' }));

    this.actions$.pipe(
      ofType(getPeriodosSuccess),
      take(1)
    ).subscribe(() => {
      this.store.dispatch(seleccionarRubro({ rubro: <Rubro<Desarrollo>>rubroObj }));
      this.detectarRubro(); // Para volverme a suscribir de vuelta
    });
  }

  detectarRubro() {
    this.store.pipe(select(getRubro)).pipe(takeUntil(this.unsuscribe$)).subscribe((rubro: Rubro<Trayectoria>) => this.rubroSeleccionado = rubro);

    this.store.dispatch(getPeriodos({ rubro: this.rubroSeleccionado, plataforma: 'desarrollo' }));

    this.store.pipe(select(formSelectors.getPeriodos)).pipe(filter((x) => x.length != 0), take(1)).subscribe((periodos: Periodo[]) => {
      console.log("ENTRO SOLO UNA VEZ");

      this.form.patchValue({
        periodo: periodos[0].desc,
        campus: 'Todos',
        nivel: 'Todos',
        programa: 'Todos',
      }, {
        emitEvent: false,
        onlySelf: true
      });

      this.store.dispatch(getConsulta({
        rubro: this.rubroSeleccionado,
        periodo: periodos[0].desc,
        campus: this.form.get('campus').value,
        nivel: this.form.get('nivel').value,
        programa: this.form.get('programa').value,
      }));

      of(
        this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value })),
        this.store.dispatch(getNiveles({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, plataforma: 'desarrollo' })),
        this.store.dispatch(getProgramas({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, nivel: this.form.get('nivel').value, plataforma: 'desarrollo' }))
      ).pipe(take(1)).subscribe(() => {
        this.suscribirme();
      });

    });
  }

  suscribirme() {

  }

}
