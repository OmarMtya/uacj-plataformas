import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ViewDidEnter, ViewDidLeave, ViewWillLeave } from '@ionic/angular';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin, of, Subject, Subscription } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Rubro, Trayectoria, Trayectorias } from 'src/app/interfaces/rubro.interface';
import { Campus } from 'src/app/models/campus.model';
import { Consulta } from 'src/app/models/consulta.model';
import { Nivel } from 'src/app/models/nivel.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programa } from 'src/app/models/programas.model';
import { getCampus, getNiveles, getPeriodos, getPeriodosSuccess, getProgramas } from 'src/app/store/actions/form.actions';
import { getConsulta, seleccionarRubro } from 'src/app/store/actions/trayectoria.actions';
import { AppState } from 'src/app/store/app.store';
import { getRubroTE } from 'src/app/store/selectors/router.selectors';
import { getRubro } from 'src/app/store/selectors/trayectoria.selectors';
import * as formSelectors from 'src/app/store/selectors/form.selectors';
import * as trayectoriaSelectors from 'src/app/store/selectors/trayectoria.selectors';

@Component({
  selector: 'app-trayectoria-escolar',
  templateUrl: './trayectoria-escolar.component.html',
  styleUrls: ['./trayectoria-escolar.component.scss']
})
export class TrayectoriaEscolarComponent implements OnInit, ViewDidLeave, ViewDidEnter, ViewWillLeave, AfterViewInit, OnDestroy {

  @Input() name: string;

  showFilters = false;
  // Variables for filters
  periodos: Periodo[] = [];
  campus: Campus[] = [];
  niveles: Nivel[] = [];
  programas: Programa[] = [];
  consulta: Consulta;
  rubrosDisponibles: string[] = Trayectorias;

  rubroSeleccionado: Rubro<Trayectoria> = 'matricula'; // Entra por default a matrícula

  form: FormGroup;

  // ViewChild for ionic
  @ViewChild('containerRubros') containerRubros: ElementRef;
  unsuscribe$ = new Subject();


  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private actions$: Actions,
  ) {
    this.form = this.fb.group({
      periodo: new FormControl(null, []),
      campus: new FormControl(null, []),
      nivel: new FormControl(null, []),
      programa: new FormControl(null, []),
    });
  }

  ngOnInit() {
    this.store.dispatch(seleccionarRubro({ rubro: this.rubroSeleccionado }));
    this.detectarRubro();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
  }

  detectarRubro() {
    this.store.pipe(select(getRubro)).pipe(takeUntil(this.unsuscribe$)).subscribe((rubro: Rubro<Trayectoria>) => this.rubroSeleccionado = rubro);

    this.store.dispatch(getPeriodos({ rubro: this.rubroSeleccionado, plataforma: 'trayectoria' }));

    this.store.pipe(select(formSelectors.getPeriodos)).pipe(filter((x) => x.length != 0), take(1)).subscribe((periodos: Periodo[]) => {
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
        this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, plataforma: 'trayectoria' })),
        this.store.dispatch(getNiveles({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, plataforma: 'trayectoria' })),
        this.store.dispatch(getProgramas({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, nivel: this.form.get('nivel').value, plataforma: 'trayectoria' }))
      ).pipe(take(1)).subscribe(() => {
        this.suscribirme();
      });

    });
  }


  suscribirme() {
    /**
     * Suscripción a la consulta en la store
     */
    this.store.pipe(select(trayectoriaSelectors.getConsulta)).pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((consulta: Consulta) => {
      this.consulta = consulta;
    });

    /**
     * Suscripción al cambio de rubros, se trae periodos, campus, niveles y programas dependiendo del rubro seleccionado
     */
    this.store.pipe(select(getRubro)).pipe(takeUntil(this.unsuscribe$), filter((x) => this.periodos.length != 0)).subscribe((rubro: Rubro<Trayectoria>) => { // ! Vas a tener que hacer un THEN después de obtener periodos
      this.form.patchValue({
        periodo: this.periodos[0].desc,
        campus: 'Todos',
        nivel: 'Todos',
        programa: 'Todos',
      });

      this.store.dispatch(getPeriodos({ rubro: this.rubroSeleccionado, plataforma: 'trayectoria' }));
      this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, plataforma: 'trayectoria' }));
      this.store.dispatch(getNiveles({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, plataforma: 'trayectoria' }));
      this.store.dispatch(getProgramas({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, nivel: this.form.get('nivel').value, plataforma: 'trayectoria' }));
    });


    /**
     * Suscripciones para los cambios de periodos, campus, niveles y programas del store
     */
    this.store.pipe(select(formSelectors.getPeriodos)).pipe(takeUntil(this.unsuscribe$), filter((x) => x.length != 0)).subscribe((x) => {
      this.periodos = x;
    });
    this.store.pipe(select(formSelectors.getCampus)).pipe(takeUntil(this.unsuscribe$)).subscribe((x) => {
      this.campus = x;
    });
    this.store.pipe(select(formSelectors.getNiveles)).pipe(takeUntil(this.unsuscribe$)).subscribe((x) => {
      this.niveles = x;
    });
    this.store.pipe(select(formSelectors.getProgramas)).pipe(takeUntil(this.unsuscribe$)).subscribe((x) => {
      this.programas = x;
    });

    /**
     * Suscripciones para los cambios de periodos, campus, niveles y programas del los formularios
     */

    this.getSubscripcionForm('periodo').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((periodo: string) => {
      this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo, plataforma: 'trayectoria' }));
      this.form.patchValue({
        campus: null,
        nivel: null,
        programa: null,
      });

      this.form.get('nivel').disable();
      this.form.get('programa').disable();
    });

    this.getSubscripcionForm('campus').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((campus: string) => {
      this.store.dispatch(getNiveles({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus, plataforma: 'trayectoria' }));

      this.form.patchValue({
        nivel: null,
        programa: null,
      });

      this.form.get('nivel').enable();
      this.form.get('programa').disable();
    });

    this.getSubscripcionForm('nivel').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((nivel: string) => {
      this.store.dispatch(getProgramas({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, nivel, plataforma: 'trayectoria' }));

      this.form.patchValue({
        programa: null,
      });

      this.form.get('programa').enable();
    });

    this.getSubscripcionForm('programa').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((programa: string) => {
      this.store.dispatch(getConsulta({
        rubro: this.rubroSeleccionado,
        periodo: this.form.get('periodo').value,
        campus: this.form.get('campus').value,
        nivel: this.form.get('nivel').value,
        programa
      }));
    });
  }

  getSubscripcionForm(input: string) {
    return this.form.get(input).valueChanges.pipe(
      takeUntil(this.unsuscribe$),
    );
  }

  ngAfterViewInit(): void {

  }

  ionViewWillLeave(): void {
    this.unsuscribe$.next();
  }

  ionViewDidEnter(): void {
  }

  localizarRubro(rubro: HTMLElement, rubroObj: string) {
    document.querySelectorAll('.activo').forEach(x => x.classList.remove('activo'));
    this.containerRubros.nativeElement.scroll({ left: rubro.offsetLeft - (this.containerRubros.nativeElement.offsetWidth / 2) + (rubro.offsetWidth / 4), behavior: 'smooth' });
    rubro.classList.add('activo');
    this.unsuscribe$.next(); // Me desuscribo de todos lados

    this.store.dispatch(getPeriodos({ rubro: <Rubro<Trayectoria>>rubroObj, plataforma: 'trayectoria' }));

    this.actions$.pipe(
      ofType(getPeriodosSuccess),
      take(1)
    ).subscribe(() => {
      this.store.dispatch(seleccionarRubro({ rubro: <Rubro<Trayectoria>>rubroObj }));
      this.detectarRubro(); // Para volverme a suscribir de vuelta
    });
  }

  generarTarjetas() {

  }

  ionViewDidLeave(): void {
  }



}
