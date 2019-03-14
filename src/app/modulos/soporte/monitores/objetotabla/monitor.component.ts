import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { PanelBarExpandMode, PanelBarItemModel } from '@progress/kendo-angular-layout';

import { NetsolinApp } from '../../../../shared/global';
import { MantbasicaService } from '../../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../../services/mantbasica.libreria';
import { varGlobales } from '../../../../shared/varGlobales';
import { NetsolinService } from '../../../../services/netsolin.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// import { NetsolinService } from '../../../../netsolinlibrerias/servicios/netsolin.service';
@Component({
  selector: 'monitor-objtabla',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
//Ejecuta un monitor que retorna html para mostrar en formato tabla
//recibe el objeto Netsolin que ejecuta el monitor y los parametros
export class MonitorObjetotablaComponent implements OnInit {
  @ViewChild('tabstrip') public tabstrip: TabStripComponent;
  @Input() objeto: string;
  @Input() color: string;
  @Input() titulo: string;
  @Input() minimizada: string;
  @Input() paramobj: any;

  title: string;
  subtitle = '(Monitor)';
  id: string;
  enerror = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  message = "";
  cargando = false;
  resultados = false;
  cargoobjeto = false;
  regResultobj: any;
  // Manejo panel de informacion
  infopanelselec: string;
  mostrarmensaje=false;
  safeHtml: SafeHtml;
  collapse=false;
  esconder=false;
  ejecutoObjeto = false;

  constructor(private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private service: NetsolinService,
    private libmantab: MantablasLibreria,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private httpc: HttpClient
  ) {
    this.vglobal.mostrarbreadcrumbs = false;

  }

  ngOnInit() {
    // console.log('ngoninit esconder');
    // console.log(this.esconder);
    // console.log('ngoninit collapse');
    // console.log(this.collapse);
    // console.log('ngoninit color');
    // console.log(this.color);
    // console.log('ngoninit titulo');
    // console.log(this.titulo);
    // console.log('ngoninit minimizada');
    // console.log(this.minimizada);
    // console.log("en ngOnInit editregCliepotecial");
    this.activatedRouter.params
      .subscribe(parametros => {
        if (this.minimizada !='SI'){
          this.ejecutaObjeto();
        }
        this.resultados = true;
        this.collapse = false;
        if (this.minimizada==='SI'){
          this.collapse = true;
        } else {
          this.collapse = false;
        }
    
        this.title = '';
      }
    );
  }

  ejecutaObjeto(){
    this.ejecutoObjeto=true;
    this.enlistaerror=false;
    NetsolinApp.objenvrest.tiporet= "CON";
    this.service.getNetsolinObjconParametros(this.objeto,this.paramobj)
    .subscribe(result => {
        //viene registro con el precio o error
        // console.log("eje getNetsolinObjconParametros retorna result");
        // console.log(result);
        var result0 = result[0];
        // console.log(result0);
        if (typeof result.isCallbackError === "undefined") {       
          //viene el registro con titulo,subtitulo,html
          this.regResultobj = result0;
          this.cargoobjeto = true;
          this.inicializaMonitor(result0);

        } else {
          //viene el registro con el error
          console.log("Error en ejecutaObjeto 1");
          console.log(result);
          this.listaerrores=result.messages;
          this.enlistaerror=true;
          //   var regerror = result.messages[0];
          // this.message = regerror.menerror;
          // this.showError(regerror.menerror);
        }
      },
      error => {
        console.log("Error en ejecutaObjeto2 ");
        console.log(error);
        this.showError(error);
      }
    );

  }
  inicializaMonitor(preg: any) {
    var lcontrol: any;
    var avalida = [];
    var lcontrol: any;
    this.cargando = true;
    this.resultados = false;
    // console.log('inicializaMonitor minimizada');
    // console.log(this.minimizada);
      // console.log('inicializaMonitor titulo');
      // console.log(this.titulo);
      // console.log('inicializaMonitor collapse');
      // console.log(this.collapse);
  
    //Aqui codigo al inicializar
    // console.log('monitor html obj preg.html');
    // console.log(preg.html);
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(preg.html);
    // console.log('monitor html obj safeHtml');
    // console.log(this.safeHtml);
    this.cargando = false;
    this.resultados = true;
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
  }

  retornaRuta() {
    // console.log(this.rutamant);
    // return '/' + this.rutamant;
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
  }
  //maneja el control para cerrar

  public closeadicion(ptipo) {
  }

  retornaRutacotiza() {
    // console.log('ruta cotiza');
    // console.log('/cotizacion'+ '/VARPARCOTIZACRM_C/0' +  '/' + this.regCliepote.id_cliepote+ '/' + this.regCliepote.id_cliepote+'/A');
    // return '/cotizacion'+ '/VPARCOTIZACRM_C/0' +  '/' +  '0/' + '0/A/na/na';
  }
  conmutacollapse(){
    if (!this.ejecutoObjeto && this.collapse){
      this.ejecutaObjeto();
    }
    this.collapse = !this.collapse;
  }
  esconderpanel(){
    this.esconder = true;
  }
  cleanURL(oldURL: string) {
    return this.sanitizer.bypassSecurityTrustUrl(oldURL);
  }

}
