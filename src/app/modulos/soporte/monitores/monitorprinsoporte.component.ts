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
import { Incidente } from '../modeldatoincidente';
// import { Incidente } from './model';
@Component({
  selector: 'app-monitorprinsoporte',
  templateUrl: './monitorprinsoporte.component.html',
  styleUrls: ['./monitorprinsoporte.component.css']
})
export class MonitorPrinSoporteComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @Input() vparcaptura: string;
  @Input() vid: any;
//incidentes
  cargo_incidentes = true;
  incidentespen: any;
  incidentescerrados: any;
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
public gridData: any[] = filterBy(this.incidentespen, this.filter);
public gridDatacerrados: any[] = filterBy(this.incidentescerrados, this.filtercerrados);
public editDataItem: Incidente;
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
  puedecrearincidente= true;

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
    // this.gridData = process(this.incidentespen, this.state);
}
public dataStateChangecerrados(state: DataStateChangeEvent): void {
  this.statecerrados = state;
}

public filterChange(filter: CompositeFilterDescriptor): void {
  this.filter = filter;
  this.gridData = filterBy(this.incidentespen, filter);
}

public distinctPrimitive(fieldName: string): any {
return distinct(this.incidentespen, fieldName).map(item => item[fieldName]);
}
public filterChangecerrados(filter: CompositeFilterDescriptor): void {
  this.filtercerrados = filter;
  this.gridDatacerrados = filterBy(this.incidentescerrados, filter);
}

public distinctPrimitivecerrados(fieldName: string): any {
return distinct(this.incidentescerrados, fieldName).map(item => item[fieldName]);
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
    // this.cargaparametrosbasicos();
    // this.generaticket();
    this.service.getIncidentePendientesFB().subscribe((datos:any) =>{
      console.log('Incidentes leidos ', datos);
      if (datos){
        this.incidentespen = datos;
        this.gridData = filterBy(this.incidentespen, this.filter);
        console.log(this.incidentespen);            
        this.service.getIncidenteCerradosFB().subscribe((datos:any) =>{
          console.log('Incidentes cerrados ', datos);
          if (datos){
            this.cargando = false;
            this.resultados = true;
             this.cargo_incidentes = true;
            this.incidentescerrados = datos;
            this.gridDatacerrados = filterBy(this.incidentescerrados, this.filtercerrados);
            console.log(this.incidentescerrados);            
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
    if (ptipo == 'llamabusqueda') {
      this.llamabusqueda = true;
    }   
    
  }
  public closeconsulta(ptipo) {
  }
  public closebusquellama(event){
    // console.log('en moni cliepote llega sde bus prod:'+event);
    this.pruellegallabusque=event;
    this.llamabusqueda = false;

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
    if (ptipo == 'cotiza') {
      // this.crearcotiza = false;
    } 
  }

  retornaRutacotiza() {
    return '/cotizacion'+ '/VPARCOTIZACRM_C/0' +  '/' +  '0/' + '0/A/na/na';
  }

  

  retornaRutaVendedor(ppersona) {
     console.log('Retorna ruta ', ppersona);
      return '/monitorvendedor/VPARVENDEDORES/' + ppersona.cod_person;
  }
  
  generaticket(){
    const numticket = this.service.generanumTicket();
    const datosinciden = {
      ticket: numticket,
      nit_empre: this.service.empreFb.nit,
      nom_empre: this.service.empreFb.nombre,
      asunto: 'Al ingres',
      detalle: 'No puedo ingresar... .',
      prioridad: 'Alta',
      reportarnetsolin: false,
      solucionado: false,
      cusuareporta: this.service.usuarFb.id,
      nomusuarreporta: this.service.usuarFb.nombre,
      fecha: new Date(),
      fechaevalua: new Date(),
      usuarevalua: '',
      evaluado: true,
      reportadoanetsolin: false,
      solucionaevaluador: false,
      usuarrepornetsolin: '',
      fecharepornetsolin: new Date(),
      solucionetsolin: false,
      fechasolucionado: new Date(),
      conssoluciono: ''
    };
    this.service.addIncidenteFb(numticket,datosinciden);
  }
  editClick(event){

  }
  public monitorClick(dataItem): void {
    console.log('monitorclick ', dataItem);
    var pruta = `/monitorincidencia/${dataItem.nit_empre}/${dataItem.ticket}/`;
    console.log("ir a monitor incidente:" + pruta);
    this.router.navigate([pruta]);
  }

public verRegK(dataItem): void {

  // var vpref = ((this.prefopermant == '') ? 'basica' : this.prefopermant);
  // var pruta = '/verregt' + vpref + '/' + this.varparcaptura;
  // // console.log("pruta:" + pruta);
  // // console.log("pvalc:"+pvalc);
  // // var pvalc= this.retornaValcampo(this.gridData.data[rowIndex],'C');
  // var pvalc = this.retornaValcampo(dataItem, 'C');
  // // console.log("verregk pvalc:" + pvalc);
  // this.router.navigate([pruta, pvalc]);
  // // console.log("verregk antes evenclose:" );
  // // this.evenclose.emit("");

}
public sortChange(sort: SortDescriptor[]): void {
  this.sort = sort;
  this.gridData = orderBy(this.incidentespen, this.sort);
  // this.gridData = filterBy(this.incidentespen, this.filter);
  // this.loadProducts();
}
public sortChangecerrados(sort: SortDescriptor[]): void {
  this.sortcerrados = sort;
  this.gridDatacerrados = orderBy(this.incidentescerrados, this.sortcerrados);
}
public colorxinitrabajo(code: boolean): SafeStyle {
  let result;

  switch (code) {
   case true :
     result = '#B2F699';
     break;
  //  case false :
  //    result = '#FFBA80';
  //    break;
   default:
     result = 'transparent';
     break;
  }
  return this.sanitizer.bypassSecurityTrustStyle(result);
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
    this.editDataItem = new Incidente();
    this.editDataItem.ticket = this.service.generanumTicket();
    this.editDataItem.fecha = new Date();
    this.editDataItem.nit_empre = '';
    this.editDataItem.nom_empre = '';
    this.editDataItem.cusuareporta = '';
    this.editDataItem.nomusuarreporta = '';

    this.isNew = true;
}

public editHandler({dataItem}) {
    this.editDataItem = dataItem;
    this.isNew = false;
}

public cancelHandler() {
    this.editDataItem = undefined;
}

public saveHandler(incidente: Incidente) {
    console.log('a grabar ',incidente,this.isNew, this.editDataItem);
    // incidentgrabar = new Incidente();
    if (this.isNew){
      const numticket = this.service.generanumTicket();
      const clieact =  this.service.clientes.filter(reg => reg.Nit === incidente.nit_empre);
      const datosinciden = {
        ticket: numticket,
        nit_empre: incidente.nit_empre,
        nom_empre: clieact[0].Empresa,
        asunto: incidente.asunto,
        detalle: incidente.detalle,
        prioridad: incidente.prioridad,
        reportarnetsolin: true,
        solucionado: false,
        cusuareporta: '',
        nomusuarreporta: incidente.nomusuarreporta,
        fecha: new Date(),
        fechaevalua: new Date(),
        usuarevalua: '',
        evaluado: false,
        reportadoanetsolin: true,
        solucionaevaluador: false,
        usuarrepornetsolin: this.service.usuarFb.nombre,
        fecharepornetsolin: new Date(),
        solucionetsolin: false,
        fechasolucionado: new Date(),
        nivelcriticidad: incidente.nivelcriticidad,
        productoprin: incidente.productoprin,
        canaling: incidente.canaling,
        conssoluciono: '',     
        seasignocons: false,
        consasignado:'',
        fechainitrabajo: new Date(),   
        solucion: '',
        fechaasignado: new Date(),
        iniciotrabajo: false
      };
      console.log('a grabr', datosinciden);
      this.service.addIncidenteFb(numticket,datosinciden);      
      this.service.regLogincidenteFb(false,datosinciden, true, 'Adicionado','Se adiciono Incidente', false);
    } else {
      this.editDataItem.asunto = incidente.asunto;
      this.editDataItem.detalle = incidente.detalle;  
      this.editDataItem.prioridad = incidente.prioridad;  
      this.editDataItem.nivelcriticidad = incidente.nivelcriticidad;  
      this.editDataItem.productoprin = incidente.productoprin;  
      this.editDataItem.canaling = 'web';  
      this.editDataItem.solucion = '';  
      this.service.actIncidenteFb(this.editDataItem.ticket, this.editDataItem);
      this.service.regLogincidenteFb(false,this.editDataItem, true, 'Modificado','Se modifico Incidente', false);
      console.log('editar ', this.editDataItem);
    }

    // this.service.grabarincidenteFb(this.editDataItem, this.isNew);

    this.editDataItem = undefined;
}

public removeHandler({dataItem}) {
    // this.editService.remove(dataItem);
    if (dataItem.solucionado || dataItem.seasignocons ){
      this.showAlerta('Advertencia', 'No se puede eliminar si esta asignado o cerrado');
    } else {
    this.service.deleteIncidenteFb(dataItem.ticket);
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
