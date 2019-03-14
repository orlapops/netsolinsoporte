// import { EventEmitter } from 'NodeJS';
import { Text } from '@angular/compiler/src/i18n/i18n_ast';
import { error } from 'util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NetsolinService } from '../../../../services/netsolin.service';
import { NetsolinApp } from '../../../../shared/global';

@Component({
    selector: 'soporte-busqueda',
    templateUrl: './soportebusquedamodal.component.html',

})
export class Netssoportebusqueda implements OnInit {    
    @Input() ptitulo: string;
    @Output() evenclose = new EventEmitter();
    enerror = false;
    message = "";
    cargoConfig = false;
    cargando = true;
    varparcaptura = "VPAR";
    enlistaerror = false;
    listaerrores: any[] = [];
    filtrovendedor: string;
    mostrarlistavendedor = false;
    filtrocliepoten: string;
    mostrarlistacliepoten = false;
    filtrocontacto: string;
    mostrarlistacontactos = false;
    busqueda = "";

    constructor(
        private service: NetsolinService
    ) {
    }

    ngOnInit() {
        // console.log('ngoninit netsadi modial');
        // console.log('titulo: '+this.ptitulo);
        // console.log('pvaparam: '+this.pvaparam);
        // console.log('pobjeto: '+this.pobjeto);
        this.cargando = false;
    }

    close() {
        // console.log('close vent cliente potencial');
        this.evenclose.emit(event);
    }

    lanzarbusvendedor(event) {
        console.log("lanzarbusvendedor 1");
        // console.log(event);
        var cbus = event.cbuscar.trim();
        var cid = parseInt(cbus);
        console.log("lanzarbusvendedor 2");
        //no puede ir en blanco
        if (cbus=='')
        {
            cbus='*';
        }
        if (cbus == '*') {
            console.log("lanzarbusvendedor 3");
            this.filtrovendedor = cbus;
        } else {
            console.log("lanzarbusvendedor 4");
            if (cid > 0) {
                console.log("lanzarbusvendedor 5");
                this.filtrovendedor = "cod_vended='" + cbus + "' or t.nombre like '%" + cbus + "%' or t.cod_tercer like '%" + cbus + "%'";
            } else {
                console.log("lanzarbusvendedor 6");
                this.filtrovendedor = "t.nombre like '%" + cbus + "%' or cod_vended like '%" + cbus + "%' ";
            }
        }
        console.log("lanzarbusvendedor 7");
        this.filtrocliepoten ="";
        this.filtrocontacto = "";
        this.mostrarlistavendedor = true;
        this.mostrarlistacliepoten = false;
    }

    lanzarbuscliepoten(event) {
        // console.log("lanzarbuscliepoten");
        // console.log(event);
        var cbus = event.cbuscar.trim();
        var cid = parseInt(cbus);
        //no puede ir en blanco
        if (cbus=='')
        {
            cbus='*';
        }

        if (cbus == '*') {
            this.filtrocliepoten = cbus;
        } else {
            if (cid > 0) {
                this.filtrocliepoten = "p.id_cliepote=" + cid.toString() + " or nom_contac like '%" + cbus + "%' or ape_contac like '%" + cbus + "%' or nom_empre like '%" + cbus + "%'  or cod_cliepote like '%" + cbus + "%'";
            } else {
                this.filtrocliepoten = "nom_contac like '%" + cbus + "%' or ape_contac like '%" + cbus + "%' or nom_empre like '%" + cbus + "%'  or cod_cliepote like '%" + cbus + "%'";
            }
        }
        this.filtrocontacto = "";
        this.filtrovendedor = "";
        this.mostrarlistavendedor = false;
        this.mostrarlistacliepoten = true;
        this.mostrarlistacontactos = false;

    }
    lanzarbuscontacto(event) {
        // console.log("lanzarbuscontacto");
        // console.log(event);
        var cbus = event.cbuscar.trim();
        //no puede ir en blanco
        if (cbus=='')
        {
            cbus='*';
        }

        if (cbus == '*') {
            this.filtrocontacto = cbus;
        } else {
            var cid = parseInt(cbus);
            if (cid > 0) {
                this.filtrocontacto = "id_contacto=" + cbus + " or nombres like '%" + cbus + "%' or apellidos like '%" + cbus + "%' or cod_contac like '%" + cbus + "%'";
            } else {
                this.filtrocontacto = "nombres like '%" + cbus + "%' or apellidos like '%" + cbus + "%' or cod_contac like '%" + cbus + "%'";
            }
        }
        this.filtrocliepoten = "";
        this.filtrovendedor = "";
        this.mostrarlistavendedor = false;
        this.mostrarlistacontactos = true;
        this.mostrarlistacliepoten = false;
    }

}

