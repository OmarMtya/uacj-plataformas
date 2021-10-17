import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ViewDidEnter, ViewDidLeave, ViewWillLeave } from '@ionic/angular';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Rubro } from 'src/app/interfaces/rubro.interface';
import { Campus } from 'src/app/models/campus.model';
import { Consulta } from 'src/app/models/consulta.model';
import { Nivel } from 'src/app/models/nivel.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programa } from 'src/app/models/programas.model';
import { getCampus, getNiveles, getPeriodos, getProgramas } from 'src/app/store/actions/form.actions';
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
  rubrosDisponibles: string[] = [
    'matricula',
    'aspirantes',
    'aprobacion',
    'desercion',
    'retencion',
    'eficiencia_terminal',
    'egresados',
    'titulados'
  ];

  rubroSeleccionado: Rubro = 'matricula'; // Entra por default a matrícula

  form: FormGroup;

  trayectoriaVirgen = true;

  // ViewChild for ionic
  @ViewChild('containerRubros') containerRubros: ElementRef;
  unsuscribe$ = new Subject();


  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private actions$: Actions,
  ) {
    this.form = this.fb.group({
      periodo: new FormControl('2021-I', []),
      campus: new FormControl('Todos', []),
      nivel: new FormControl('Todos', []),
      programa: new FormControl('Todos', []),
    });
  }

  ngOnInit() {
    this.suscribirme();
    this.store.dispatch(getConsulta({
      rubro: this.rubroSeleccionado,
      periodo: this.form.get('periodo').value,
      campus: this.form.get('campus').value,
      nivel: this.form.get('nivel').value,
      programa: this.form.get('programa').value,
    }));
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
  }

  suscribirme() {
    /**
     * Suscripción al cambio de rubros, se trae periodos, campus, niveles y programas dependiendo del rubro seleccionado
     */
    this.store.pipe(select(getRubro)).pipe(takeUntil(this.unsuscribe$)).subscribe((rubro: Rubro) => {
      this.rubroSeleccionado = rubro;
      this.store.dispatch(getPeriodos({ rubro: this.rubroSeleccionado }));
      this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value }));
      this.store.dispatch(getNiveles({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value }));
      this.store.dispatch(getProgramas({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, nivel: this.form.get('nivel').value }));
    });

    /**
     * Suscripción a la consulta en la store
     */
    this.store.pipe(select(trayectoriaSelectors.getConsulta)).pipe(takeUntil(this.unsuscribe$)).subscribe((consulta: Consulta) => this.consulta = consulta);

    /**
     * Suscripciones para los cambios de periodos, campus, niveles y programas del store
     */
    this.store.pipe(select(formSelectors.getCampus)).pipe(takeUntil(this.unsuscribe$)).subscribe((x) => this.campus = x);
    this.store.pipe(select(formSelectors.getNiveles)).pipe(takeUntil(this.unsuscribe$)).subscribe((x) => this.niveles = x);
    this.store.pipe(select(formSelectors.getPeriodos)).pipe(takeUntil(this.unsuscribe$)).subscribe((x) => this.periodos = x);
    this.store.pipe(select(formSelectors.getProgramas)).pipe(takeUntil(this.unsuscribe$)).subscribe((x) => this.programas = x);

    /**
     * Suscripciones para los cambios de periodos, campus, niveles y programas del los formularios
     */

    this.getSubscripcionForm('periodo').pipe(takeUntil(this.unsuscribe$)).subscribe((periodo: string) => {
      this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo }));
      this.form.patchValue({
        campus: null,
        nivel: null,
        programa: null,
      });

      this.form.get('nivel').disable();
      this.form.get('programa').disable();
    });

    this.getSubscripcionForm('campus').pipe(takeUntil(this.unsuscribe$)).subscribe((campus: string) => {
      this.store.dispatch(getNiveles({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus }));

      this.form.patchValue({
        nivel: null,
        programa: null,
      });

      this.form.get('nivel').enable();
      this.form.get('programa').disable();
    });

    this.getSubscripcionForm('nivel').pipe(takeUntil(this.unsuscribe$)).subscribe((nivel: string) => {
      this.store.dispatch(getProgramas({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, nivel }));

      this.form.patchValue({
        programa: null,
      });

      this.form.get('programa').enable();
    });

    this.getSubscripcionForm('programa').pipe(takeUntil(this.unsuscribe$)).subscribe((programa: string) => {
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
    this.store.dispatch(seleccionarRubro({ rubro: <Rubro>rubroObj }));
  }

  generarTarjetas() {

  }

  ionViewDidLeave(): void {
  }



}
