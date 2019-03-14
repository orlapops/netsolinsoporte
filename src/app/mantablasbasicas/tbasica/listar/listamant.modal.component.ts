import { error } from 'util';
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { MantbasicaService } from '../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../services/mantbasica.libreria';
import { NetsolinApp } from '../../../shared/global';
import { UpperCaseTextDirective } from '../../../netsolinlibrerias/directive/upper-case.directive';
import { NetsolinService } from '../../../services/netsolin.service';


import { process, State } from '@progress/kendo-data-query';
import {
    GridComponent,
    GridDataResult,
    PageChangeEvent,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

import { varGlobales } from '../../../shared/varGlobales';

@Component({
    selector: 'app-listbasmodal',
    templateUrl: './listamant.modal.component.html',
    styleUrls: ['./listamant.modal.component.css']
})
export class ListbasicamodalComponent implements OnInit {
    @Input() ptablab: string;
    @Input() paplica: string;
    //   @Input() pcampollave: string;
    //   @Input() pcamponombre: string;
    //   @Input() pclase_nbs: string;
    //   @Input() pclase_val: string;
    @Input() porden: string;
    @Input() title: string;
    //   @Input() subtitle: string;
    @Input() objeto: string;
    @Input() rutamant: string;
    @Input() filtro: string;
    //campo por defecto si tiene el formulario a asignar
    @Input() pcampoxdefecto: string;
    //valor a asignar al campo por defecto si tiene el formulario a asignar
    @Input() pvalxdefecto: any;
    
    //   @Input() camposv: any[];
    @Input() prefopermant: string;
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
    // Do not initially show the Dialog
    public opened: boolean = false;
    segper_consultar = false;
    segper_adicionar = false;
    segper_modificar = false;
    segper_eliminar = false;
    public confirmado;
    public crearregistro = false;
    public consultarregistro = false;
    public editarregistro = false;
    public state: State = {
        skip: 0,
        take: 20
    };
    // public pageSize = 10;
    // public skip = 0;
    // public gridView: GridDataResult;
    public gridData: GridDataResult;

    // private data: Object[];
    // private items: any[];
    public multiple = false;
    public allowUnsort = true;
    public sort: SortDescriptor[] = [{
        field: 'cod_tercer',
        dir: 'asc'
    }];
    //nombre variable con parametros de tabla para pasar a adicion,mod,ver
    varparcaptura = "VPAR" + this.ptablab;

    constructor(private location: Location,
        public vglobal: varGlobales,
        public libmantab: MantablasLibreria,        
        private mantbasicaService: MantbasicaService,
        private service: NetsolinService,
        private httpc: HttpClient, private router: Router) {
        this.confirmado = null;
        // console.log("constructor listar.comp");
        // this.loadItems();

    }

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.aregstabla, this.state);
    }

    ngOnInit() {
        // console.log("ngOnInit listar.comp modal");
        // console.log("this.pcampoxdefecto:"+this.pcampoxdefecto);
        // console.log("this.pvalxdefecto:"+this.pvalxdefecto);
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

    public editClick({ dataItem, rowIndex, columnIndex }: any): void {
        var vpref = ((this.prefopermant == '') ? 'basica' : this.prefopermant);
        var pruta = '/editregt' + vpref + '/' + this.varparcaptura;
        // console.log("pruta:" + pruta);
        // console.log("pvalc:" + pvalc);
        var pvalc = this.retornaValcampo(dataItem, 'C');
        // console.log("pvalc:" + pvalc);
        this.router.navigate([pruta, pvalc]);

    }

    public verRegK(dataItem): void {

        var vpref = ((this.prefopermant == '') ? 'basica' : this.prefopermant);
        var pruta = '/verregt' + vpref + '/' + this.varparcaptura;
        // console.log("pruta:" + pruta);
        // console.log("pvalc:"+pvalc);
        // var pvalc= this.retornaValcampo(this.gridData.data[rowIndex],'C');
        var pvalc = this.retornaValcampo(dataItem, 'C');
        // console.log("pvalc:" + pvalc);
        this.router.navigate([pruta, pvalc]);
    }



    public onCancel(e, ditem): void {
        // console.log("en onCancel");
        // console.log(e);
        // console.log(ditem);

        // e.preventDefault();
        // this.closeForm();
    }
    ngOnChanges() {
        // console.log("ngOnChanges listar.comp");    
        // console.log(this.ptablab);
        // console.log(this.title);
        let ltabltrab = localStorage.getItem("NETMTABLA");
        //si es diferente de la que llega disparar carga diccionarios
        // console.log("tabla en localstorage: "+ltabltrab);
        // console.log("tabla que viene:"+this.ptablab);
        if (ltabltrab != this.ptablab) {
            // console.log('debe cargar nueva tabla');
            this.resultados = false;
            this.cargando = true;
            this.campoBusqueda = new FormControl();
            //traer ultima busqueda
            // console.log("ruta: "+this.rutamant);
            var lvbus: any;
            lvbus = localStorage.getItem('B' + this.rutamant);
            if (typeof (lvbus) == 'string') {
                this.busqueda = lvbus;
            } else {
                this.busqueda = '';
            }
            this.loaddiccionarios();
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
        console.log("searchTbasica");
        console.log(filtro);
        this.enerror = false;
        this.busqueda = filtro;
        // console.log("searchTbasica:"+this.busqueda);
        this.cargando = true;
        // if (this.busqueda.length !== 0 && !this.enlistaerror) {
        if (this.busqueda.length !== 0) {
            this.ejeBusqueda();
        } else {
            this.aregstabla = [];
            // this.items = [];
            // this.loadItems();

            this.cargando = false;
            this.resultados = false;
        }
    }

    ejeBusqueda() {
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


    borrarConfrma(rindex) {
        this.confirmado = rindex;
    }

    cancelarConfirma(rindex) {
        //  console.log("en cancelarConfirma");
        // console.log(rindex);
        this.confirmado = null;

    }



    // onDeleteTabla(regtabla, id) {
    onDeleteTabla(dataItem) {
        this.confirmado = null;
        // console.log("en onDeleteTabla");
        // console.log(dataItem);
        // console.log(this.aregstabla);    
        // console.log(this.aregstabla[rowIndex]);    
        var id = this.retornaValcampo(dataItem, 'C');
        // console.log("pvalc:" + id);
        this.mantbasicaService.deleteTabla(dataItem, id, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val)
            .subscribe(newpro => {
                var result0 = newpro[0];
                // console.log('ondeletetable');
                // console.log(newpro);
                // console.log(result0);
                if (typeof (newpro.isCallbackError) != "undefined") {
                    this.eliminoreg = false;
                    this.enlistaerror = true;
                    this.listaerrores = newpro.messages;
                } else {
                    this.eliminoreg = true;
                    this.enlistaerror = false;
                    this.opened = true;
                    this.showMensaje('Se elimino el registro.');
                    this.ejeBusqueda();
                    // this.router.navigate(['/' + this.rutamant]);
                }

            }, error => {
                this.showError(error);
            })
    }

    retornaValcampo(pregistro, ptipo) {
        // console.log("retornavalcampo");
        // console.log(pregistro);

        if (ptipo == 'C') {
            var acllave = this.pcampollave.split(',');
            // console.log(acllave);
            //solo tener encuenta 2 para armar condicion 
            var lenallave = acllave.length;
            let lcadeval = '';
            if (acllave.length > 1) {
                var condi = '';
                lcadeval = "pregistro." + acllave[0] + "+'|'+pregistro." + acllave[1];
            } else {
                lcadeval = "pregistro." + this.pcampollave;
            }
            // console.log("retornavalcampo");
            // console.log(lcadeval);
            let valretorna = eval(lcadeval);
            return valretorna;

        } else {
            let lcadeval = "pregistro." + this.pcamponombre;
            let valretorna = eval(lcadeval)
            return valretorna;
        }

    }


    retornaRuta(ptipo: string) {
        // console.log('Retorna ruta '+ptipo+' '+this.prefopermant);
        var vpref = ((this.prefopermant == '') ? 'basica' : this.prefopermant);
        // console.log('vpref: '+vpref);    
        if (ptipo == 'A') {
            return '/addregt' + vpref;
        } else if (ptipo == 'V') {
            return '/verregt' + vpref + '/' + this.varparcaptura;
        } else {
            return '/editregt' + vpref + '/' + this.varparcaptura;
        }
    }
    /*
    retornaRuta(){
        return '/verregtbasica';
    }
    */

    verRef(event) {
        // console.log(event);
    }

    onSelect(ciudad) {
        this.router.navigate(['/editciudad', ciudad.cod_ciudad]);
    }

    message = "";
    // message = new MensajeError;

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
        // console.log("loaddicionarios");
        // console.log("this.ptablab;"+this.ptablab);
        // console.log("this.paplica;"+this.paplica);
        // console.log("this.objeto;"+this.objeto);
        this.service.getNetsolinObjmantbasica(this.objeto)
            .subscribe(result => {
                // console.log("getNetsolinObjmantbasica 1");
                // console.log(result);
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
                        // NetsolinApp.objpartablabas.aplica = parseInt(this.paplica);
                        // NetsolinApp.objpartablabas.tabla = this.ptablab;
                        // NetsolinApp.objpartablabas.campollave = this.pcampollave;
                        // NetsolinApp.objpartablabas.clase_val = this.pclase_val;
                        // NetsolinApp.objpartablabas.clase_nbs = this.pclase_nbs;
                        // NetsolinApp.objpartablabas.campos_lista  = this.camposv;
                        // NetsolinApp.objpartablabas.camponombre = this.pcamponombre;
                        // NetsolinApp.objpartablabas.titulo = this.title;
                        // NetsolinApp.objpartablabas.subtitulo = this.subtitle;
                        // NetsolinApp.objpartablabas.objeto = this.objeto;
                        // NetsolinApp.objpartablabas.rutamant = this.rutamant;
                        // NetsolinApp.objpartablabas.prefopermant = this.prefopermant;
                        // let var1 = JSON.stringify(NetsolinApp.objpartablabas);
                        // localStorage.setItem(this.varparcaptura, var1);
                        // console.log('llega de getNetsolinDictabla');
                        // console.log(result);
                        // console.log("this.prefopermant");
                        // console.log(this.prefopermant);
                        // console.log("NetsolinApp.objpartablabas.prefopermant");
                        // console.log(NetsolinApp.objpartablabas.prefopermant);
                        let var2 = JSON.stringify(result);
                        // console.log('var2');
                        // console.log(var2);
                        // localStorage.setItem('DDT' + this.ptablab, result);
                        localStorage.setItem('DDT' + this.ptablab, var2);
                        //traer ultima busqueda
                        // console.log("ruta: "+this.rutamant);
                        // var lvbus: any;
                        // lvbus = localStorage.getItem('B' + this.rutamant);
                        // if (typeof (lvbus) == 'string') {
                        //     this.busqueda = lvbus;
                        // } else {
                        //     this.busqueda = '';
                        // }
                        this.busqueda = this.filtro;
                        // console.log("busqueda: "+this.busqueda);
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
                                // console.log(NetsolinApp.objseguridad);
                                // console.log(this.segper_consultar);
                                //indicar tabla de trabajo actual
                                localStorage.setItem('NETMTABLA', this.ptablab);
                                // console.log('Seguridad 1');
                                if (this.busqueda.length !== 0) {
                                    // console.log('Seguridad 2');
                                    this.searchTbasica(this.filtro);
                                    //   this.ejeBusqueda();
                                } else {
                                    this.enerror = true;
                                    this.message = "Error cadena de busqueda o filtro no puede ser vacio.";
                                    console.log('Seguridad 3 ojo error');
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
    //maneja el control para llamado adicion de tablas
    openadicion() {
        this.libmantab.copiaVarcrumbs(this.vglobal);
        this.crearregistro = true;
    }
    //maneja el control para cerrar

    public closeadicion() {
        this.libmantab.restauraVarcrumbs(this.vglobal);
        this.crearregistro = false;
    }

    openconsulta(dataItem) {
        this.libmantab.copiaVarcrumbs(this.vglobal);
        this.varidreg = this.retornaValcampo(dataItem, 'C');
        this.consultarregistro = true;
    }
    //maneja el control para cerrar

    public closeconsulta() {
        this.libmantab.restauraVarcrumbs(this.vglobal);
        this.consultarregistro = false;
    }

    openeditar(dataItem) {
        this.libmantab.copiaVarcrumbs(this.vglobal);
        this.varidreg = this.retornaValcampo(dataItem, 'C');
        this.editarregistro = true;
    }
    //maneja el control para cerrar

    public closeeditar() {
        this.libmantab.restauraVarcrumbs(this.vglobal);
        this.editarregistro = false;
    }

    public close() {
        this.libmantab.restauraVarcrumbs(this.vglobal);
        this.eliminoreg = false;
    }

    public open() {
        this.libmantab.copiaVarcrumbs(this.vglobal);
        this.eliminoreg = true;
    }
    public refrescar(event) {
        this.searchTbasica(this.filtro);
    }
   
        
}
