import { Component, OnInit,OnChanges,SimpleChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NetscombogService } from './netscombog.service';
import { NetsolinApp } from '../../shared/global';
import { HttpClient } from '@angular/common/http';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
    selector: 'netscombog2',
    styleUrls: ['./netscombog.component.css'],
    templateUrl: './netscombog.component.html',
    providers: [NetscombogService],
})
export class Netscombog implements OnInit,OnChanges {
    @ViewChild('ncombog') public ncombog: any;
    @Input() tablabase: string;
    @Input() orden: string;
    // @Input() nomcontrol: string;
    // @Input() formcontrolname: string;
    @Input() filtro: string;
    @Input() campollave: string;
    @Input() valini: string;
    @Input() esdisabled: boolean;
    @Output() pasarDatos = new EventEmitter();
    cargando = false;
    cargoConfig = false;
    resultados = false;
    adatossolcombog: any[] = [];
    optionSelected: any;
    regDatos: any;
    inicializado = false;

    constructor(private service: NetscombogService,
        private httpc: HttpClient) {
        this.view = service;

        // this.service.getItemsSg();
    }

    private view: Observable<any>;
    public events: string[] = [];
    //kendo ui
    ngOnChanges(changes: SimpleChanges){
        //  console.log("on changes ");
        //  console.log(this.tablabase);
        //  console.log(changes);
        //  console.log('this.valini:'+this.valini);
        //  console.log('this.cargando');
        //  console.log(this.cargando);
        //  console.log('this.resultados');
        //  console.log(this.resultados);
        //  console.log('this.inicializado');
        //  console.log(this.inicializado);
        if (typeof(changes.valini) !='undefined'){
         if ((changes.valini.previousValue != changes.valini.currentValue) && changes.valini.currentValue==this.valini
            && this.inicializado && changes.valini.previousValue != 'undefined') 
         {
            // console.log("on changes 2");
            // //cargar item
             this.loadItems(this.valini, "");
         }
        }
    }
    ngOnInit() {
        // console.log("ngoninit comobobox");
        // console.log("valorfiltro");
        // console.log(this.filtro);
        // console.log(this.valini);
        // console.log(this.esdisabled);
        this.inicializado = true;
        if (NetsolinApp.iniNetsolin) {
            //al iniciar si llega sin valor inicial enviar a cargas items dejando en blanco no carga nada
            if (this.valini == "") {
                this.loadItems("", "");
            } else {
                //si viene valor iniciarl cargar items con el filtro del valor que llega ej en edicion que quede en ese registro
                this.loadItems(this.valini, "");
            }

        } else {
            // se debe asegurar que se ha leido archivo con url o fallara el servicio
            this.httpc.get('assets/netsolin_ini.json').subscribe(data => {
                NetsolinApp.urlNetsolin = data['url_netsolins'];
                // this.loadItems();
            });
        }
    }

    metodorefresh(filtro){

    }
    //carga items se llama al iniciar en blanco o con valor inicial
    //Se llama cuando se ha cambiado el valor digitando y al final va * 
    loadItems(filtro, combog:any) {
        // console.log('load itmes combog:');
        // console.log(combog);
        // console.log("loaditmes 1 netscombog tabla:"+this.tablabase+" filtro:"+filtro+" filtroadi: "+this.filtro);
        // console.log(filtro);
        // console.log('netsolinbase urlNetsolin NetsolinApp: '+NetsolinApp.urlNetsolin);
        if (filtro == "") {
            this.cargando = false;
            this.cargoConfig = true;
            this.resultados = true;
            return;
        }
        // console.log("par tablabase");
        // console.log(this.tablabase);
        this.adatossolcombog = [];
        NetsolinApp.objenvrestsolcomobog.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestsolcomobog.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestsolcomobog.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;

        NetsolinApp.objenvrestsolcomobog.tabla = this.tablabase;
        NetsolinApp.objenvrestsolcomobog.orden = this.orden;
        NetsolinApp.objenvrestsolcomobog.aplica = 0;
        NetsolinApp.objenvrestsolcomobog.filtroadi=this.filtro;
        NetsolinApp.objenvrestsolcomobog.filtro = filtro;
        NetsolinApp.objenvrestsolcomobog.cursor = "Tcursorx";
        this.cargando = true;
        this.resultados = false;
        this.service.getItemsSg(NetsolinApp.objenvrestsolcomobog)
            .subscribe(result => {
                // console.log("loaditmes 2 netscombog tabla:"+this.tablabase+" filtro:"+filtro+" filtroadi: "+this.filtro);
                // console.log(result);
                this.view = result;
                for (var litemobj of result) {
                    // this.adatossolcombog.push({"id":litemobj.id,"text":litemobj.text+' | '+litemobj.nombre});                   
                    this.adatossolcombog.push({ "id": litemobj.id, "text": litemobj.nombre });
                    // comobg.selected()
                };
                // console.log("cargo reg 0");
                // console.log(this.adatossolcombog[0]);               
                // combog.toggle(true);
                // console.log('emit combog PASAR DATOS GETITEMSSG');
                // console.log(this.ncombog);
                // console.log('emit con cmbog llega combog html');
                // console.log(typeof(combog));
                // console.log(combog);
                // console.log(combog);

                this.pasarDatos.emit(this.adatossolcombog);
                if (typeof(combog)=='object'){
                    console.log('emit con cmbog llega combog focus 1');
            
                    // console.log(combog.data('kendoComboBox'));
                    combog.focus();
                    // this.ncombog.toggle(true);
                    // console.log('emit con cmbog llega combog focus 2');
                    // console.log('emit con cmbog llega combog toggle 1');
                    // combog.toggle(true);
                    // console.log('emit con cmbog llega combog toggle 2');
                    }
                // 
                // this.open();
                // console.log(combog);
                // console.log('emit con cmbog llega combog open true');
                // combog.popupOpen=true;

                // combog._open=true;
                // combog.value="169";
                // combog.toggle(true);
                // console.log('this.adatossolcombog');
                // console.log(this.adatossolcombog);
                // console.log(this);
                // combog.focus();
                this.cargando = false;
                this.cargoConfig = true;
                this.resultados = true;
            }, error => {
                // console.log("netscombog loaditems Error this.tablabase:"+this.tablabase+' filtro: '+this.filtro+' filtr '+filtro);
                // console.log(error);
                this.showError(error);
            });
    }

    //carga un registro con la llave id para retornar el registro seleccionado al que llama
    loadReg(llave) {
        // console.log("loadReg 1 combog tabla: "+this.tablabase+" llave:"+llave+" filtro:"+this.filtro);
        // console.log(llave);
        NetsolinApp.objenvrestsolcomobog.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestsolcomobog.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestsolcomobog.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
        NetsolinApp.objenvrestsolcomobog.tabla = this.tablabase;
        NetsolinApp.objenvrestsolcomobog.orden = this.orden;
        NetsolinApp.objenvrestsolcomobog.aplica = 0;
        NetsolinApp.objenvrestsolcomobog.filtroadi = this.filtro;
        NetsolinApp.objenvrestsolcomobog.filtro = this.filtro;
        NetsolinApp.objenvrestsolcomobog.campollave = this.campollave;
        NetsolinApp.objenvrestsolcomobog.campos = "*";
        NetsolinApp.objenvrestsolcomobog.llave = llave;
        NetsolinApp.objenvrestsolcomobog.cursor = "Tcursorx";
        // console.log(NetsolinApp.objenvrestsolcomobog);
        this.service.getRegSg(NetsolinApp.objenvrestsolcomobog)
            .subscribe(result => {
                // console.log("loadReg 2 combog tabla: "+this.tablabase+" llave:"+llave+" filtro:"+this.filtro);
                // console.log(result);
                // this.ncombog.toggle(true);
                console.log('emit 2 combog GETREGSG');
                // console.log(this.ncombog);
                this.pasarDatos.emit(result);
                // alert(`nombre: ${this.regDatos.nombre}`);
            }, error => {
                // console.log("error:"+error);
                this.showError(error);
            });
    }

    message = "";
    // message = new MensajeError;

    showError(msg) {
        this.message = msg;
    }
    //evento que se dispara al cambiar el valor yperder foco
    public valueChange(value): void {
        this.inicializado = true;
        // console.log("valueChange 1");
        this.log("valueChange", value);
        if (typeof (value) != 'undefined') {
            // console.log("valueChange 2 no unde");
            // this.loadReg(value.id);            
        } else {
            // console.log("valueChange 3 indef");
            this.adatossolcombog = [];
            console.log("a pasadostos.emit");
            // console.log(this.adatossolcombog);            
            this.pasarDatos.emit(this.adatossolcombog);
        }

    }
    //evento que se dispara cuando se selecciona un elemento llama a cargar registro para retornal al que llamo el valor seleccionado
    public selectionChange(value: any): void {
        // console.log("selection on change 1");
        this.log("selectionChange", value);
        // this.log("value.id", value.id);
        // console.log("selection on change 2");
        // console.log(value.id);
        if (typeof (value) != 'undefined') {
            // console.log("selection on change 3 a cargar registro");
            this.loadReg(value.id);
            // this.ncombog.toggle(true);
        } else {
        this.adatossolcombog = [];
            // console.log("selection on change 4 undefined");        
        }
        // alert(`id: ${id}, text: ${text}`);
    }
    //se dispara cuando se digita algo se controla si digitan * para cargar los registros con ese filtro
    public filterChange(filter: any, combo:any): void {
        this.inicializado = false;
        // console.log("filterChange combo:");
        // console.log(typeof(combo));
        // console.log(combo);
        // console.log(':'+filter+':');
        if (typeof (filter) == "undefined") {
            filter = "";
        }
        this.log("filterChange", filter);
        var lultmchar: string;
        lultmchar = filter.charAt(filter.length - 1);
        if (lultmchar == "*" && filter != "*") {
            this.loadItems(filter.slice(0, filter.length - 1), combo);
        } else if (filter == "*") {
            this.loadItems(filter, combo);
        } else {
            // this.combo.toggle(false);
        }
        setTimeout(() => {
                // console.log('LUEGO DE filter chage loaditmes');
                combo.focus();
            // combo.toggle(true);
            // console.log('LUEGO DE filter chage loaditmes2');
            // this.ncombog.toggle(true);
            // console.log('LUEGO DE filter chage loaditmes3');
            // if(this.ncombog.wrapper.nativeElement.contains(document.activeElement)) {
            //     combo.toggle(true);
            // }
        });
    }

    // public open(event,combo): void {
    //     console.log("en open event valini:"+this.valini);
    //     console.log(event);
    //     console.log(combo);
    //     this.loadReg(this.valini);
    //     this.log("open", "");
    // }

    public close(event,combo): void {
        // console.log("en close event");
        // console.log(event);
        // console.log(combo);
        this.log("close", "");
    }

    public focus(): void {
        // console.log("en focus event");
        // console.log('document.activeElement');
        // console.log(document.activeElement);
        if(this.ncombog.wrapper.contains(document.activeElement)) {
            // console.log('focus 3');
            this.ncombog.toggle(true);
        }
        this.log("focus", "");
    }

    public blur(event): void {
        // console.log("en blur event");
        this.log("blur", event);
        // console.log(event);
    }
    // public toggle(event): void {
    //     this.log("toggle", "");
    // }
    //para ir viendo eventos que se disparan 
    //desmarcar en html para depurar solo usar en depuracion
    private log(event: string, arg: any): void {
        // console.log("solcombog-logevent: "+event);
        // console.log("solcombog-log arg: "+arg);
        // this.events.push(`${event} ${arg || ""}`);
    }
    //
}
