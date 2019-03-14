import { Component, OnInit, Input, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import {
  DialogService,
  DialogRef,
  DialogCloseResult
} from "@progress/kendo-angular-dialog";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { TabStripComponent } from "@progress/kendo-angular-layout";
import {
  PanelBarExpandMode,
  PanelBarItemModel
} from "@progress/kendo-angular-layout";
import {
  SortDescriptor,
  orderBy,
  groupBy,
  process,
  State,
  CompositeFilterDescriptor,
  filterBy,
  FilterDescriptor,
  distinct
} from "@progress/kendo-data-query";
import {
  GridComponent,
  PageChangeEvent,
  DataStateChangeEvent
} from "@progress/kendo-angular-grid";
import { pipe } from "@angular/core/src/render3/pipe";
import { catchError, map, tap } from "rxjs/operators";

import { NetsolinApp } from "../../../../shared/global";
import { MantbasicaService } from "../../../../services/mantbasica.service";
import { MantablasLibreria } from "../../../../services/mantbasica.libreria";
import { varGlobales } from "../../../../shared/varGlobales";
import { NetsolinService } from "../../../../services/netsolin.service";
import { DomSanitizer } from "@angular/platform-browser";
// import { SoporteService } from '../../../../services/soporte.service';
import { AngularFirestore } from "@angular/fire/firestore";
// import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from "rxjs";
import {
  FileRestrictions,
  SelectEvent,
  ClearEvent,
  RemoveEvent,
  FileInfo
} from "@progress/kendo-angular-upload";

// import { NetsolinService } from '../../../../netsolinlibrerias/servicios/netsolin.service';
import { Requerimiento } from "../../modeldatorequerimiento";
import { Archivoinc } from "../../modeldatoarchivo";
import { Logrequer } from "../../modeldatologrequer";

@Component({
  selector: "monitor-requerimiento",
  templateUrl: "./monitor.component.html",
  styleUrls: ["./monitor.component.css"]
})
export class MonitorRequerimientoComponent implements OnInit {
  @ViewChild("tabstrip") public tabstrip: TabStripComponent;
  @Input() nit_empresa: string;
  @Input() idrequer: string;
  public editForm: FormGroup = new FormGroup({
    tipo: new FormControl("", Validators.required),
    interno: new FormControl(false),
    nit_empre: new FormControl("", Validators.required),
    nom_empre: new FormControl(""),
    asunto: new FormControl("", Validators.required),
    detalle: new FormControl("", Validators.required),
    impacto: new FormControl("", Validators.required),
    soldesa: new FormControl("", Validators.required),
    cusuarsolicita: new FormControl(""),
    nomusuarsolicita: new FormControl("", Validators.required),
    prioridad: new FormControl("Baja", Validators.required),
    evaluado: new FormControl(false),
    productoprin: new FormControl("netwin", Validators.required),
    modulo: new FormControl("netwin", Validators.required),
    asignado: new FormControl(false),
    asignadoa: new FormControl("", Validators.required),
    iniciotrabajo: new FormControl(false)
  });

  public listprioridades: Array<string> = ["Baja", "Media", "Alta"];
  public resultalert;
  public state: State = {
    skip: 0,
    take: 30
  };
  public statelog: State = {
    skip: 0,
    take: 30
  };
  public sort: SortDescriptor[] = [
    {
      field: "fecha",
      dir: "desc"
    }
  ];
  public sortlog: SortDescriptor[] = [
    {
      field: "fecha",
      dir: "desc"
    }
  ];
  public listtipos: Array<string> = [
    'Requerimiento', 'Sol. Cambio'
];

  pnit_empresa: string;
  pidrequer: string;
  chatmensaje: string = '';
  title: string;
  subtitle = "(Monitor)";
  varParam: string;
  soportemant: string;
  enerror = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  message = "";
  cargando = false;
  resultados = false;
  init = false;
  requerimiento: any = {};
  logrequerimientos: Array<any> = [];
  logrequerimientosgroup: Array<any> = [];
  archivosrequerimientos: Array<any> = [];
  public filter: CompositeFilterDescriptor;
  public filternov: CompositeFilterDescriptor;
  public gridDataArch: any[] = filterBy(this.archivosrequerimientos, this.filter);
  public gridDataNov: any[] = filterBy(this.logrequerimientos, this.filternov);
  public editDataItem: Requerimiento;
  public editDataItemNov: any;
  public isNew: boolean;
  public isNewnov: boolean;

  chatrequerimientos: Array<any> = [];
  // Manejo panel de informacion
  infopanelselec: string;
  mostrarmensaje = false;
  collapse = false;
  esconder = false;
  cargo_requerimiento = false;
  cargo_log = false;
  cargo_chat = false;
  cargo_archivos = false;
  classxestado: string;
  public textnivelcriticidad: string = "";
  public textproducto: string = "";

  public widtharchivos = "100%";
  public heightarchivos = "500px";
  public active = false;
  public editDataItemArch: Archivoinc;

  constructor(
    private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    public service: NetsolinService,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private httpc: HttpClient,
    private sanitizer: DomSanitizer,
    private dialogService: DialogService,
    // private storage: AngularFireStorage,
    private db: AngularFirestore
  ) {
    this.vglobal.mostrarbreadcrumbs = false;
  }

  public onPanelChange(data: Array<PanelBarItemModel>): boolean {
    console.log("onPanelChange: ", event, data);
    return false;
  }
  public stateChange(data: Array<PanelBarItemModel>): boolean {
    console.log("stateChange", data);
    return false;
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    console.log(" dataStateChange");
    this.state = state;
    // this.gridData = process(this.requerimientospen, this.state);
  }
  public dataStateChangelog(state: DataStateChangeEvent): void {
    console.log(" dataStateChange");
    this.statelog = state;
    // this.gridData = process(this.requerimientospen, this.state);
  }
  ngOnInit() {
    console.log("en ngOnInit requerimiento", this.nit_empresa, this.idrequer);
    this.cargando = true;
    this.resultados = false;
    this.activatedRouter.params.subscribe(parametros => {
      this.pnit_empresa = parametros["nit_empresa"];
      this.pidrequer = parametros["idrequer"];
      console.log(this.pnit_empresa, this.pidrequer);
      //cargar requerimiento 
      this.db
        .collection(`/requerimientos`)
        .doc(this.pidrequer)
        .valueChanges()
        .subscribe((data: any) => {
          console.log("trae requerimiento de firebase", data);
          this.requerimiento = data;
          this.editForm.reset(this.requerimiento);
          console.log('this.editForm',this.editForm);
          console.log('this.editForm',this.editForm.value);
          this.editDataItem = this.requerimiento;
          console.log('this.editDataItem',this.editDataItem);
          this.active = this.requerimiento !== undefined;
          console.log('this.active',this.active);
          this.textproducto = this.retornaproducto(data);
          //Si esta solucionada
          console.log(data.entregado);
          if (data.entregado) {
            this.classxestado = "bg-success";
          } else if (data.evaluado) {
            this.classxestado = "bg-warning";
          } else {
            this.classxestado = "bg-info";
          }
          console.log( this.classxestado);
          this.cargando = false;
          this.resultados = true;
          //cargar log
          this.service
            .getLogRequerimientoFB(this.pidrequer)
            .subscribe((datoslog: any) => {
              // this.getLogRequerimiento(this.pidrequer).subscribe((datoslog: any) => {
              console.log("datoslog", datoslog);
              this.logrequerimientos = orderBy(datoslog,  [{ field: "fecha", dir: "desc"}]);
              this.logrequerimientosgroup = groupBy(datoslog, [
                { field: "fechastr", dir: "desc" },
                { field: "fecha", dir: "desc" }
              ]);
              this.gridDataNov = filterBy(this.logrequerimientos,this.filternov);
              // console.log(result);
              this.cargo_requerimiento = true;
              // console.log(JSON.stringify(this.logrequerimientos, null, 2));
              // console.log('getLogRequerimiento cargada ', this.logrequerimientos);
            });
          //cargar  chat requerimiento
          this.service.getChatRequerimientoFB(this.pidrequer).subscribe((datoschat: any) => {
            this.chatrequerimientos = orderBy(datoschat,  [{ field: "fecha", dir: "asc"}]);
            this.cargo_chat = true;
            console.log("chatrequerimientos cargada ", this.chatrequerimientos);
          });
          //cargar  archivos requerimiento
          console.log("a traer archivos", this.pidrequer);
          this.getArchivosrequerimiento(this.pidrequer).subscribe(
            (datosarch: any) => {
              console.log("archivos traidos ", datosarch);
              this.archivosrequerimientos = datosarch;
              this.cargo_archivos = true;
              this.gridDataArch = filterBy(
                this.archivosrequerimientos,
                this.filter
              );

              console.log(
                "archivosrequerimientos cargada ",
                this.archivosrequerimientos,
                this.filter
              );
            }
          );
        });
    });
  }
  public filterChangelog(filter: CompositeFilterDescriptor): void {
    this.filternov = filter;
    this.gridDataNov = filterBy(this.logrequerimientos, filter);
  }
  public distinctPrimitivelog(fieldName: string): any {
    return distinct(this.logrequerimientos, fieldName).map(
      item => item[fieldName]
    );
  }
  public sortChangelog(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.gridDataNov = orderBy(this.logrequerimientos, this.sort);
  }


  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.gridDataArch = filterBy(this.archivosrequerimientos, filter);
  }
  public distinctPrimitive(fieldName: string): any {
    return distinct(this.archivosrequerimientos, fieldName).map(
      item => item[fieldName]
    );
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.gridDataArch = orderBy(this.archivosrequerimientos, this.sort);
  }
  //Trae Log requerimiento  actual firebase
  public getLogRequerimiento(id: string) {
    return this.db.collection(`/requerimientos/${id}/log`).valueChanges();
  }

  //Trae archivos requerimiento  actual firebase
  public getArchivosrequerimiento(id: string) {
    return this.db
      .collection(`/requerimientos/${id}/archivos`)
      .valueChanges()
      .pipe(
        map(actions =>
          actions.map((a: any) => {
            // console.log(a);
            a.fecha = a.fecha.toDate();
            return a;
          })
        )
      );
  }

  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {}

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

  retornaSoporteAcampana() {
    // addregtbasica/VPARCOMPETENCIA
  }

  openconsulta(ptipo) {
    if (ptipo == "llamabusqueda") {
      // this.llamabusqueda = true;
    }
  }
  public closeconsulta(ptipo) {}
  public closebusquellama(event) {
    console.log("en moni cliepote llega sde bus prod:" + event);
    // this.pruellegallabusque = event;
    // this.llamabusqueda = false;
  }

  openeditar(ptipo) {}
  public closeeditar(ptipo) {}

  //maneja el control para llamado adicion de tablas
  openadicion(ptipo) {
    if (ptipo == "cotiza") {
      // this.crearcotiza = true;
    }
  }
  //maneja el control para cerrar

  public closeadicion(ptipo) {
    if (ptipo == "cotiza") {
      // this.crearcotiza = false;
    }
  }

  conmutacollapse() {
    this.collapse = !this.collapse;
  }
  esconderpanel() {
    this.esconder = true;
  }

  cleanURL(oldURL: string) {
    return this.sanitizer.bypassSecurityTrustUrl(oldURL);
  }
  retornaproducto(datai) {
    // console.log(this.service.productosprin);
    console.log(datai, this.service.productosprin);
    const rfiltro = this.service.productosprin.filter(
      reg => reg.id === datai.productoprin
    );
    // console.log(rfiltro, datai);
    if (rfiltro) {
      return rfiltro[0].nombre;
    } else {
      return "ND";
    }
  }
  private closeForm(): void {
    this.active = false;
  }
  public onSave(e): void {
    e.preventDefault();
    let asignocons = false;
    let iniciotrabajo = false;
    let requerform = this.editForm.value;
    console.log("a grabar ",e,requerform,this.requerimiento,this.editForm,this.editDataItem);
    this.editDataItem.tipo = requerform.tipo;
    this.editDataItem.interno = requerform.interno;
    this.editDataItem.nit_empre = requerform.nit_empre;
    const clieact =  this.service.clientes.filter(reg => reg.Nit === requerform.nit_empre);
    this.editDataItem.nom_empre = clieact[0].Empresa;
    this.editDataItem.asunto = requerform.asunto;
    this.editDataItem.detalle = requerform.detalle;
    this.editDataItem.impacto = requerform.impacto;
    this.editDataItem.soldesa = requerform.soldesa;    
    this.editDataItem.nomusuarsolicita = requerform.nomusuarsolicita;
    this.editDataItem.prioridad = requerform.prioridad;    
    this.editDataItem.productoprin = requerform.productoprin;
    this.editDataItem.modulo = requerform.modulo;
    if (!this.requerimiento.asignado) {
      if (requerform.asignadoa != "") {
        this.editDataItem.asignado = true;
        this.editDataItem.asignadoa = requerform.asignadoa;
        this.editDataItem.fechaasignado = new Date();
        asignocons = true;
        if (!this.requerimiento.iniciotrabajo) {
          if (requerform.iniciotrabajo) {
            this.editDataItem.iniciotrabajo = true;
            this.editDataItem.fechainitrabajo = new Date();
            iniciotrabajo = true;
          } else {
            this.editDataItem.iniciotrabajo = false;
            this.editDataItem.fechainitrabajo = new Date();
            iniciotrabajo = false;
          }
        } else {
          if (requerform.iniciotrabajo) {
            this.editDataItem.iniciotrabajo = true;
            iniciotrabajo = true;
          } else {
            this.editDataItem.iniciotrabajo = false;
            iniciotrabajo = false;
          }
        }
        if (!this.requerimiento.evaluado) {
          if (requerform.evaluado) {
            this.editDataItem.evaluado = true;
            this.editDataItem.fechaevalua = new Date();
          } else {
            this.editDataItem.evaluado = false;
          }
        } else {
          if (requerform.evaluado) {
            this.editDataItem.evaluado = true;
          } else {
            this.editDataItem.evaluado = false;
          }
        }
      } else {
        this.editDataItem.asignado = false;
        this.editDataItem.asignadoa = '';
        this.editDataItem.fechaasignado = new Date();
        iniciotrabajo = false;
        this.editDataItem.iniciotrabajo = false;
        this.editDataItem.fechainitrabajo = new Date();
        this.editDataItem.evaluado = false;
      }
    } else {
      if (requerform.asignadoa != "") {
        this.editDataItem.asignado = true;
        this.editDataItem.asignadoa = requerform.asignadoa;
        asignocons = true;
        if (!this.requerimiento.iniciotrabajo) {
          if (requerform.iniciotrabajo) {
            this.editDataItem.iniciotrabajo = true;
            this.editDataItem.fechainitrabajo = new Date();
            iniciotrabajo = true;
          } else {
            this.editDataItem.iniciotrabajo = false;
            iniciotrabajo = false;
          }
        } else {
          if (requerform.iniciotrabajo) {
            this.editDataItem.iniciotrabajo = true;
            iniciotrabajo = true;
          } else {
            this.editDataItem.iniciotrabajo = false;
            this.editDataItem.fechainitrabajo = new Date();
            iniciotrabajo = false;
          }
        }
        if (!this.requerimiento.evaluado) {
          if (requerform.evaluado) {
            this.editDataItem.evaluado = true;
            this.editDataItem.fechaevalua = new Date();
          } else {
            this.editDataItem.evaluado = false;
          }
        } else {
          if (requerform.evaluado) {
            this.editDataItem.evaluado = true;
          } else {
            this.editDataItem.evaluado = false;
          }
        }
      } else {
        this.editDataItem.asignado = false;
        this.editDataItem.asignadoa = '';
        this.editDataItem.fechaasignado = new Date();
        iniciotrabajo = false;
        this.editDataItem.iniciotrabajo = false;
        this.editDataItem.evaluado = false;
      }      
    }
      this.service.actRequerimientoFb(this.editDataItem.idrequer, this.editDataItem);
      if (asignocons){
        this.service.regLogRequerimientoFb(false,this.editDataItem, false,"Etapa","Asignado Consultor","Se asigno como sonsultor a: "+requerform.asignadoa,false,false);
      }
      if (iniciotrabajo){
        this.service.regLogRequerimientoFb(false,this.editDataItem,false,"Etapa","Inicio","Se inicio a trabajar en el requerimiento",false,false);
      }
  }

  public addHandler() {
    this.editDataItemArch = new Archivoinc();
    this.editDataItemArch.id = this.service.generanumTicket();
    this.editDataItemArch.fecha = new Date();
    this.editDataItemArch.nombre = "";
    this.editDataItemArch.link = "";
    this.editDataItemArch.usuarcrea = this.service.usuarFb.id;
    this.isNew = true;
  }
  public addHandlerlog() {
    //    this.editDataItemNov = new Logrequer();
    // this.editDataItemNov.id = this.service.generanumTicket();
    // this.editDataItemNov.fecha = new Date();
    // this.editDataItemNov.accion = "";
    // this.editDataItemNov.maninterno = false;   
    // this.editDataItemNov.nombreporta = this.service.usuarFb.nombre;
    // this.editDataItemNov.regcliente = false;   
    // this.editDataItemNov.seguimiento = "";
    // this.editDataItemNov.soluciona = false;   
    this.editDataItemNov = {
      id: '',
      fecha: new Date(),
      maninterno: false,
      entregado: false,
      terminaetapa: false,
      etapa: '',
      modulo: '',
      novedad: ''
    };
    this.isNewnov = true;
  }


  public editHandler({ dataItem }) {
    this.editDataItemArch = dataItem;
    this.isNew = false;
  }

  public editHandlerlog({ dataItem }) {
    console.log('editHandlerlog', dataItem, this.editDataItemNov);

    this.editDataItemNov = {
      id: dataItem.id,
      fecha: dataItem.fecha,
      // accion: dataItem.accion,
      maninterno: dataItem.maninterno,
      entregado: this.requerimiento.entregado,
      etapa: dataItem.etapa,
      terminaetapa: dataItem.terminaetapa,
      novedad: dataItem.seguimiento,      
    };
    this.isNewnov = false;
  }


  public cancelHandlerArch() {
    this.editDataItemArch = undefined;
  }

  public saveHandlerArch(archivo: any) {
    console.log(
      "a grabar archivo ",
      archivo,
      this.isNew,
      this.editDataItemArch
    );
    // incidentgrabar = new Requerimiento();
    if (this.isNew) {
      let imagePreviews: FileInfo[] = [];
      const that = this;

      archivo.myUpload.forEach(file => {
        const id = this.service.generanumTicket();
        console.log(`File selected: ${file.name}`);
        if (!file.validationErrors) {
          this.service.addArchivoRequerimientoFb(
            this.pidrequer,
            id,
            archivo.nombre,
            file.name,
            file.rawFile
          );
          this.service.regLogRequerimientoFb(false,
            this.requerimiento,
            false,
            'Etapa',
            "Adjunto archivo",
            "Se adjunto archivo: " + file.name,
            false, false
          );
          // reader.readAsDataURL(file.rawFile);
          console.log("raw", file.rawFile);
        }
      });

      // const datosarchivo = {
      //   id: id,
      //   nombre: archivo.nombre,
      //   usuarcrea: this.service.usuarFb.nombre,
      //   fecha: new Date(),
      //   link: archivo.link
      // };
      // this.service.addArchivoRequerimientoFb(this.pidrequer,id,datosarchivo);
      // this.service.regLogrequerimientoFb(this.requerimiento, true, 'Adjunto archivo','Se adiciono Archivo: '+archivo.nombre, false);
    } else {
      // console.log('a actualizar archivo',this.pidrequer, this.editDataItemArch.id, this.editDataItemArch);
      this.editDataItemArch.nombre = archivo.nombre;
      this.service.actArchivoRequerimientoFb(
        this.pidrequer,
        this.editDataItemArch.id,
        this.editDataItemArch
      );
      this.service.regLogRequerimientoFb(false,
        this.requerimiento,
        false,
        'Etapa',
        "Modi. nom archivo",
        "Se modifico archivo",
        false, false
      );
      // console.log('editar ', this.editDataItem);
    }

    // this.service.grabarrequerimientoFb(this.editDataItem, this.isNew);

    this.editDataItem = undefined;
  }
  public saveHandlerLog(log: any) {
    console.log("a grabar log ",log,this.isNewnov,this.editDataItemNov);
    // incidentgrabar = new Requerimiento();
    const actrequer = {
      entregado: log.entregado,
      fechasentregado: new Date()
    }
    if (this.isNewnov) {
      if (actrequer.entregado){
        this.service.actRequerimientoFb(this.requerimiento.idrequer, actrequer);
      }
      this.service.regLogRequerimientoFb(log.maninterno,this.requerimiento, false, log.etapa,'Reg. Novedad',log.novedad,  log.terminaetapa, log.entregado);
    } else {
      if (actrequer.entregado){
        this.service.actRequerimientoFb(this.requerimiento.idrequer, actrequer);
      }
// tslint:disable-next-line: max-line-length
      this.service.actLogrequerimientoFb(this.editDataItemNov.id,log.maninterno,this.requerimiento, false, 'Reg. Novedad',log.novedad, log.etapa, log.terminaetapa, log.entreado);
   }
    this.editDataItemNov = undefined;
  }

  public removeHandler({ dataItem }) {
    this.service.deleteArchivoRequerimientoFb(this.pidrequer, dataItem.id);
  } 
  public removeHandlerlog({ dataItem }) {
    this.service.deleteLogRequerimientoFb(this.pidrequer, dataItem.id);
  }

  public showAlerta(ptitulo, palerta) {
    const dialog: DialogRef = this.dialogService.open({
      title: ptitulo,
      content: palerta,
      actions: [{ text: "Ok", primary: true }],
      width: 450,
      height: 200,
      minWidth: 250
    });

    dialog.result.subscribe(result => {
      if (result instanceof DialogCloseResult) {
        console.log("close");
      } else {
        console.log("action", result);
      }

      this.resultalert = JSON.stringify(result);
    });
  }
  chatEnviamensaje(mensaje){
    console.log('mensaje a enviar', mensaje, this.chatmensaje);
    if (this.chatmensaje != ''){
      this.service.regChatrequerimientoFb(this.requerimiento, this.chatmensaje);
      this.chatmensaje = '';
    }
  }
}
