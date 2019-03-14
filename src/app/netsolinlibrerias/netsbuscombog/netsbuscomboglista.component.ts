import { error } from "util";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NetsolinApp } from '../../shared/global';
import { HttpClient } from "@angular/common/http";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";
import { Observable } from "rxjs/Rx";

import { process, State } from "@progress/kendo-data-query";
import {
  GridComponent,
  GridDataResult,
  PageChangeEvent,
  DataStateChangeEvent
} from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { MantbasicaService } from "../../services/mantbasica.service";
import { NetsolinService } from "../../services/netsolin.service";

@Component({
  selector: "lista-netsbuscombog",
  templateUrl: "./netsbuscomboglista.component.html"
})
// styleUrls:  ['./netsbuscomboglista.component.css']
export class ListbusquedacomboglComponent implements OnInit {
  //objeto que ejecuta la consulta de busqueda y retorna los campos es el principal parametro
  @Input() objeto: string;
  //titulo
  @Input() title: string;
  //filtro adicional si se requiere enviar a consulta
  @Input() filtro: string;
  //campo que retorna
  @Input() pcamporetorna: string;
  // //ruta para mantenimiento
  // @Input() rutamant: string;
  // //prefijo para llamado a mantenimiento
  // @Input() prefopermant: string;
  @Output() evenclose = new EventEmitter();

  pcampollave: string = "";
  pcamponombre: string = "";
  pclase_nbs: string = "";
  pclase_val: string = "";
  camposv: any[] = [];
  cargoConfig = true;
  aregstabla: any[] = [];
  cargando = true;
  resultados = false;
  noresultados = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  campoBusqueda: FormControl;
  busqueda: string = "";
  enerror = false;
  eliminoreg = false;
  gridCcodigo = "codigo";
  gridCnombre = "nombre";
  muestraverant = false;
  varidreg: any;
  public opened: boolean = false;
  segper_consultar = true;
  segper_adicionar = false;
  segper_modificar = false;
  segper_eliminar = false;
  es_cotiza = false;
  public confirmado;
  public crearregistro = false;
  public consultarregistro = false;
  public editarregistro = false;
  public state: State = {
    skip: 0,
    take: 20
  };
  public gridData: GridDataResult;
  ejengoninit = false;
  public multiple = false;
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "cod_tercer",
      dir: "asc"
    }
  ];
  //nombre variable con parametros de tabla para pasar a adicion,mod,ver
  constructor(
    private location: Location,
    private mantbasicaService: MantbasicaService,
    private service: NetsolinService,
    private httpc: HttpClient,
    private router: Router
  ) {
    this.confirmado = null;
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    // console.log("lista busqueda dataStateChange");
    this.state = state;
    this.gridData = process(this.aregstabla, this.state);
  }

  ngOnInit() {
    // console.log("ngOnInit listar.comp objeto: " + this.objeto);
    // console.log("ngOnInit listar.comp filtro: " + this.filtro);
    this.ejengoninit = true;
    this.resultados = false;
    this.campoBusqueda = new FormControl();
    // se debe asegurar que se ha leido archivo con url o fallara el servicio
    this.httpc.get("assets/netsolin_ini.json").subscribe(data => {
      NetsolinApp.urlNetsolin = data["url_netsolins"];
      //carga por servicio diccionario de tabla y lo guarda en localstorage
      // console.log("ngOnInit listar.comp 2");
      this.loaddiccionarios();
      // this.searchTbasica(this.filtro);
    });
  }

  public verRegK(dataItem): void {
    // console.log("verRegK");
    var pvalc = this.retornaValcampo(dataItem);
    // console.log("pvalc:" + pvalc);
    this.evenclose.emit(pvalc);
  }
  
  public editClick(event): void {
    // console.log("editClick");
    
  }

  public close() {
    // console.log('close vent cliente potencial');
    this.evenclose.emit("");
  }

  public onCancel(e, ditem): void {
    // console.log("en onCancel");
    // console.log(e);
  }
  ngOnChanges() {
    // console.log("ngOnChanges listabusqueda.comp filtro:"+this.filtro);
    if (this.ejengoninit && this.filtro.length !== 0) {
      this.searchTbasica(this.filtro);
    }
  }

  ngDoCheck() {
    // console.log("ngDoCheck listar.comp");
  }
  ngAfterContentInit() {
    // console.log("ngAfterContentInit listar.comp");
  }
  ngAfterContentChecked() {
    // console.log("ngAfterContentChecked listar.comp");
  }
  ngAfterViewInit() {
    // console.log("ngAfterViewInit listar.comp");
  }

  ngAfterViewChecked() {
    // console.log("ngAfterViewChecked listar.comp");
  }
  ngOnDestroy() {
    // console.log("ngOnDestroy listar.comp");
  }

  searchTbasica(filtro) {
    // console.log("searchTbasica");
    // console.log(filtro);
    this.enerror = false;
    this.busqueda = filtro;
    // console.log("searchTbasica:"+this.busqueda);
    this.cargando = true;
    // if (this.busqueda.length !== 0 && !this.enlistaerror) {
    if (this.busqueda.length !== 0) {
      this.ejeBusqueda();
    } else {
      this.aregstabla = [];
      this.cargando = false;
      this.resultados = false;
    }
  }

  ejeBusqueda() {
    // console.log("ejeBusqueda busqueda:" + this.busqueda);
    // console.log("ejeBusqueda filtro:" + this.filtro);
    this.confirmado = null;
    this.cargando = true;
    this.enlistaerror = false;
    this.service
      .getNetsolinObjbusqueda(this.objeto, this.busqueda, this.filtro)
      .subscribe(
        result => {
          //reiniciarlo a blanco para que no vuelva a refrescar
          this.filtro = "";
          // console.log("eje busqueda retorna result");
          // console.log(result);
          var result0 = result[0];
          // console.log(result0);
          if (typeof result.isCallbackError != "undefined") {
            this.cargando = false;
            this.resultados = true;
            this.enlistaerror = true;
            this.listaerrores = result.messages;
            console.log("Lista errores netsbuscomboglista:");
            console.log(this.listaerrores);
            this.busqueda = "";
            // this.enlistaerror=false;
            // localStorage.setItem('B' + this.rutamant, this.busqueda);
          } else {
            this.aregstabla = result;
            //   console.log("resultado de busqueda aregstabla:");
            //   console.log(this.aregstabla);
            this.gridData = process(this.aregstabla, this.state);
            this.cargando = false;
            this.resultados = true;
            this.message = "Resultado para busqueda de: " + this.busqueda;
          }
        },
        error => {
          console.log("Error en ejeBusqueda netsbuscomboglista");
          console.log(error);
          this.cargando = false;
          this.resultados = false;
          this.showError(error);
        }
      );
  }

  retornaValcampo(pregistro) {
    // console.log("retornavalcampo");
    // console.log(pregistro);
    let lcadeval = "pregistro." + this.pcamporetorna;
    let valretorna = eval(lcadeval);
    // console.log("retorna:"+valretorna);
    return valretorna;
  }

  message = "";
  showError(msg) {
    this.message = msg.message;
    this.enerror = true;
    // console.log(this.message);
  }

  showMensaje(msg) {
    this.message = msg;
    this.enerror = false;
    // console.log(this.message);
  }

  loaddiccionarios() {
    // console.log("loaddiccionarios listar.comp");
    /**
     * Carga tablapara captura de datos diccionarios netsolin incluya las que van el el modulo
     *
     */
    // console.log("this.objeto;"+this.objeto);
    this.service.getNetsolinObjmantbasica(this.objeto).subscribe(
      result => {
        // console.log("getNetsolinObjmantbasica 1");
        // console.log(result);
        var result0 = result[0];
        // console.log(result0);
        if (typeof result.isCallbackError != "undefined") {
          this.enlistaerror = true;
          this.listaerrores = result.messages;
          this.cargoConfig = false;
          this.cargando = false;
          return;
        }
        if (result0.campos_lista.length > 2) {
          // console.log("getNetsolinObjmantbasica luego de cargar objeto 1");
          let var3 = JSON.parse(result0.campos_lista);
          if (typeof var3 == "object") {
            // console.log("getNetsolinObjmantbasica luego de cargar objeto 2");
            NetsolinApp.objpartablabas.campos_lista = var3;
            this.camposv = var3;
          } else {
            this.enerror = true;
            this.message =
              "Error. Debe definir en el objeto los campos a visualizar.";
            // console.log("getNetsolinObjmantbasica luego de cargar objeto 3 ojo no tiene campos a mostrar");
          }
        } else {
          this.enerror = true;
          this.message =
            "Error. Debe definir en el objeto los campos a visualizar.";
          // console.log("getNetsolinObjmantbasica luego de cargar objeto 4 ojo no tiene campos a mostrar");
        }
        this.service.getNetsolinSegObj(this.objeto).subscribe(
          result => {
            console.log('Seguridad result');
            // console.log(result);
            // this.segper_adicionar = result.per_adicionar;
            this.segper_consultar = result.per_consultar;
            // this.segper_eliminar = result.per_eliminar;
            // this.segper_modificar = result.per_modificar;
            // console.log('Seguridad');
            // console.log('Seguridad 1');
            if (this.filtro.length !== 0) {
            //   console.log('Seguridad 2 this.filtro:'+this.filtro);
              this.searchTbasica(this.filtro);
              //   this.ejeBusqueda();
            } else {
              this.enerror = false;
              // console.log('Seguridad 3 ojo error');
              this.cargando = false;
            }
            this.cargoConfig = true;
          },
          error => {
            this.enerror = true;
            this.cargoConfig = false;
            console.log("error dic");
            console.log(error);
            this.showError(error);
          }
        );
      },
      error => {
        console.log("Error configurando objeto:" + this.objeto);
        console.log(error);
        this.cargoConfig = false;
        this.enerror = true;
        this.message = "Error no se pudo cargar";
        this.cargando = false;
      }
    );
  }
}
