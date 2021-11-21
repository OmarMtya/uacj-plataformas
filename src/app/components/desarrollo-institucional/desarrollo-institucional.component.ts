import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ViewDidEnter, ViewDidLeave, ViewWillLeave } from '@ionic/angular';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin, of, Subject, Subscription } from 'rxjs';
import { concatMap, filter, take, takeUntil } from 'rxjs/operators';
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
import { Nivel } from 'src/app/models/nivel.model';

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
  niveles: Nivel[] = [];
  consulta: any[]; // Como son demasiadas consultas y no tiene un solo formato, es necesario ponerlo como un arreglo de Any
  rubrosDisponibles: string[] = Desarrollos;

  rubroSeleccionado: Rubro<Desarrollo> = 'padron_licenciatura'; // Entra por default a padron_licenciatura

  form: FormGroup;

  // ViewChild for ionic
  @ViewChild('containerRubros') containerRubros: ElementRef;
  unsuscribe$ = new Subject();

  type = 'doughnut';
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
      nivel: new FormControl(null, []),
    });
  }

  ngOnInit() {
    this.store.dispatch(seleccionarRubro({ rubro: this.rubroSeleccionado })); // Ejecuta la acción para poner padron_licenciatura como default
    this.store.dispatch(getPeriodos({ rubro: this.rubroSeleccionado, plataforma: 'desarrollo' })); // Necesito traerme como mínimo los periodos al inicio. Clickrubro se trae nuevamente los periodos
    this.detectarRubro(); // Emula un click en el rubro padron_licenciatura

    /**
     * Suscripciones para los cambios de periodos, campus, niveles y programas del store
     */
    this.store.pipe(select(formSelectors.getPeriodos)).pipe(filter((x) => x.length != 0)).subscribe((x) => {
      this.periodos = x;
    });
    this.store.pipe(select(formSelectors.getCampus)).pipe().subscribe((x) => {
      this.campus = x;
    });
    this.store.pipe(select(formSelectors.getDepartamentos)).pipe().subscribe((x) => {
      this.departamentos = x;
    });
    this.store.pipe(select(formSelectors.getProgramas)).pipe().subscribe((x) => {
      this.programas = x;
    });
    this.store.pipe(select(formSelectors.getNiveles)).pipe().subscribe((x) => {
      this.niveles = x;
    });
    this.store.pipe(select(getRubro)).pipe().subscribe((rubro: Rubro<Desarrollo>) => this.rubroSeleccionado = rubro); // Lo pongo aquí para que detectarRubro se ejecute con el nuevo rubro

  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
  }

  detectarRubro() {
    setTimeout(() => {

      this.store.pipe(select(formSelectors.getPeriodos)).pipe(filter((x) => x.length != 0), take(1)).subscribe((periodos: Periodo[]) => { // Toda la suscripción se basa en los periodos, en este caso siempre son 2020
        this.form.patchValue({ // Pongo el periodo por default, y los demás en Todos, no emito el evento para evitar las suscripciones
          periodo: periodos[0].desc,
          departamento: 'Todos',
          programa: 'Todos',
        }, {
          emitEvent: false,
          onlySelf: true
        });

        this.actions$.pipe( // Es como si estuviera haciendo un resolve de la suscripcion anterior. Me trae tdoso los campus
          ofType(getCampusSuccess),
          take(1)
        ).subscribe(({ campus }) => {
          console.log("ME TRAIGO EL SUCCESS O NO");


          this.form.patchValue({
            campus: campus[0].desc // Pongo como campus el primero, ya que no tiene "Todos"
          });

          let objetos = of(
            this.store.dispatch(getDepartamentos({ rubro: this.rubroSeleccionado, campus: campus[0].desc, plataforma: 'desarrollo' })),
            this.store.dispatch(getProgramas({
              rubro: this.rubroSeleccionado,
              periodo: this.form.get('periodo').value,
              campus: campus[0].desc,
              departamento: this.form.get('departamento').value,
              plataforma: 'desarrollo'
            }))
          );

          // if (this.form.get('nivel').value != null) {
          //   objetos = objetos.pipe(
          //     concatMap(() => of(
          //       this.store.dispatch(getNiveles({
          //         rubro: this.rubroSeleccionado,
          //         periodo: this.form.get('periodo').value,
          //         campus: campus[0].desc,
          //         plataforma: 'desarrollo'
          //       }))
          //     ))
          //   );
          // }

          objetos.pipe(take(1)).subscribe(() => {
            this.suscribirmeCambiosFormularios(); // Me suscribo a los cambios de los formularios, para volver a ejecutar la consulta

            // ! Me traigo la consulta por default
            this.desarrolloService.getConsultas( // Me traigo el valor
              this.rubroSeleccionado,
              this.form.get('campus').value,
              this.form.get('departamento').value,
              this.form.get('programa').value,
            ).pipe(take(1)).subscribe((x) => {
              this.consulta = x.map((y) => ({ ...y, data: this.generarGrafica(y) })).sort((a) => a.consulta != 'comentarios' ? -1 : 1); // Estsa consulta será cambiada cuando el usuario haga click en un rubro
            });
          });

        });

        this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, plataforma: 'desarrollo' })); // Me traigo los campus, basandome en los valores de arriba: Todos

      });
    }, 1);
  }

  traerInformacionFormularios() {
    /**
     * Suscripción al cambio de rubros, se trae periodos, campus, niveles y programas dependiendo del rubro seleccionado
     */
    // this.store.pipe(select(getRubro)).pipe(takeUntil(this.unsuscribe$), filter((x) => this.periodos.length != 0)).subscribe((rubro: Rubro<Desarrollo>) => { // ! Vas a tener que hacer un THEN después de obtener periodos
    //   this.form.patchValue({
    //     periodo: this.periodos[0].desc,
    //     campus: 'Todos',
    //     departamento: 'Todos',
    //     programa: 'Todos',
    //   });

    //   this.store.dispatch(getPeriodos({ rubro: this.rubroSeleccionado, plataforma: 'desarrollo' }));
    //   this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, plataforma: 'desarrollo' }));
    //   this.store.dispatch(getDepartamentos({ rubro: this.rubroSeleccionado, campus: this.form.get('campus').value, plataforma: 'desarrollo' }));
    //   this.store.dispatch(getProgramas({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, plataforma: 'desarrollo' }));
    // });

    this.store.dispatch(getPeriodos({ rubro: this.rubroSeleccionado, plataforma: 'desarrollo' }));
    this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, plataforma: 'desarrollo' }));
    this.store.dispatch(getDepartamentos({ rubro: this.rubroSeleccionado, campus: this.form.get('campus').value, plataforma: 'desarrollo' }));
    this.store.dispatch(getProgramas({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, plataforma: 'desarrollo' }));
  }


  /**
   * Le da funcionalidad a los inputs de formularios
   */
  suscribirmeCambiosFormularios() {
    /**
     * Suscripciones para los cambios de periodos, campus, niveles y programas del los formularios
     */

    this.getSubscripcionForm('periodo').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((periodo: string) => {
      this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo, plataforma: 'desarrollo' }));
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

    this.getSubscripcionForm('programa').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((programa: string) => { // Esta consulta será llenada cuando el usuario cambie el valor de programa
      this.desarrolloService.getConsultas(
        this.rubroSeleccionado,
        this.form.get('campus').value,
        this.form.get('departamento').value,
        this.form.get('programa').value,
      ).pipe(take(1)).subscribe((x) => {
        console.log("No entro aquí gracias a dios");

        this.consulta = x.map((y) => ({ ...y, data: this.generarGrafica(y) })).sort((a) => a.consulta != 'comentarios' ? -1 : 1);;
      });
    });
  }

  getSubscripcionForm(input: string) {
    return this.form.get(input).valueChanges.pipe(
      takeUntil(this.unsuscribe$),
    );
  }

  // ngAfterViewInit(): void {

  // }

  // ionViewWillLeave(): void {
  //   this.unsuscribe$.next();
  // }

  // ionViewDidEnter(): void {
  // }

  clickRubro(rubro: HTMLElement, rubroObj: string) {
    document.querySelectorAll('.activo').forEach(x => x.classList.remove('activo')); // Quita a todos la clase de activo
    this.containerRubros.nativeElement.scroll({ left: rubro.offsetLeft - (this.containerRubros.nativeElement.offsetWidth / 2) + (rubro.offsetWidth / 4), behavior: 'smooth' }); // Hace scroll al elemento para poder verlo en el centro
    rubro.classList.add('activo'); // Le pone la clase de activo al elemento seleccionado
    this.unsuscribe$.next(); //! Me desuscribo de todos lados
    this.actions$.pipe( // Lo pongo antes para que se ejecute después de que se cambie el rubro
      ofType(getPeriodosSuccess),
      take(1)
    ).subscribe(({ periodos }) => {
      console.log("No estoy entrando", periodos);
      this.store.dispatch(seleccionarRubro({ rubro: <Rubro<Desarrollo>>rubroObj })); // Lo pone en el reducer
      this.store.pipe(select(getRubro)).pipe(take(1)).subscribe((rubro: Rubro<Desarrollo>) => this.rubroSeleccionado = rubro); // Lo pongo aquí para que detectarRubro se ejecute con el nuevo rubro
      this.detectarRubro(); // Para volverme a suscribir de vuelta
    });
    this.store.dispatch(getPeriodos({ rubro: <Rubro<Desarrollo>>rubroObj, plataforma: 'desarrollo' })); // Me tengo que traer los elementos de la plataforma desarrollo
  }

  generarGrafica(consulta: { consulta: string; resultado: { serie: string; cantidad: number }[] }) {
    let arreglos = ["#CCF5AC", "#7E2E84", "#EF798A", "#7E2E84", "#D14081", "#4DA167", "#A9E4EF", "#DDC9B4", "#44355B", "#EE5622"];
    return {
      labels: consulta.resultado.map(x => x.serie),
      datasets: [{
        label: "Prueba",
        data: consulta.resultado.map(x => x.cantidad),
        backgroundColor: this.shuffle(arreglos)
      }]
    };
  }

  shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  ionViewDidLeave(): void {
  }
}
