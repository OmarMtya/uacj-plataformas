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
import { MsalService } from '@azure/msal-angular';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-desarrollo-institucional',
  templateUrl: './desarrollo-institucional.component.html',
  styleUrls: ['./desarrollo-institucional.component.scss']
})
export class DesarrolloInstitucionalComponent implements OnInit, OnDestroy, ViewDidEnter, ViewDidEnter {


  @Input() name: string;

  showFilters = false;
  // Variables for filters
  periodos: Periodo[] = [];
  campus: Campus[] = [];
  programas: Programa[] = [];
  departamentos: Departamento[] = [];
  niveles: Nivel[] = [];
  consulta: any[]; // Como son demasiadas consultas y no tiene un solo formato, es necesario ponerlo como un arreglo de Any
  rubrosDisponibles: { display: string, rubro: string }[] = Desarrollos;

  rubroSeleccionado: Rubro<Desarrollo> = 'padron_licenciatura'; // Entra por default a padron_licenciatura
  valoracion: number;
  form: FormGroup;

  // ViewChild for ionic
  @ViewChild('containerRubros') containerRubros: ElementRef;
  unsuscribe$ = new Subject();
  leave$ = new Subject();
  cargando = true;

  fechaCorte: { fecha: string, periodo: string };

  contestados_avances = {
    contestadas: [],
    sin_contestar: [],
  }

  comentariosTabs = [
    {
      titulo: 'Responsabilidad social',
      seleccionado: true,
    },
    {
      titulo: 'Responsabilidad ambiental',
      seleccionado: false,
    },
    {
      titulo: 'Calidad del programa',
      seleccionado: false,
    },
    {
      titulo: 'Comentarios adicionales',
      seleccionado: false,
    }
  ];

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private actions$: Actions,
    private desarrolloService: DesarrolloInstitucionalService,
    private authService: MsalService
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
    this.store.pipe(select(formSelectors.getPeriodos)).pipe(filter((x) => x.length != 0), takeUntil(this.leave$)).subscribe((x) => {
      this.periodos = x;
    });
    this.store.pipe(select(formSelectors.getCampus)).pipe(takeUntil(this.leave$)).subscribe((x) => {
      this.campus = x;
    });
    this.store.pipe(select(formSelectors.getDepartamentos)).pipe(takeUntil(this.leave$)).subscribe((x) => {
      this.departamentos = x;
    });
    this.store.pipe(select(formSelectors.getProgramas)).pipe(takeUntil(this.leave$)).subscribe((x) => {
      this.programas = x;
    });
    this.store.pipe(select(formSelectors.getNiveles)).pipe(takeUntil(this.leave$)).subscribe((x) => {
      this.niveles = x;
    });
    this.store.pipe(select(getRubro)).pipe(takeUntil(this.leave$)).subscribe((rubro: Rubro<Desarrollo>) => this.rubroSeleccionado = rubro); // Lo pongo aquí para que detectarRubro se ejecute con el nuevo rubro
  }

  ocultarColapsables() {
    setTimeout(() => {
      let items_colapsables = document.querySelectorAll('.item-colapsable');

      let items_ocultar = [];

      items_colapsables.forEach((element, index) => {
        items_ocultar.push(element);
      });

      items_ocultar.forEach((element) => {
        if (!element.classList.contains('colapsable')) {
          element.classList.add('oculto');
        } else {
          element.classList.remove('colapsable_selected');
        }
      });

    }, 1);
  }

  setGaugage() {
    setTimeout(() => {
      const gauge = document.querySelector(".gauge");

      if (this.valoracion < 0 || this.valoracion > 1) {
        return;
      }
      if (!gauge) {
        console.log("No hay guage", gauge);
        return;
      }
      (<any>gauge.querySelector(".gauge__fill")).style.transform = `rotate(${this.valoracion / 2
        }turn)`;
      gauge.querySelector(".gauge__cover").textContent = `${Math.round(
        this.valoracion * 100
      )}%`;
      console.log(this.valoracion);

    }, 1);
  }

  mostrarColapsables(elemento: HTMLElement) {
    this.ocultarColapsables();
    if (elemento.classList.contains('colapsable_selected')) {
      return;
    }
    setTimeout(() => {
      let items_colapsables = document.querySelectorAll('.item-colapsable');

      // Remove the class 'oculto' from all the items between the variable 'elemento' and the last item before any element with the class 'colapsable'
      let items_mostrar = [];

      let encontado = false;
      let encontradoSiguienteColapsable = false;

      items_colapsables.forEach(element => {
        // Check if element is the same element of eventClick.target
        if (element == elemento) {
          encontado = true;
          elemento.classList.add('colapsable_selected');
          return;
        }

        if (encontado && !encontradoSiguienteColapsable) {
          if (element.classList.contains('colapsable')) {
            encontradoSiguienteColapsable = true;
            return;
          }
          items_mostrar.push(element);
        }
      });

      items_mostrar.forEach(element => {
        element.classList.remove('oculto');
      });
    }, 1);
  }

  ionViewDidEnter(): void {
    setTimeout(() => {
      this.clickRubro(document.querySelector('.padron_licenciatura'), 'padron_licenciatura');
    }, 200);
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.next();
  }

  reiniciarAvances() {
    this.contestados_avances = {
      contestadas: [],
      sin_contestar: [],
    };
  }

  seleccionarComentario(comentarios: { titulo: string, seleccionado: boolean }) {
    this.comentariosTabs.forEach((comentario) => {
      if (comentario.titulo == comentarios.titulo) {
        comentario.seleccionado = true;
      } else {
        comentario.seleccionado = false;
      }
    });
  }

  checkComentarioSeleccionado(index: number) {
    return this.comentariosTabs[index]?.seleccionado;
  }

  llenarAvances(contestadas: any[], sin_contestar: any[]) {
    this.contestados_avances = {
      contestadas,
      sin_contestar,
    };
  }

  llenarFormulariosDatosDinamicos() {
    setTimeout(() => {
      if (this.rubroSeleccionado == 'avance_padron_egreso' || this.rubroSeleccionado == 'avance_seguimiento_2' || this.rubroSeleccionado == 'avance_seguimiento_5') {
        this.form.get('nivel').enable();
      } else {
        // this.form.get('nivel').disable();
      }
      this.store.pipe(select(formSelectors.getPeriodos)).pipe(filter((x) => x.length != 0), take(1)).subscribe((periodos: Periodo[]) => { // Toda la suscripción se basa en los periodos, en este caso siempre son 2020
        this.form.patchValue({ // Pongo el periodo por default, y los demás en Todos, no emito el evento para evitar las suscripciones
          periodo: periodos[0].desc,
          departamento: 'Todos',
          programa: 'Todos',
          nivel: 'Todos',
        }, {
          emitEvent: false,
          onlySelf: true
        });

        this.actions$.pipe( // Es como si estuviera haciendo un resolve de la suscripcion anterior. Me trae tdoso los campus
          ofType(getCampusSuccess),
          take(1)
        ).subscribe(({ campus }) => {
          this.form.patchValue({
            campus: campus[0].desc // Pongo como campus el primero, ya que no tiene "Todos"
          });

          let objeto = of(
            this.store.dispatch(getDepartamentos({ rubro: this.rubroSeleccionado, campus: campus[0].desc, plataforma: 'desarrollo', periodo: periodos[0].desc })), // Traigo los departamentos
            this.store.dispatch(getProgramas({
              rubro: this.rubroSeleccionado,
              periodo: this.form.get('periodo').value,
              campus: campus[0].desc,
              departamento: this.form.get('departamento').value,
              plataforma: 'desarrollo'
            }))
          );
          if (this.rubroSeleccionado == 'avance_padron_egreso' || this.rubroSeleccionado == 'avance_seguimiento_2' || this.rubroSeleccionado == 'avance_seguimiento_5') {
            objeto = of(
              this.store.dispatch(getDepartamentos({ rubro: this.rubroSeleccionado, campus: campus[0].desc, plataforma: 'desarrollo', periodo: periodos[0].desc })), // Traigo los departamentos
              this.store.dispatch(getProgramas({
                rubro: this.rubroSeleccionado,
                periodo: this.form.get('periodo').value,
                campus: campus[0].desc,
                departamento: this.form.get('departamento').value,
                plataforma: 'desarrollo',
                nivel: this.form.get('nivel').value
              })),
              this.store.dispatch(getNiveles({
                rubro: this.rubroSeleccionado,
                campus: campus[0].desc,
                periodo: periodos[0].desc,
                plataforma: 'desarrollo',
                departamento: this.form.get('departamento').value,
              }))
            );
          }
          objeto.pipe(take(1)).subscribe(() => {
            this.suscribirmeCambiosFormularios(); // Me suscribo a los cambios de los formularios, para volver a ejecutar la consulta

            // ! Me traigo la consulta por default
            this.desarrolloService.getConsultas( // Me traigo el valor
              this.rubroSeleccionado,
              this.form.get('campus').value,
              this.form.get('departamento').value,
              this.form.get('programa').value,
              this.form.get('nivel').value,
              this.form.get('periodo').value,
            ).pipe(take(1)).subscribe((x) => {
              if (this.rubroSeleccionado == 'avance_padron_egreso' || this.rubroSeleccionado == 'avance_seguimiento_2' || this.rubroSeleccionado == 'avance_seguimiento_5') {
                this.consulta = x[0].map((y) => ({ ...y, data: this.generarGrafica(y) }));
                if (x[0][0].original?.length > 3) {
                  this.llenarAvances(x[0][0].original[4], x[0][0].original[5]);
                } else {
                  this.reiniciarAvances();
                }
              } else {
                let consultaFix = x.filter((x) => x.ignorar == null).map((y) => {
                  let grafica = this.generarGrafica(y)
                  let retorno = {
                    ...y,
                    data: grafica,
                    type: this.getTypeGrafica(grafica),
                    options: this.getOptionsGrafica(grafica),
                  };
                  return retorno;
                });

                // If is firefox, reverse the array
                if (!navigator.userAgent.toLowerCase().includes('firefox')) {
                  consultaFix = consultaFix.reverse();
                }
                consultaFix = consultaFix.sort((a) => a.consulta != 'comentarios' ? -1 : 1); // Esta consulta será cambiada cuando el usuario haga click en un rubro
                this.consulta = consultaFix;

                this.valoracion = parseFloat((x.find((x) => x.ignorar == true).resultado / 1000).toFixed(1));
                this.setGaugage();
              }
              this.cargando = false;
              this.ocultarColapsables();
            });
          });

        });
        this.store.dispatch(getCampus({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, plataforma: 'desarrollo' })); // Me traigo los campus, basandome en los valores de arriba: Todos
      });
    }, 1);
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
      // this.form.get('programa').disable();
      if (this.rubroSeleccionado == 'avance_padron_egreso' || this.rubroSeleccionado == 'avance_seguimiento_2' || this.rubroSeleccionado == 'avance_seguimiento_5') {
        // this.form.get('nivel').disable();
      }
    });

    this.getSubscripcionForm('campus').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((campus: string) => {
      this.store.dispatch(getDepartamentos({ rubro: this.rubroSeleccionado, plataforma: 'desarrollo', campus: campus, periodo: this.form.get('periodo').value }));

      this.form.patchValue({
        departamento: null,
        programa: null,
      });

      this.form.get('departamento').enable();
      // this.form.get('programa').disable();
      if (this.rubroSeleccionado != 'avance_padron_egreso') {
        // this.form.get('nivel').disable();
      }
    });

    this.getSubscripcionForm('departamento').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((departamento: string) => {

      if (this.rubroSeleccionado == 'avance_padron_egreso' || this.rubroSeleccionado == 'avance_seguimiento_2' || this.rubroSeleccionado == 'avance_seguimiento_5') {
        this.store.dispatch(getNiveles({
          rubro: this.rubroSeleccionado,
          campus: this.form.get('campus').value,
          periodo: this.form.get('periodo').value,
          plataforma: 'desarrollo',
          departamento: departamento
        }));
      } else {
        this.store.dispatch(getProgramas({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, departamento, plataforma: 'desarrollo' }));
      }

      this.form.patchValue({
        programa: null,
      });
      if (this.rubroSeleccionado != 'avance_padron_egreso' && this.rubroSeleccionado != 'avance_seguimiento_2' && this.rubroSeleccionado != 'avance_seguimiento_5') {
        this.form.get('nivel').enable();
        // this.form.get('programa').disable();
      } else {
        this.form.patchValue({
          nivel: null,
        });
        this.form.get('programa').enable();
      }
    });

    this.getSubscripcionForm('nivel').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((nivel: string) => {
      if (this.rubroSeleccionado != 'avance_padron_egreso' && this.rubroSeleccionado != 'avance_seguimiento_2' && this.rubroSeleccionado != 'avance_seguimiento_5') {
        return;
      }
      this.store.dispatch(getProgramas({ rubro: this.rubroSeleccionado, periodo: this.form.get('periodo').value, campus: this.form.get('campus').value, departamento: this.form.get('departamento').value, plataforma: 'desarrollo', nivel: nivel }));

      this.form.patchValue({
        programa: null,
      });

      this.form.get('programa').enable();
    });

    this.getSubscripcionForm('programa').pipe(takeUntil(this.unsuscribe$), filter((x) => x != null)).subscribe((programa: string) => { // Esta consulta será llenada cuando el usuario cambie el valor de programa
      this.cargando = true;
      this.desarrolloService.getConsultas(
        this.rubroSeleccionado,
        this.form.get('campus').value,
        this.form.get('departamento').value,
        this.form.get('programa').value,
        this.form.get('nivel').value,
        this.form.get('periodo').value,
      ).pipe(take(1)).subscribe((x) => {
        if (this.rubroSeleccionado == 'avance_padron_egreso' || this.rubroSeleccionado == 'avance_seguimiento_2' || this.rubroSeleccionado == 'avance_seguimiento_5') {
          this.consulta = x[0].map((y) => ({ ...y, data: this.generarGrafica(y) }));
          if (x[0][0].original?.length > 3) {
            this.llenarAvances(x[0][0].original[4], x[0][0].original[5]);
          } else {
            this.reiniciarAvances();
          }
        } else {
          this.consulta = x.filter((x) => x.ignorar == null).map((y) => {
            let grafica = this.generarGrafica(y)
            let retorno = {
              ...y,
              data: grafica,
              type: this.getTypeGrafica(grafica),
              options: this.getOptionsGrafica(grafica),
            };
            return retorno;
          }).reverse().sort((a) => a.consulta != 'comentarios' ? -1 : 1);

          this.valoracion = parseFloat((x.find((x) => x.ignorar == true).resultado / 1000).toFixed(1));
          this.setGaugage();
        }
        this.cargando = false;
        this.ocultarColapsables();
      });
    });
  }

  getSubscripcionForm(input: string) {
    return this.form.get(input).valueChanges.pipe(
      takeUntil(this.unsuscribe$),
    );
  }

  getTypeGrafica(x: any) {
    return x.labels.length >= 5 ? 'bar' : 'pie';
  }

  getOptionsGrafica(x: any) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: x.labels.length <= 5
      },
    };

  }


  validarVaciado(consulta: { consulta: string; resultado: { serie: string; cantidad: number }[] }) {
    // Return a boolean if the consulta.resultado has all the values of cantidad equal to 0
    return !consulta.resultado.every((x) => x.cantidad === 0);
  }

  clickRubro(rubro: HTMLElement, rubroObj: string) {
    if (rubro != null) {
      document.querySelectorAll('.activo').forEach(x => x.classList.remove('activo')); // Quita a todos la clase de activo
      this.containerRubros.nativeElement.scroll({ left: rubro.offsetLeft - (this.containerRubros.nativeElement.offsetWidth / 2) + (rubro.offsetWidth / 4), behavior: 'smooth' }); // Hace scroll al elemento para poder verlo en el centro
      rubro.classList.add('activo'); // Le pone la clase de activo al elemento seleccionado
    }
    this.cargando = true;
    this.unsuscribe$.next(); //! Me desuscribo de todos lados
    this.actions$.pipe( // Lo pongo antes para que se ejecute después de que se cambie el rubro
      ofType(getPeriodosSuccess),
      take(1)
    ).subscribe(({ periodos }) => {
      this.store.dispatch(seleccionarRubro({ rubro: <Rubro<Desarrollo>>rubroObj })); // Lo pone en el reducer
      this.store.pipe(select(getRubro)).pipe(take(1)).subscribe((rubro: Rubro<Desarrollo>) => this.rubroSeleccionado = rubro); // Lo pongo aquí para que detectarRubro se ejecute con el nuevo rubro
      this.llenarFormulariosDatosDinamicos(); // Para volverme a suscribir de vuelta
    });
    this.store.dispatch(getPeriodos({ rubro: <Rubro<Desarrollo>>rubroObj, plataforma: 'desarrollo' })); // Me tengo que traer los elementos de la plataforma desarrollo
  }

  generarGrafica(consulta: { consulta: string; resultado: { serie: string; cantidad: number }[] }) {

    // If some object inside the array resultado has the value 'Si' in the attribute serie, the cantidad atribute isn't important
    let arreglos = ["#9CD6AB", "#9EB9D9", "#D4DAB6", "#ae72b3", "#D9A39E", "#8C7A79", "#D69CCF", "#B1D6D3", "#9CD6AB", "#a795bf"];

    if (consulta.resultado.some(x => x.serie == 'Sí')) {
      arreglos = ['#97D678', '#D67A6B', '#81BDD6'];
      // Sort consulta.resultados if the serie has 'sí', the second place will be 'no', and the third place will be the rest
      consulta.resultado = consulta.resultado.sort((a, b) => {
        if (a.serie == 'Sí') {
          return -1;
        } else if (a.serie == 'No') {
          return 1;
        } else {
          return 0;
        }
      });
    }

    return {
      labels: consulta.resultado.map(x => x.serie),
      datasets: [{
        label: "",
        data: consulta.resultado.map(x => x.cantidad),
        backgroundColor: this.shuffle(arreglos, !consulta.resultado.some(x => x.serie == 'Sí'))
      }]
    };
  }

  shuffle(array: any[], shuffleReal = true) {
    if (!shuffleReal) {
      return array;
    }
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
