import { error } from 'util';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MantbasicaService } from '../../services/mantbasica.service';
import { NetsolinService } from '../../services/netsolin.service';
import { NetsolinApp } from '../../shared/global';



@Component({
    selector: 'app-mantsoporte',
    template: `
        <div class="alert alert-danger" *ngIf="enlistaerror">
            <ul>
                <li *ngFor="let regerror of listaerrores">
                {{regerror.menerror}}
                </li>
            </ul>
        </div>       
      <div *ngIf="cargoConfig">
        <app-listbasica 
            ptablab="{{ptablab}}" 
            paplica="{{paplica}}" 
            pcampollave="{{pcampollave}}" 
            pcamponombre="{{pcamponombre}}" 
            pclase_val="{{clase_val}}" 
            pclase_nbs="{{clase_nbs}}" 
            porden="{{porden}}" 
            title="{{title}}" 
            subtitle="{{subtitle}}" 
            objeto="{{objeto}}"
            rutamant="{{rutamant}}"
            prefopermant="{{prefopermant}}">
            </app-listbasica>
    </div>
  `
})
export class MantBasicaComponent implements OnInit {
    ptablab: string;
    paplica: string;
    pcampollave: string;
    pcamponombre: string;
    porden: string;
    title: string;
    subtitle = 'Listado';
    tablaForm: FormGroup;
    tablaFormOrig: FormGroup;
    regTabla: any;
    camposform: any;
    varParam: string;
    rutamant: string;
    prefopermant: string;
    objeto: string;
    clase_val: string;
    clase_nbs: string;
    cargoConfig = false;
    enlistaerror = false;
    listaerrores: any[] = [];
    constructor(private mantbasicaService: MantbasicaService,
        private service: NetsolinService,
        private activatedRouter: ActivatedRoute,
        private httpc: HttpClient, private router: Router) {
        // console.log("constructor mantbasica.comp");
    }
    ngOnInit() {
        // console.log("ngOnInit mantbasica.comp");
        // console.log(this.activatedRouter);
        // console.log(this.activatedRouter.params);
        this.activatedRouter.params
            .subscribe(parametros => {
                this.objeto = parametros['objeto'];
                // console.log(this.objeto);
                // se debe asegurar que se ha leido archivo con url o fallara el servicio
                this.httpc.get('assets/netsolin_ini.json').subscribe(data => {
                    NetsolinApp.urlNetsolin = data['url_netsolins'];
                    this.service.getNetsolinObjmantbasica(this.objeto)
                        .subscribe(result => {
                            console.log('OBJMANTBASICA result');
                            console.log(result);
                            var result0 = result[0];
                            // console.log(result0);
                            if (typeof (result.isCallbackError) != "undefined") {
                                this.enlistaerror = true;
                                this.listaerrores = result.messages;
                                this.cargoConfig = false;
                                // console.log('Lista errores en loiadidcc');
                                // console.log(this.listaerrores);
                                return;
                            }
                            this.paplica = result0.aplica;
                            this.ptablab = result0.tabla;
                            this.pcampollave = result0.campollave;
                            this.pcamponombre = result0.camponombre;
                            this.porden = result0.orden;
                            this.title = result0.title;
                            this.clase_nbs = result0.clase_nbs;
                            this.clase_val = result0.clase_val;
                            this.rutamant = "mantbasica/" + this.objeto;
                            this.prefopermant = result0.prefomant;
                            // this.campos_lista = result0.campos_lista;
                            // console.log('prefopermant');
                            // console.log(this.prefopermant);
                            // console.log(NetsolinApp.objseguridad);
                            // console.log(this.segper_consultar);
                            this.cargoConfig = true;
                        }, error => {
                            // console.log('Error configurando objeto:' + this.objeto)
                            // console.log(error);
                            this.cargoConfig = false;
                        });
                });
            });
    }
}
