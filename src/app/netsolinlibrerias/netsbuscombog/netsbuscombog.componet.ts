// import { EventEmitter } from 'NodeJS';
import { Text } from '@angular/compiler/src/i18n/i18n_ast';
import { error } from 'util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NetsolinApp } from '../../shared/global';
import { NetsolinService } from '../../services/netsolin.service';

@Component({
    selector: 'nets-buscombog',
    templateUrl: './netsbuscombog.component.html',
    styleUrls: ['./netsbuscombog.component.css']

})
export class Netsbuscombog implements OnInit {
    @Input() ptitulo: string;
    @Input() placeholder: string;
    @Input() vinibus: string;
    @Input() objeto: string;
    @Input() pcamporetorna: string;    
    @Output() evenclose = new EventEmitter();
    enerror = false;
    message = "";
    cargoConfig = false;
    cargando = true;
    varparcaptura = "VPAR";
    enlistaerror = false;
    listaerrores: any[] = [];
    // tbuscuenta: string;
    // mostrarlistacuentas = false;
    filtroabuscar: string;
    mostrarlistaresbusqueda = false;
    busqueda = "";

    constructor(
        private service: NetsolinService
    ) {
    }

    ngOnInit() {
        // console.log('ngoninit netsadi modial');
        // console.log('titulo: '+this.ptitulo);
        // console.log('placeholder: '+this.placeholder);
        // console.log('vinibus: '+this.vinibus);
        this.cargando = false;
        this.filtroabuscar=this.vinibus;
        this.busqueda=this.vinibus;
        if (this.filtroabuscar)
            this.mostrarlistaresbusqueda = true;
    }

    close() {
        // console.log('close vent cliente potencial');
        this.evenclose.emit('');
    }

    closelistabusqueda(event){
        // console.log('llega a buscombog closelistabusqueda');
        // console.log(event);
        this.evenclose.emit(event);
    }
    lanzarbusqueda(event) {
        // console.log("lanzarbuscliepoten");
        // console.log(event);
        var cbus = event.cbuscar.trim();
        var cid = parseInt(cbus);
        this.filtroabuscar = cbus;
        // if (cbus == '*') {
        //     this.filtroabuscar = cbus;
        // } else {
        //     if (cid > 0) {
        //         this.filtroabuscar = "id_cliepote=" + cid.toString() + " or nom_contac like '%" + cbus + "%' or ape_contac like '%" + cbus + "%' or nom_empre like '%" + cbus + "%'  or cod_cliepote like '%" + cbus + "%'";
        //     } else {
        //         this.filtroabuscar = "nom_contac like '%" + cbus + "%' or ape_contac like '%" + cbus + "%' or nom_empre like '%" + cbus + "%'  or cod_cliepote like '%" + cbus + "%'";
        //     }
        // }
        this.mostrarlistaresbusqueda = true;
    }

}

