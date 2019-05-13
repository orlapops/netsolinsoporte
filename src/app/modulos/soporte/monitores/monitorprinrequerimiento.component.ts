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
import { Requerimiento } from '../modeldatorequerimiento';
// import { Incidente } from './model';
@Component({
  selector: 'app-monitorprinrequerimiento',
  templateUrl: './monitorprinrequerimiento.component.html',
  styleUrls: ['./monitorprinrequerimiento.component.css']
})
export class MonitorPrinRequerimientoComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @Input() vparcaptura: string;
  @Input() vid: any;
//requerimientos
  cargo_requerimientos = true;
  requerimientospen: any;
  requerimientoscerrados: any;
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
public gridData: any[] = filterBy(this.requerimientospen, this.filter);
public gridDatacerrados: any[] = filterBy(this.requerimientoscerrados, this.filtercerrados);
public editDataItem: Requerimiento;
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
  puedecrearrequerimiento= true;

  pruebavininumbuscombog:string = "";
  llamabusqueda = false;
  pruellegallabusque:string="";




  constructor(
    // @Inject(EditService) editServiceFactory: any,
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
    // this.gridData = process(this.requerimientospen, this.state);
}
public dataStateChangecerrados(state: DataStateChangeEvent): void {
  this.statecerrados = state;
}

public filterChange(filter: CompositeFilterDescriptor): void {
  this.filter = filter;
  this.gridData = filterBy(this.requerimientospen, filter);
}

public distinctPrimitive(fieldName: string): any {
return distinct(this.requerimientospen, fieldName).map(item => item[fieldName]);
}
public distinctPrimitiveCerrrados(fieldName: string): any {
return distinct(this.requerimientoscerrados, fieldName).map(item => item[fieldName]);
}

public filterChangecerrados(filter: CompositeFilterDescriptor): void {
  this.filtercerrados = filter;
  this.gridDatacerrados = filterBy(this.requerimientoscerrados, filter);
}

public distinctPrimitivecerrados(fieldName: string): any {
return distinct(this.requerimientoscerrados, fieldName).map(item => item[fieldName]);
}

  public onPanelChange(data: Array<PanelBarItemModel>): boolean {

    // // public onPanelChange(event: any) { 
    // //console.log("onPanelChange: ", event); 
    // //console.log("onPanelChange");
    // let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];
    // //console.log("focusedEvent.id: "+focusedEvent.id);
    // this.infopanelselec = focusedEvent.id;
    // if (focusedEvent.id !== "info") {
    //    this.selectedId = focusedEvent.id;
    //    //console.log("selec id: ")+this.selectedId;
    //   //  this.router.navigate(["/" + focusedEvent.id]);
    // }

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
    this.service.getRequerimientosPendientesFB().subscribe((datos:any) =>{
      console.log('Requerimientos leidos ', datos);
      if (datos){
        this.requerimientospen = datos;
        this.gridData = filterBy(this.requerimientospen, this.filter);
        console.log(this.requerimientospen);            
        this.service.getrequerimientosCerradosFB().subscribe((datos:any) =>{
          console.log('Requerimientos cerrados ', datos);
          if (datos){
            this.cargando = false;
            this.resultados = true;
             this.cargo_requerimientos = true;
            this.requerimientoscerrados = datos;
            this.gridDatacerrados = filterBy(this.requerimientoscerrados, this.filtercerrados);
            console.log(this.requerimientoscerrados);            
          }
        });
    
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



  generarequerimiento(){
    const numrequerimiento = this.service.generanumTicket();
    const datosrequer = {
      idrequer: numrequerimiento,
      tipo: 'Requerimiento',
      interno: true,
      nit_empre: '',
      nom_empre: '',
      asunto: 'Elaborar..',
      detalle: 'No puedo ingresar... .',
      impacto: '',
      soldesa: '',
      fecha: new Date(),
      cusuarsolicita: this.service.usuarFb.id,
      fechaevalua: new Date(),
      nomusuarsolicita: this.service.usuarFb.nombre,
      prioridad: 'Baja',
      evaluado: false,
      reportadoanetsolin: false,
      usuarevalua: '',
      usuarrepornetsolin: '',
      productoprin: '',
      modulo: '',
      asignado: false,
      asignadoa: '',
      fechaasignado: new Date(),
      iniciotrabajo: false,
      fintrabajo: false,
      fechainitrabajo: new Date(),
      fechafintrabajo: new Date(),
      enpruebas: false,
      fechainipruebas: new Date(),
      fechafinpruebas: new Date(),
      entregado: false,
      fechaentregado: new Date(),
      usuarrecibe: ''
    };
    this.service.addRequerimientoFb(numrequerimiento,datosrequer);
  }
  editClick(event){

  }
  public monitorClick(dataItem): void {
    console.log('monitorclick ', dataItem);
    var pruta = `/monitorrequerimiento/${dataItem.nit_empre}/${dataItem.idrequer}/`;
    console.log("ir a monitor requer:" + pruta);
    this.router.navigate([pruta]);
  }

public verRegK(dataItem): void {
}
public sortChange(sort: SortDescriptor[]): void {
  this.sort = sort;
  this.gridData = orderBy(this.requerimientospen, this.sort);
}
public sortChangecerrados(sort: SortDescriptor[]): void {
  this.sortcerrados = sort;
  this.gridDatacerrados = orderBy(this.requerimientoscerrados, this.sortcerrados);
}

public colorCode(code: boolean): SafeStyle {
  let result;

  switch (code) {
   case true :
     result = '#FFBA80';
     break;
   case false :
     result = '#B2F699';
     break;
   default:
     result = 'transparent';
     break;
  }
  return this.sanitizer.bypassSecurityTrustStyle(result);
  }

  public addHandler() {
    this.editDataItem = new Requerimiento();
    this.editDataItem.idrequer = this.service.generanumTicket();
    this.editDataItem.fecha = new Date();
    this.isNew = true;
}

public editHandler({dataItem}) {
  console.log(dataItem);
    this.editDataItem = dataItem;
    this.isNew = false;
}

public cancelHandler() {
    this.editDataItem = undefined;
}

public saveHandler(requer: any) {
    console.log('a grabar ',requer,this.isNew, this.editDataItem);
    // incidentgrabar = new Incidente();
    if (this.isNew){
      const numrequerimiento = this.service.generanumTicket();
      const clieact =  this.service.clientes.filter(reg => reg.Nit === requer.nit_empre);
      const datosrequer = {
        idrequer: numrequerimiento,
        tipo: requer.tipo,
        interno: requer.interno,
        impacto: requer.impacto,
        soldesa: '',
        nit_empre: requer.nit_empre,
        nom_empre: clieact[0].Empresa,
        asunto: requer.asunto,
        detalle: requer.detalle,
        prioridad: requer.prioridad,
        reportarnetsolin: true,
        solucionado: false,
        evaluado: requer.evaluado,
        nomusuarsolicita: requer.nomusuarsolicita,
        fecha: new Date(),
        fechaevalua: new Date(),
        fechaasignado: new Date(),
        usuarevalua: this.service.usuarFb.nombre,
        reportadoanetsolin: true,
        solucionaevaluador: false,
        asignado: true,
        asignadoa: requer.asignadoa,
        usuarrepornetsolin: this.service.usuarFb.nombre,
        entregado: false,
        fechaentregado: new Date(),
        productoprin: requer.productoprin,
        iniciotrabajo: requer.iniciotrabajo,
        fechainitrabajo: new Date(),
        modulo: requer.modulo
      };
      console.log('a grabar', datosrequer);
      this.service.addRequerimientoFb(numrequerimiento,datosrequer);      
      this.service.regLogRequerimientoFb(false,datosrequer, true, 'Definición','Adicionado','Se adiciono requerimiento',false,false);
    } else {
      const clieact =  this.service.clientes.filter(reg => reg.Nit === requer.nit_empre);
      this.editDataItem.tipo = requer.tipo;
      this.editDataItem.nit_empre = requer.nit_empre;
      this.editDataItem.nom_empre = clieact[0].Empresa;
      this.editDataItem.impacto = requer.impacto;
      this.editDataItem.interno = requer.interno;
      this.editDataItem.modulo = requer.modulo;
      this.editDataItem.nomusuarsolicita = requer.nomusuarsolicita;
      if (!this.editDataItem.asignado){
          this.editDataItem.asignado = true;
          this.editDataItem.asignadoa = requer.asignadoa;
          this.editDataItem.fechaasignado = new Date();
      } else {
        // this.editDataItem.asignado = false;
        this.editDataItem.asignadoa = requer.asignadoa;
        // this.editDataItem.fechaasignado = new Date();
      }
      if (!this.editDataItem.evaluado && requer.evaluado){
        this.editDataItem.evaluado = true;
        this.editDataItem.usuarevalua = this.service.usuarFb.nombre;
        this.editDataItem.fechaevalua = new Date();
    } else {
      this.editDataItem.evaluado = requer.evaluado;
      this.editDataItem.usuarevalua = this.service.usuarFb.nombre;
      // this.editDataItem.fechaevalua = new Date();
    }
    if (!this.editDataItem.iniciotrabajo && requer.iniciotrabajo){
      this.editDataItem.iniciotrabajo = requer.iniciotrabajo;
      this.editDataItem.fechainitrabajo = new Date();
    } else {
      this.editDataItem.iniciotrabajo = requer.iniciotrabajo;
      // this.editDataItem.fechainitrabajo = new Date();
    }
    this.editDataItem.impacto = requer.impacto;
      this.editDataItem.asunto = requer.asunto;
      this.editDataItem.detalle = requer.detalle;  
      this.editDataItem.prioridad = requer.prioridad;  
      this.editDataItem.productoprin = requer.productoprin;  
      this.editDataItem.modulo = requer.modulo;  
      this.service.actRequerimientoFb(this.editDataItem.idrequer, this.editDataItem);
      this.service.regLogRequerimientoFb(false,this.editDataItem, false, 'Definición', 'Modificado','Se modifico requerimiento',false,false);
      console.log('editar ', this.editDataItem);
    }


    this.editDataItem = undefined;
}

public removeHandler({dataItem}) {
    // this.editService.remove(dataItem);
    if (dataItem.entregado || dataItem.evaluado ){
      this.showAlerta('Advertencia', 'No se puede eliminar si esta evaluado o entregado');
    } else {
    this.service.deleteRequerimientoFb(dataItem.idrequer);
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
