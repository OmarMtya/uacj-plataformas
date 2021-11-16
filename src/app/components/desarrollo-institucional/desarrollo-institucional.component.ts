import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ViewDidEnter, ViewDidLeave, ViewWillLeave } from '@ionic/angular';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin, of, Subject, Subscription } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Desarrollo, Desarrollos, Rubro, Trayectoria, Trayectorias } from 'src/app/interfaces/rubro.interface';
import { Campus } from 'src/app/models/campus.model';
import { Consulta } from 'src/app/models/consulta.model';
import { Periodo } from 'src/app/models/periodo.model';
import { Programa } from 'src/app/models/programas.model';
import { getCampus, getCampusSuccess, getDepartamentos, getNiveles, getPeriodos, getPeriodosSuccess, getProgramas } from 'src/app/store/actions/form.actions';
import { getConsulta, seleccionarRubro } from 'src/app/store/actions/trayectoria.actions';
import { AppState } from 'src/app/store/app.store';
import { getRubroTE } from 'src/app/store/selectors/router.selectors';
import { getRubro } from 'src/app/store/selectors/trayectoria.selectors';
import * as formSelectors from 'src/app/store/selectors/form.selectors';
import * as trayectoriaSelectors from 'src/app/store/selectors/trayectoria.selectors';
import { Departamento } from 'src/app/models/departamento.model';
import { DesarrolloInstitucionalService } from 'src/app/services/desarrollo-institucional.service';

@Component({
  selector: 'app-desarrollo-institucional',
  templateUrl: './desarrollo-institucional.component.html',
  styleUrls: ['./desarrollo-institucional.component.css']
})
export class DesarrolloInstitucionalComponent implements OnInit, OnDestroy {


  @Input() name: string;

  showFilters = false;
  // Variables for filters
  periodos: Periodo[] = [];
  campus: Campus[] = [];
  programas: Programa[] = [];
  departamentos: Departamento[] = [];
  consulta: any[]; // Como son demasiadas consultas y no tiene un solo formato, es necesario ponerlo como un arreglo de Any
  rubrosDisponibles: string[] = Desarrollos;

  rubroSeleccionado: Rubro<Desarrollo> = 'padron_licenciatura'; // Entra por default a matrícula

  form: FormGroup;

  // ViewChild for ionic
  @ViewChild('containerRubros') containerRubros: ElementRef;
  unsuscribe$ = new Subject();



  type = 'doughnut';
  data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false
  };


  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private actions$: Actions,
    private desarrolloService: DesarrolloInstitucionalService
  ) {
    this.form = this.fb.group({
      periodo: new FormControl(null, []),
      campus: new FormControl(null, []),
      departamento: new FormControl(null, []),
      programa: new FormControl(null, []),
    });
  }

  ngOnInit() {
    this.store.dispatch(seleccionarRubro({ rubro: this.rubroSeleccionado }));
    // setInterval(() => {
    //   console.log(this.rubroSeleccionado);
    // }, 1)
    this.detectarRubro();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
  }

  detectarRubro() {
    this.store.pipe(select(getRubro)).pipe(takeUntil(this.unsuscribe$)).subscribe((rubro: Rubro<Desarrollo>) => this.rubroSeleccionado = rubro);
    this.store.dispatch(getPeriodos({ rubro: this.rubroSeleccionado, plataforma: 'desarrollo' }));

    this.store.pipe(select(formSelectors.getPeriodos)).pipe(filter((x) => x.length != 0), take(1)).subscribe((periodos: Periodo[]) => {
      this.form.patchValue({
        periodo: periodos[0].desc,
        // campus: 'Todos',
        departamento: 'Todos',
        programa: 'Todos',
      }, {
        emitEvent: false,
        onlySelf: true
      });



      this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, plataforma: 'desarrollo' }));

      this.actions$.pipe(
        ofType(getCampusSuccess),
        take(1)
      ).subscribe(({ campus }) => {
        this.form.patchValue({
          campus: campus[0].desc // Pongo como campus el primero, ya que no tiene "Todos"
        });
        of(
          this.store.dispatch(getDepartamentos({ rubro: this.rubroSeleccionado, campus: campus[0].desc, plataforma: 'desarrollo' })),
          this.store.dispatch(getProgramas({
            rubro: this.rubroSeleccionado,
            periodo: this.form.get('periodo').value,
            campus: campus[0].desc,
            departamento: this.form.get('departamento').value,
            plataforma: 'desarrollo'
          }))
        ).pipe(take(1)).subscribe(() => {
          this.suscribirme();

          // ! Me traigo la consulta por default
          console.log("Consultame");

          this.desarrolloService.getConsultas(
            this.rubroSeleccionado,
            this.form.get('campus').value,
            this.form.get('departamento').value,
            this.form.get('programa').value,
          ).pipe(take(1)).subscribe((x) => {
            this.consulta = x.map((y) => ({ ...y, data: this.generarGrafica(y) })).sort((a) => a.consulta != 'comentarios' ? -1 : 1);
          });
        });

      });


    });
  }


  suscribirme() {
    /**
     * Suscripción a la consulta en la store
     */
    // this.store.pipe(select(trayectoriaSelectors.getConsulta)).pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((consulta: Consulta) => {
    //   this.consulta = consulta;
    // });

    /**
     * Suscripción al cambio de rubros, se trae periodos, campus, niveles y programas dependiendo del rubro seleccionado
     */
    this.store.pipe(select(getRubro)).pipe(takeUntil(this.unsuscribe$), filter((x) => this.periodos.length != 0)).subscribe((rubro: Rubro<Desarrollo>) => { // ! Vas a tener que hacer un THEN después de obtener periodos
      this.form.patchValue({
        periodo: this.periodos[0].desc,
        campus: 'Todos',
        departamento: 'Todos',
        programa: 'Todos',
      });

      this.store.dispatch(getPeriodos({ rubro: this.rubroSeleccionado, plataforma: 'desarrollo' }));
      this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, plataforma: 'desarrollo' }));
      this.store.dispatch(getDepartamentos({ rubro: this.rubroSeleccionado, campus: this.form.get('campus').value, plataforma: 'desarrollo' }));
      this.store.dispatch(getProgramas({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, nivel: this.form.get('nivel').value, plataforma: 'desarrollo' }));
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
    this.store.pipe(select(formSelectors.getDepartamentos)).pipe(takeUntil(this.unsuscribe$)).subscribe((x) => {
      this.departamentos = x;
    });
    this.store.pipe(select(formSelectors.getProgramas)).pipe(takeUntil(this.unsuscribe$)).subscribe((x) => {
      this.programas = x;
    });

    /**
     * Suscripciones para los cambios de periodos, campus, niveles y programas del los formularios
     */

    this.getSubscripcionForm('periodo').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((periodo: string) => {
      // this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo }));
      this.form.patchValue({
        campus: null,
        departamento: null,
        programa: null,
      });

      this.form.get('departamento').disable();
      this.form.get('programa').disable();
    });

    this.getSubscripcionForm('campus').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((campus: string) => {
      this.store.dispatch(getDepartamentos({ rubro: this.rubroSeleccionado, plataforma: 'desarrollo', campus: campus }));

      this.form.patchValue({
        departamento: null,
        programa: null,
      });

      this.form.get('departamento').enable();
      this.form.get('programa').disable();
    });

    this.getSubscripcionForm('departamento').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((departamento: string) => {
      this.store.dispatch(getProgramas({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, departamento, plataforma: 'desarrollo' }));

      this.form.patchValue({
        programa: null,
      });

      this.form.get('programa').enable();
    });

    this.getSubscripcionForm('programa').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((programa: string) => {
      this.desarrolloService.getConsultas(
        this.rubroSeleccionado,
        this.form.get('campus').value,
        this.form.get('departamento').value,
        this.form.get('programa').value,
      ).pipe(take(1)).subscribe((x) => {
        this.consulta = x.map((y) => ({ ...y, data: this.generarGrafica(y) })).sort((a) => a.consulta != 'comentarios' ? -1 : 1);;
      });
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

    this.store.dispatch(getPeriodos({ rubro: <Rubro<Desarrollo>>rubroObj, plataforma: 'desarrollo' }));

    this.actions$.pipe(
      ofType(getPeriodosSuccess),
      take(1)
    ).subscribe(() => {
      this.store.dispatch(seleccionarRubro({ rubro: <Rubro<Desarrollo>>rubroObj }));
      this.detectarRubro(); // Para volverme a suscribir de vuelta
    });
  }

  generarGrafica(consulta: { consulta: string; resultado: { serie: string; cantidad: number }[] }) {
    return {
      labels: consulta.resultado.map(x => x.serie),
      datasets: [{
        label: "Prueba",
        data: consulta.resultado.map(x => x.cantidad),
        backgroundColor: ["#CCF5AC", "#7E2E84", "#EF798A", "#7E2E84", "#D14081", "#4DA167", "#A9E4EF", "#DDC9B4", "#44355B", "#EE5622"]
      }]
    };
  }

  ionViewDidLeave(): void {
  }
}
