// import { EventEmitter } from 'NodeJS';
import { Text } from '@angular/compiler/src/i18n/i18n_ast';
import { error } from 'util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NetsolinService } from '../../services/netsolin.service';
import { NetsolinApp } from '../../shared/global';



@Component({
    selector: 'mant-tablabasica',
    template: `
        <kendo-dialog title="{{ptitulo}}" 
            (close)="close()"
            [minWidth]="350" [width]="650">
        <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="alert alert-danger" *ngIf="enerror">
            {{message}}
          </div>
          <div *ngIf="cargando" class="text-center" style="padding-top: 60px;">
          <!-- <img src="../../../../assets/spinner.gif"> -->
          <img src="assets/spinner.gif">
        </div>                
          <div class="alert alert-danger" *ngIf="enlistaerror">
            <ul>
              <li *ngFor="let regerror of listaerrores">
                {{regerror.menerror}}
              </li>
            </ul>
          </div>        
            <mtbas-addtbasica *ngIf="cargoConfig && ptipomant=='A'"
            pcampoxdefecto="{{pcampoxdefecto}}"
            pvalxdefecto="{{pvalxdefecto}}"
            vparcaptura="{{pvaparam}}"></mtbas-addtbasica>
            <mtbas-edittbasica *ngIf="cargoConfig && ptipomant=='E'" 
                vparcaptura="{{pvaparam}}" 
                vid="{{pid}}" >
             </mtbas-edittbasica>
             <mtbas-vertbasica *ngIf="cargoConfig && ptipomant=='C'"  
                 vparcaptura="{{pvaparam}}" 
                 vid="{{pid}}" >
            </mtbas-vertbasica>
        </div>
        </div>
            </kendo-dialog>
  `
})
export class Netsadmintablabasicamodal implements OnInit {
    @Input() ptitulo: string;
    @Input() pvaparam: string;
    @Input() pobjeto: string;
    @Input() ptipomant: string;
    @Input() pid: any;
    //campo por defecto si tiene el formulario a asignar
    @Input() pcampoxdefecto: string;
    //valor a asignar al campo por defecto si tiene el formulario a asignar
    @Input() pvalxdefecto: any;
    
    @Output() evenclose = new EventEmitter();
    enerror = false;
    message = "";
    cargoConfig = false;
    cargando = true;
    varparcaptura = "VPAR";
    enlistaerror = false;
    listaerrores: any[] = [];

    constructor(
        private service: NetsolinService
    ) {
    }

    ngOnInit() {
        console.log('ngoninit netsadi modial');
        console.log("this.pcampoxdefecto:"+this.pcampoxdefecto);
        console.log("this.pvalxdefecto:"+this.pvalxdefecto);

        // console.log('titulo: '+this.ptitulo);
        // console.log('pvaparam: '+this.pvaparam);
        // console.log('pobjeto: '+this.pobjeto);
        this.cargando = true;
        this.inicializacpaturatabla(this.pobjeto);
    }

    close() {
        this.evenclose.emit(event);
    }
    // carga diccionarios para cuando se llama mantenimiento desde otro que no venga por listado
    inicializacpaturatabla(objeto) {
        this.cargando = true;
        // console.log("inicializacpaturatabla");
        this.service.getNetsolinObjmantbasica(objeto)
            .subscribe(result => {
                console.log("inicializacpaturatabla 1");
                console.log(result);
                var result0 = result[0];
                console.log(result0);
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
                NetsolinApp.objpartablabas.campos_lista = result0.campos_lista;
                NetsolinApp.objpartablabas.camponombre = result0.camponombre;
                NetsolinApp.objpartablabas.titulo = result0.title;
                NetsolinApp.objpartablabas.subtitulo = "";
                NetsolinApp.objpartablabas.objeto = objeto;
                NetsolinApp.objpartablabas.rutamant = "mantbasica/" + objeto;
                NetsolinApp.objpartablabas.prefopermant = result0.prefomant;
                let var1 = JSON.stringify(NetsolinApp.objpartablabas);
                localStorage.setItem("VPAR" + result0.tabla, var1);
                // console.log("inicializacpaturatabla 2");
                this.service.getNetsolinDictabla(result0.tabla, parseInt(result0.aplica), objeto)
                    .subscribe(result => {
                        var result0 = result[0];
                        // console.log("inicializacpaturatabla 3");
                        if (typeof (result.isCallbackError) != "undefined") {
                            this.enlistaerror = true;
                            this.listaerrores = result.messages;
                            this.cargoConfig = false;
                            this.cargando = false;
                            return;
                        }
                        let var2 = JSON.stringify(result);
                        // localStorage.setItem('DDT' + result0.tabla, var2);
                        localStorage.setItem('DDT' + NetsolinApp.objpartablabas.tabla, var2);
                        // console.log("inicializacpaturatabla 4");
                        this.service.getNetsolinSegObj(objeto)
                            .subscribe(result => {
                                let vars = JSON.stringify(result);
                                localStorage.setItem('SOBJ' + objeto, vars);
                                if (!result.per_adicionar) {
                                    this.cargoConfig = false;
                                    this.enerror = true;
                                    this.message = 'Error. No tiene permisos para adcionar. Consulte con su administrador';
                                    this.cargando = false;
                                    return;
                                }
                                // console.log("inicializacpaturatabla 5");
                                this.cargoConfig = true;
                                this.cargando = false;
                            }, error => {
                                this.cargoConfig = false;
                                this.enerror = true;
                                this.message = 'Error no se pudo cargar';
                                localStorage.setItem('SOBJ' + objeto, null);
                                this.cargando = false;
                            });
                    }, error => {
                        this.cargoConfig = false;
                        localStorage.setItem('DDT' + result0.tabla, null);
                        this.enerror = true;
                        this.message = 'Error no se pudo cargar';
                        this.cargando = false;
                    });
            }, error => {
                // console.log('Error configurando objeto:' + this.objeto)
                // console.log(error);
                this.cargoConfig = false;
                this.enerror = true;
                this.message = 'Error no se pudo cargar';
                this.cargando = false;
            });
        // this.cargando= false;
    }
}

