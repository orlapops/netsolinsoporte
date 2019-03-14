import { error } from 'util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { MantbasicaService } from '../../../services/mantbasica.service';
import { NetsolinApp } from '../../../shared/global';
import { NetsolinService } from '../../../services/netsolin.service';

import { process, State } from '@progress/kendo-data-query';
import {
    GridComponent,
    GridDataResult,
    PageChangeEvent,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';


@Component({
    selector: 'lista-busqueda',
    templateUrl: './listbusqueda.modal.component.html',
    styleUrls: ['./listbusqueda.modal.component.css']
})
export class ListbusquedamodalComponent implements OnInit {
    @Input() ptablab: string;
    @Input() paplica: string;
    @Input() porden: string;
    @Input() title: string;
    @Input() objeto: string;
    @Input() lobjbusqueda: string;
    @Input() rutamant: string;
  //filtro adicional si se requiere enviar a consulta    
    @Input() filtro: string;
    @Input() prefopermant: string;
    @Output() evenclose = new EventEmitter();
    
    pcampollave: string = "";
    pcamponombre: string = "";
    pclase_nbs: string = "";
    pclase_val: string = "";
    camposv: any[] = [];
    cargoConfig = false;
    aregstabla: any[] = [];
    cargando = true;
    resultados = false;
    noresultados = false;
    enlistaerror = false;
    listaerrores: any[] = [];
    campoBusqueda: FormControl;
    busqueda: string = '';
    enerror = false;
    eliminoreg = false;
    gridCcodigo = 'codigo';
    gridCnombre = 'nombre';
    muestraverant = false;
    varidreg: any;
    public opened: boolean = false;
    segper_consultar = false;
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
    public sort: SortDescriptor[] = [{
        field: 'cod_tercer',
        dir: 'asc'
    }];
    //nombre variable con parametros de tabla para pasar a adicion,mod,ver
    varparcaptura = "VPAR" + this.ptablab;

    constructor(private location: Location,
        private mantbasicaService: MantbasicaService,
        private service: NetsolinService,
        private httpc: HttpClient, private router: Router) {
        this.confirmado = null;
    }

    public dataStateChange(state: DataStateChangeEvent): void {
        // console.log("lista busqueda dataStateChange");
        this.state = state;
        this.gridData = process(this.aregstabla, this.state);
    }

    ngOnInit() {
        // console.log("ngOnInit listar.comp objeto: "+this.objeto);
        // console.log("ejengoninit:");
        // console.log(this.ejengoninit);
        this.ejengoninit = true;
        //si es cotización marca para adicionar y monitor manejar diferente
        if (this.objeto=='CRMCOTIZA'){
            this.es_cotiza = true;
        }
        //INICIALIZAR en blanco tabla de trabajo
        localStorage.setItem('NETMTABLA', "");
        this.resultados = false;
        this.campoBusqueda = new FormControl();
        // se debe asegurar que se ha leido archivo con url o fallara el servicio
        this.httpc.get('assets/netsolin_ini.json').subscribe(data => {
            NetsolinApp.urlNetsolin = data['url_netsolins'];
            //carga por servicio diccionario de tabla y lo guarda en localstorage
            // console.log("ngOnInit listar.comp 2");
            this.loaddiccionarios();
        });
    }
public retornaRutaCotiza(dataItem) {
    var pruta = '/cotizacion/VARPARCOTIZACRM_C/0/0/0/E/';
    var pvalc = this.retornaValcampo(dataItem, 'C');
    pruta = pruta+pvalc;
    // console.log('Ruta cotiza: '+pruta);
    return pruta
}
    public monitorClick(dataItem): void {
        if (this.es_cotiza){
            var pruta = '/cotizacion/VARPARCOTIZACRM_C/0/0/0/E/';
            var pvalc = this.retornaValcampo(dataItem, 'C');
            pruta = pruta+pvalc;
            this.router.navigate([pruta]);
        } else {
            // console.log('this.prefopermant:'+this.prefopermant);
        var vpref = ((this.prefopermant == '') ? 'basica' : this.prefopermant);
        // console.log("ir a monitor vpref:" + vpref);
        var pruta = '/monitor' + vpref + '/' + this.varparcaptura;
        // console.log("ir a monitor pruta:" + pruta);
        // console.log("pvalc:"+pvalc);
        // var pvalc= this.retornaValcampo(this.gridData.data[rowIndex],'C');
        var pvalc = this.retornaValcampo(dataItem, 'C');
        // console.log("pvalc:" + pvalc);
        this.router.navigate([pruta, pvalc]);
        }

    }

    public verRegK(dataItem): void {

        var vpref = ((this.prefopermant == '') ? 'basica' : this.prefopermant);
        var pruta = '/verregt' + vpref + '/' + this.varparcaptura;
        // console.log("pruta:" + pruta);
        // console.log("pvalc:"+pvalc);
        // var pvalc= this.retornaValcampo(this.gridData.data[rowIndex],'C');
        var pvalc = this.retornaValcampo(dataItem, 'C');
        // console.log("verregk pvalc:" + pvalc);
        this.router.navigate([pruta, pvalc]);
        // console.log("verregk antes evenclose:" );
        // this.evenclose.emit("");

    }
    public close() {
        // console.log('close vent cliente potencial');
        this.evenclose.emit("");
      }
    


    public onCancel(e, ditem): void {
        // console.log("en onCancel");
        // console.log(e);
        // console.log(ditem);

        // e.preventDefault();
        // this.closeForm();
    }
    ngOnChanges() {
        // console.log("ngOnChanges listabusqueda.comp filtro:"+this.filtro);    
        // console.log("ejengoninit:");
        // console.log(this.ejengoninit);
        if (this.ejengoninit && this.filtro.length  !== 0){
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
    editClick(event){

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
          .getNetsolinObjbusqueda(this.lobjbusqueda, this.busqueda, this.filtro)
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
                  console.log("resultado de busqueda aregstabla:");
                  console.log(this.aregstabla);
                this.gridData = process(this.aregstabla, this.state);
                localStorage.setItem('B' + this.rutamant, this.busqueda);
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

    ejeBusquedaANT() {
        // console.log("ejeBusqueda:" + this.busqueda);
        // console.log("ejeBusqueda:" + this.ptablab);
        // console.log("ejeBusqueda:" + this.paplica);
        // console.log("ejeBusqueda:" + this.pcampollave);
        // console.log("ejeBusqueda:" + this.pclase_nbs);
        // console.log("ejeBusqueda:" + this.pclase_val);
        // console.log("ejeBusqueda:" + this.pcamponombre);
        // console.log("ejeBusqueda:" + this.porden);
        // console.log("ejeBusqueda:" + this.objeto);
        this.confirmado = null;
        this.cargando = true;
        this.enlistaerror = false;
        this.mantbasicaService.gettablaSearch(this.busqueda, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre, this.porden, this.objeto, "")
            .subscribe(result => {
                //reiniciarlo a blanco para que no vuelva a refrescar
                this.filtro="";
                // console.log("eje busqueda result");
                // console.log(result);
                var result0 = result[0];
                // console.log(result0);
                if (typeof (result.isCallbackError) != "undefined") {
                    this.cargando = false;
                    this.resultados = true;
                    this.enlistaerror = true;
                    this.listaerrores = result.messages;
                    // console.log('Lista errores');
                    // console.log(this.listaerrores);
                    this.busqueda = '';
                    // this.enlistaerror=false;
                    localStorage.setItem('B' + this.rutamant, this.busqueda);
                }
                else {
                    this.aregstabla = result;
                    //   console.log("busqueda aregstabla:");
                    //   console.log(this.aregstabla);
                    //   console.log("Arreglo camposv:");
                    //   console.log(this.camposv);
                    // this.items = result;
                    // this.loadItems();
                    this.gridData = process(this.aregstabla, this.state);
                    localStorage.setItem('B' + this.rutamant, this.busqueda);
                    // console.log(this.aregstabla);
                    this.cargando = false;
                    this.resultados = true;
                    this.message = "Resultado para busqueda de: " + this.busqueda;
                }
            }, error => {
                //   console.log('Error en ejeBusqueda');
                // console.log(error);
                this.cargando = false;
                this.resultados = false;
                this.showError(error);
            });
    }


    retornaValcampo(pregistro, ptipo) {
        console.log("retornavalcampo");
        console.log(pregistro);

        if (ptipo == 'C') {
            var acllave = this.pcampollave.split(',');
            // console.log(acllave);
            //solo tener encuenta 2 para armar condicion 
            var lenallave = acllave.length;
            let lcadeval = '';
            if (acllave.length > 1) {
                var condi = '';
                if (this.es_cotiza){
                    lcadeval = "pregistro." + acllave[0] + "+'/'+pregistro." + acllave[1];
                } else {
                    lcadeval = "pregistro." + acllave[0] + "+'|'+pregistro." + acllave[1];
                }
            } else {
                lcadeval = "pregistro." + this.pcampollave;
            }
            console.log("retornavalcampo");
            console.log(lcadeval);
            let valretorna = eval(lcadeval);
            console.log("valretorna");
            console.log(valretorna);
            return valretorna;

        } else {
            let lcadeval = "pregistro." + this.pcamponombre;
            let valretorna = eval(lcadeval)
            return valretorna;
        }

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
        console.log("loaddicionarios");
        console.log("this.ptablab;"+this.ptablab);
        console.log("this.paplica;"+this.paplica);
        console.log("this.objeto;"+this.objeto);
        console.log("this.lobjbusqueda;"+this.lobjbusqueda);
        // this.service.getNetsolinObjmantbasica(this.objeto)
        this.service.getNetsolinObjmantbasica(this.lobjbusqueda)
            .subscribe(result => {
                console.log("getNetsolinObjmantbasica 1");
                console.log(result);
                var result0 = result[0];
                // console.log(result0);
                if (typeof (result.isCallbackError) != "undefined") {
                    this.enlistaerror = true;
                    this.listaerrores = result.messages;
                    this.cargoConfig = false;
                    this.cargando = false;
                    return;
                }
                NetsolinApp.objpartablabas.aplica = parseInt(result0.aplica);
                NetsolinApp.objpartablabas.tabla = result0.tabla;
                NetsolinApp.objpartablabas.campollave = result0.campollave;
                NetsolinApp.objpartablabas.clase_val = result0.clase_val;
                NetsolinApp.objpartablabas.clase_nbs = result0.clase_nbs;
                NetsolinApp.objpartablabas.camponombre = result0.camponombre;
                NetsolinApp.objpartablabas.titulo = result0.title;
                NetsolinApp.objpartablabas.subtitulo = "";
                NetsolinApp.objpartablabas.objeto = this.objeto;
                NetsolinApp.objpartablabas.rutamant = "mantbasica/" + this.objeto;
                NetsolinApp.objpartablabas.prefopermant = result0.prefomant;
                this.pcampollave = NetsolinApp.objpartablabas.campollave;
                this.pcamponombre = NetsolinApp.objpartablabas.camponombre;
                this.pclase_nbs = NetsolinApp.objpartablabas.clase_nbs;
                this.pclase_val = NetsolinApp.objpartablabas.clase_val;
                this.prefopermant = NetsolinApp.objpartablabas.prefopermant;
                // console.log("getNetsolinObjmantbasica luego de cargar objeto");

                if (result0.campos_lista.length > 2) {
                    // console.log("getNetsolinObjmantbasica luego de cargar objeto 1");
                    let var3 = JSON.parse(result0.campos_lista);
                    if (typeof (var3) == 'object') {
                        // console.log("getNetsolinObjmantbasica luego de cargar objeto 2");
                        NetsolinApp.objpartablabas.campos_lista = var3;
                        this.camposv = var3;
                    } else {
                        this.enerror = true;
                        this.message = "Error. Debe definir en el objeto los campos a visualizar."
                // console.log("getNetsolinObjmantbasica luego de cargar objeto 3 ojo no tiene campos a mostrar");
                    }
                } else {
                    this.enerror = true;
                    this.message = "Error. Debe definir en el objeto los campos a visualizar."
                // console.log("getNetsolinObjmantbasica luego de cargar objeto 4 ojo no tiene campos a mostrar");
                }
                let var1 = JSON.stringify(NetsolinApp.objpartablabas);
                localStorage.setItem("VPAR" + result0.tabla, var1);

                this.service.getNetsolinDictabla(this.ptablab, parseInt(this.paplica), this.objeto)
                    .subscribe(result => {
                        // console.log('getNetsolinDictabla result');
                        // console.log(result);
                        var result0 = result[0];
                        // console.log(result0);
                        if (typeof (result.isCallbackError) != "undefined") {
                            this.cargando = false;
                            this.resultados = true;
                            this.enlistaerror = true;
                            this.listaerrores = result.messages;
                            this.cargoConfig = false;
                            // console.log('Lista errores en loiadidcc');
                            // console.log(this.listaerrores);
                            return;
                        }
                        this.varparcaptura = "VPAR" + this.ptablab;
                        //crear objeto de parametros tabla
                        let var2 = JSON.stringify(result);
                        localStorage.setItem('DDT' + this.ptablab, var2);
                        this.service.getNetsolinSegObj(this.objeto)
                            .subscribe(result => {
                                // console.log('Seguridad result');
                                // console.log(result);
                                NetsolinApp.objseguridad.objeto = this.objeto;
                                NetsolinApp.objseguridad.per_consultar = result.per_consultar;
                                NetsolinApp.objseguridad.per_adicionar = result.per_adicionar;
                                NetsolinApp.objseguridad.per_modificar = result.per_modificar;
                                NetsolinApp.objseguridad.per_eliminar = result.per_eliminar;
                                this.segper_adicionar = result.per_adicionar;
                                this.segper_consultar = result.per_consultar;
                                this.segper_eliminar = result.per_eliminar;
                                this.segper_modificar = result.per_modificar;
                                // console.log('Seguridad');
                                //indicar tabla de trabajo actual
                                localStorage.setItem('NETMTABLA', this.ptablab);
                                // console.log('Seguridad 1');
                                if (this.filtro.length !== 0) {
                                    // console.log('Seguridad 2');
                                    this.searchTbasica(this.filtro);
                                    //   this.ejeBusqueda();
                                } else {
                                    this.enerror = false;
                                    // console.log('Seguridad 3 ojo error');
                                    this.cargando = false;
                                }
                                this.cargoConfig = true;

                            }, error => {
                                this.enerror = true;
                                this.cargoConfig = false;
                                console.log('error dic');
                                console.log(error);
                                localStorage.setItem('SOBJ' + this.ptablab, null);
                                this.showError(error);
                            });
                    }, error => {
                        console.log('error dic 1');
                        console.log(error);
                        this.enerror = true;
                        this.cargoConfig = false;
                        localStorage.setItem('DDT' + this.ptablab, null);
                        this.showError(error);
                    });
            }, error => {
                console.log('Error configurando objeto:' + this.objeto)
                console.log(error);
                this.cargoConfig = false;
                this.enerror = true;
                this.message = 'Error no se pudo cargar';
                this.cargando = false;
            });

    }
    retornaEstadocapturacotiza(datoestado):string {
        var cRetorna:string="";
        switch(datoestado) { 
            case 'D': { 
                cRetorna='Definitiva';
               break; 
            } 
            default: { 
                cRetorna='Borrador';
               break; 
            } 
         } 
        return cRetorna;
    }
    retornaEstado(datoestado,datest_cap):string {
        var cRetorna:string='<span class="label label-';
        switch(datoestado) { 
            case 'G': { 
                cRetorna+='success">Ganada';
               break; 
            } 
            case 'P': { 
                cRetorna+='danger">Perdida';
               break; 
            } 
            case 'C': { 
                cRetorna+='warning">Cancelada';
               break; 
            } 
            default: { 
                switch(datoestado) { 
                    case 'B': { 
                        cRetorna+='warning">Borrador';
                       break; 
                    } 
                            
                    default: { 
                        cRetorna+='info">En proceso';
                       break; 
                    }
                }
            } 
         } 
         cRetorna+='</span>';
        return cRetorna;
    }
}
