import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { PanelBarExpandMode, PanelBarItemModel } from '@progress/kendo-angular-layout';

import { NetsolinApp } from '../../../shared/global';
import { MantbasicaService } from '../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../services/mantbasica.libreria';
import { varGlobales } from '../../../shared/varGlobales';
import { environment } from '../../../../environments/environment';
import { NetsolinService } from '../../../services/netsolin.service';
import {
  DialogService,
  DialogRef,
  DialogCloseResult
} from '@progress/kendo-angular-dialog';

//Firebase Oct 4 18
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
// import { NetsolinService } from '../../../../netsolinlibrerias/servicios/netsolin.service';
import { process, State, CompositeFilterDescriptor,filterBy, FilterDescriptor,distinct } from '@progress/kendo-data-query';
import {GridComponent,GridDataResult,PageChangeEvent,DataStateChangeEvent} from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { EditService } from '../../../services/Editsoporte.service';
import { Casofrecuen } from '../modeldatocasofrecuen';
@Component({
  selector: 'app-monitorprincasosfrecue',
  templateUrl: './monitorprincasosfrecue.component.html',
  styleUrls: ['./monitorprincasosfrecue.component.css']
})
export class MonitorPrinCasosfreComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @Input() vparcaptura: string;
  @Input() vid: any;
//casofrecuens
  cargo_casofrecuens = true;
  casofrecuentes: any;
  casofrecuenscerrados: any;
  public state: State = {
    skip: 0,
    take: 30
  };
  public statecerrados: State = {
    skip: 0,
    take: 30
  };
    ejengoninit = false;
public multiple = true;
public allowUnsort = true;
public sort: SortDescriptor[] = [{
    field: 'fecha',
    dir: 'desc'
}];
public sortcerrados: SortDescriptor[] = [{
  field: 'fecha',
  dir: 'desc'
}];
segper_consultar = false;
segper_adicionar = false;
segper_modificar = false;
segper_eliminar = false;
public filter: CompositeFilterDescriptor;
public filtercerrados: CompositeFilterDescriptor;

// public gridData: GridDataResult;
public gridData: any[] = filterBy(this.casofrecuentes, this.filter);
public editDataItem: Casofrecuen;
public isNew: boolean;
public editService: EditService;
public resultalert;

  subtitle = '(Monitor)';
  varParam: string;
  rutamant: string;
  id: string;
  enerror = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  message = "";
  cargando = false;
  resultados = false;
  nom_empre: string;
  cargousuario = false;
  regUsuario: any;
  // Manejo panel de informacion
  infopanelselec: string;
  mostrarmensaje=false;
  puedecrearcasofrecuen= true;

  constructor(
    private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    public service: NetsolinService,
    private sanitizer: DomSanitizer,
    private dialogService: DialogService,
    private httpc: HttpClient,
    db: AngularFirestore,
    

  ) {
    console.log('constructor');
    // this.editService = editServiceFactory();
    this.vglobal.mostrarbreadcrumbs = false;
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    console.log(" dataStateChange");
    this.state = state;
    // this.gridData = process(this.casofrecuentes, this.state);
}
public dataStateChangecerrados(state: DataStateChangeEvent): void {
  this.statecerrados = state;
}

public filterChange(filter: CompositeFilterDescriptor): void {
  this.filter = filter;
  this.gridData = filterBy(this.casofrecuentes, filter);
}

public distinctPrimitive(fieldName: string): any {
return distinct(this.casofrecuentes, fieldName).map(item => item[fieldName]);
}

  public onPanelChange(data: Array<PanelBarItemModel>): boolean {
    return false;
  }
  public stateChange(data: Array<PanelBarItemModel>): boolean {
    //console.log("stateChange");
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];
    //console.log("focusedEvent.id: "+focusedEvent.id);

    if (focusedEvent.id !== "info") {
      //  this.selectedId = focusedEvent.id;
       //console.log("selec id: ")+this.selectedId;
      //  this.router.navigate(["/" + focusedEvent.id]);
    }

    return false;
}


  ngOnInit() {
    this.cargando = true;
    console.log("en ngOnInit editregCliepotecial");
    this.activatedRouter.params
      .subscribe(parametros => {
        // this.varParam = parametros['varParam'];
        // this.id = parametros['id'];
        this.id = NetsolinApp.oapp.cuserid;
          console.log('a inicializar');
          this.inicializaMonitor();
          // this.editService.read();

      });
  }

  inicializaMonitor() {
    console.log('en inicializar');
    //Mientras prueba
    if (!environment.production) {
      // cbus='NETSOLIN   '
    }
    this.service.getCasofrecuentesFB().subscribe((datos:any) =>{
      console.log('Casofrecuens leidos ', datos);
      if (datos){
        this.casofrecuentes = datos;
        this.cargando = false;
        this.resultados = true;
        this.cargo_casofrecuens = true;
        this.gridData = filterBy(this.casofrecuentes, this.filter);
        console.log(this.casofrecuentes);            
      }
    });
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
  }

  retornaRuta() {
    // console.log(this.rutamant);
    return '/' + this.rutamant;
  }

  onSubmit() {
    this.enerror = false;
    // this.grabo = false;
   }
 
  showError(msg) {
    this.message = msg;
    this.enerror = true;
    // console.log(this.message);
  }

  showMensaje(msg) {
    this.message = msg;
    this.enerror = false;
    // console.log(this.message);
  }

  retornaRutaAcampana() {
    // addregtbasica/VPARCOMPETENCIA
  }


 
 
  openconsulta(ptipo){
  }
  public closeconsulta(ptipo) {
  }
  public closebusquellama(event){

  }

  openeditar(ptipo){
  }
  public closeeditar(ptipo) {
  }
  
  //maneja el control para llamado adicion de tablas
  openadicion(ptipo) {
    if (ptipo == 'cotiza') {
      // this.crearcotiza = true;
    } 
  }
  //maneja el control para cerrar

  public closeadicion(ptipo) {
  }



  generacasofrecuen(){
    const numcasofrecuen = this.service.generanumTicket();
    const datosrequer = {
      id: numcasofrecuen,
      fecha: new Date(),
      asunto: '',
      detalle: '',
      instrucciones: '',
      nomusuarcrea: this.service.usuarFb.nombre,
      productoprin: '',
      publicarcliente: false,
      fechapublicado: new Date(),
      modulo: ''
    };
    this.service.addCasofrecuenteFb(numcasofrecuen,datosrequer);
  }
  editClick(event){

  }
  public monitorClick(dataItem): void {
    console.log('monitorclick ', dataItem);
    var pruta = `/monitorcasofrecuen/${dataItem.nit_empre}/${dataItem.idrequer}/`;
    console.log("ir a monitor requer:" + pruta);
    this.router.navigate([pruta]);
  }

public verRegK(dataItem): void {
}
public sortChange(sort: SortDescriptor[]): void {
  this.sort = sort;
  this.gridData = orderBy(this.casofrecuentes, this.sort);
}

  public addHandler() {
    this.editDataItem = new Casofrecuen();
    this.editDataItem.id = this.service.generanumTicket();
    this.editDataItem.fecha = new Date();
    this.isNew = true;
}

public editHandler({dataItem}) {
  console.log('editHandler', dataItem);
    this.editDataItem = dataItem;
    this.isNew = false;
}

public cancelHandler() {
    this.editDataItem = undefined;
}

public saveHandler(casofrecuen: any) {
    console.log('a grabar ',casofrecuen,this.isNew, this.editDataItem);
    if (this.isNew){
      const numcasofrecuen = this.service.generanumTicket();
      const datoscaso = {
        id: numcasofrecuen,
        fecha: new Date(),
        asunto: casofrecuen.asunto,
        detalle: casofrecuen.detalle,
        instrucciones: casofrecuen.instrucciones,
        nomusuarcrea: this.service.usuarFb.nombre,
        productoprin: casofrecuen.productoprin,
        verificado: false,
        publicarcliente: false,
        fechapublicado: new Date(),
        modulo: casofrecuen.modulo
      };
      console.log('a grabar', datoscaso);
      this.service.addCasofrecuenteFb(numcasofrecuen,datoscaso);      
    } else {
      this.editDataItem.asunto = casofrecuen.asunto;
      this.editDataItem.detalle = casofrecuen.detalle;  
      this.editDataItem.instrucciones = casofrecuen.instrucciones;  
      this.editDataItem.productoprin = casofrecuen.productoprin;  
      this.editDataItem.modulo = casofrecuen.productoprin;  
      this.editDataItem.verificado = casofrecuen.verificado;  
      this.editDataItem.publicarcliente = casofrecuen.publicarcliente;  
      if (casofrecuen.publicarcliente && !this.editDataItem.publicarcliente){
        this.editDataItem.fechapublicado = new Date();
      }
      this.service.actCasofrecuenFb(this.editDataItem.id, this.editDataItem);
      console.log('editar ', this.editDataItem);
    }
    this.editDataItem = undefined;
}

public removeHandler({dataItem}) {
  console.log('removeHandler', dataItem, this.service.usuarFb);
  if (dataItem.verificado && !this.service.usuarFb.evalua ){
    this.showAlerta('Advertencia', 'No se puede eliminar si esta verificado y no es evaluador');
  } else {
    this.service.deleteCasofrecuenFb(dataItem.id);
  }
}
public showAlerta(ptitulo, palerta) {
  const dialog: DialogRef = this.dialogService.open({
      title: ptitulo,
      content: palerta,
      actions: [
          { text: 'Ok', primary: true }
      ],
      width: 450,
      height: 200,
      minWidth: 250
  });

  dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
          console.log('close');
      } else {
          console.log('action', result);
      }

      this.resultalert = JSON.stringify(result);
  });
}

}
