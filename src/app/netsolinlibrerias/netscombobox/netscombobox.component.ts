import { Component,Input,OnInit,OnChanges,SimpleChanges,Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NetscomboboxService } from './netscombobox.service';
import { NetsolinApp } from '../../shared/global';
import { HttpClient } from '@angular/common/http';

@Component({
    providers: [NetscomboboxService],
    selector: 'netscombog',
    styleUrls: ['./netscombobox.component.css'],
    templateUrl: './netscombobox.component.html',
})

export class NetscomboboxComponent  implements OnInit,OnChanges{
    @ViewChild('combog') combog: ElementRef;

    // @Input() campvalor: any;
    @Input() tablabase: string;
    @Input() orden: string;
    @Input() filtro: string;
    @Input() campollave: string;
    @Input() valini: string;
    @Input() esdisabled: boolean;
    @Output() pasarDatos = new EventEmitter();


    public view: Observable<any>;
    public campvalor: any;
    inicializado = false;


    constructor(private service: NetscomboboxService,
        private httpc: HttpClient) {
        this.view = service;
     }
     ngOnChanges(changes: SimpleChanges){
         let lchan:any;

        //  console.log("on changes ");
         lchan=changes;
        //  console.log("on changes lchan");
        //  console.log(typeof(lchan.valini));
        //  console.log("on changes lchan 2");
        //  console.log(this.tablabase);
        //  console.log(changes);
        //  console.log('this.inicializado');
        //  console.log(this.inicializado);
        //  console.log('this.combog');
        //  console.log(this.combog);
        NetsolinApp.objenvrestsolcomobog.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestsolcomobog.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestsolcomobog.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
    
         NetsolinApp.objenvrestsolcomobog.tabla = this.tablabase;
         NetsolinApp.objenvrestsolcomobog.orden = this.orden;
         NetsolinApp.objenvrestsolcomobog.aplica = 0;
         NetsolinApp.objenvrestsolcomobog.filtro = this.valini;
         NetsolinApp.objenvrestsolcomobog.filtroadi = "";
         NetsolinApp.objenvrestsolcomobog.llave = this.valini;
         NetsolinApp.objenvrestsolcomobog.cursor = "Tcursorx";
         
        //  if (changes.valini.previousValue != 'undefined' && (changes.valini.previousValue != changes.valini.currentValue) && changes.valini.currentValue==this.valini
        //     && this.inicializado && this.valini) 
         if (this.inicializado && this.valini) 
         {
            // console.log("on changes 2");
            // console.log(this.valini);
            // //cargar item
            this.service.query(NetsolinApp.objenvrestsolcomobog,this.valini,this.combog);
         }

    }

     ngOnInit() {
        this.inicializado = true;
        // console.log("ngoninit comobobox");
        // console.log("valor ini");
        // console.log(this.tablabase);
        // console.log(this.campollave);
        // console.log(this.valini);
        // console.log("valor filtro");
        // console.log(this.filtro);
        this.campvalor = this.valini;
        // console.log(this.esdisabled);
        NetsolinApp.objenvrestsolcomobog.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestsolcomobog.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestsolcomobog.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
        NetsolinApp.objenvrestsolcomobog.tabla = this.tablabase;
        NetsolinApp.objenvrestsolcomobog.orden = this.orden;
        NetsolinApp.objenvrestsolcomobog.aplica = 0;
        // NetsolinApp.objenvrestsolcomobog.filtro=this.filtro;
        NetsolinApp.objenvrestsolcomobog.filtro = this.filtro;
        NetsolinApp.objenvrestsolcomobog.cursor = "Tcursorx";
//         console.log('En ngoninit NetsolinApp.objenvrestsolcomobog:')
//         console.log(NetsolinApp.objenvrestsolcomobog);
// console.log("ini catego combo 1");
        if (NetsolinApp.iniNetsolin) {
            // console.log("ini catego combo 2");
            //al iniciar si llega sin valor inicial enviar a cargas items dejando en blanco no carga nada
            if (this.valini == "") {
                // this.loadItems("", "");
            } else {
                //si viene valor iniciarl cargar items con el filtro del valor que llega ej en edicion que quede en ese registro
                // this.loadItems(this.valini, "");
                // console.log("ini catego combo 3 valini");
                // console.log(this.valini);

                this.service.query(NetsolinApp.objenvrestsolcomobog,this.valini,this.combog);
                // console.log("en init luego de traer campvalor");
                // this.pasarDatos.emit(this.campvalor);

                
            }
        } else {
            // se debe asegurar que se ha leido archivo con url o fallara el servicio
            this.httpc.get('assets/netsolin_ini.json').subscribe(data => {
                NetsolinApp.urlNetsolin = data['url_netsolins'];
                // this.loadItems();
            });
        }

    }

    public handleFilter(filter,combobox) {
        this.inicializado = false;
        // this.service.query(filter);
        // console.log("enhandklefilter");
        // console.log(NetsolinApp.objenvrestsolcomobog);
        // console.log(combobox);

        var lultmchar: string;
        lultmchar = filter.charAt(filter.length - 1);
        // console.log('En handleFilter NetsolinApp.objenvrestsolcomobog:')
        NetsolinApp.objenvrestsolcomobog.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestsolcomobog.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestsolcomobog.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
        NetsolinApp.objenvrestsolcomobog.tabla = this.tablabase;
        NetsolinApp.objenvrestsolcomobog.orden = this.orden;
        NetsolinApp.objenvrestsolcomobog.aplica = 0;
        NetsolinApp.objenvrestsolcomobog.filtro = filter;
        NetsolinApp.objenvrestsolcomobog.filtroadi = this.filtro;
        NetsolinApp.objenvrestsolcomobog.cursor = "Tcursorx";

        // console.log(NetsolinApp.objenvrestsolcomobog);
        
        if (lultmchar == "*" && filter != "*") {
            this.service.query(NetsolinApp.objenvrestsolcomobog,filter.slice(0, filter.length - 1),combobox);
        } else if (filter == "*") {
            this.service.query(NetsolinApp.objenvrestsolcomobog,filter,combobox);
        } else {
            // this.combo.toggle(false);
        }

    }
    public valueChange(value,combobox): void {
        this.inicializado = true;
        // console.log("valueChange campvalor:");
        // console.log(this.campvalor)
        // console.log("valueChange value:");
        // console.log(value);
        // console.log("valueChange a pasar datos data:");
        // console.log(value);
        // console.log(combobox);
        this.campvalor = value;
        this.pasarDatos.emit(value);
        // this.pasarDatos.emit(this.adatossolcombog);
    }
    public selectionChange(value: any,combobox): void {
    //    console.log('selectionChange value:'+ value);
    //    console.log(combobox);
    }


    public open(combobox): void {
    //    console.log('open');
    //    console.log(combobox);
    }

    public close(combobox): void {
    //    console.log('close');
    //    console.log(combobox);
    }

    public focus(combobox): void {
    //    console.log('focus');
    //    console.log(combobox);
    }

    public blur(combobox): void {
    //    console.log('blur');
    //    console.log(combobox);
    }

   
}
