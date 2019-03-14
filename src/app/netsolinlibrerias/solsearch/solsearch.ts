// import { EventEmitter } from 'NodeJS';
import { Text } from '@angular/compiler/src/i18n/i18n_ast';
import { error } from 'util';
import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import {HttpClient} from '@angular/common/http';
import { NetsolinApp } from '../../shared/global';

@Component({
    selector: 'solsearch',
    styleUrls: ['./solsearch.css'],
    templateUrl: './solsearch.html'
})
export class Solsearch implements OnInit {
    @Input() placeholder: string;
    @Input() valini: string;
    @Output() pasarDatos = new EventEmitter();
    
    public buscar:string = "";

    constructor() {               
     }

    ngOnInit() {
         this.buscar=this.valini;
    }

    onEnter(value:string){
        this.pasarDatos.emit({cbuscar: value});
    }
    lanzarFunc(event){
        this.pasarDatos.emit({cbuscar: this.buscar});
    }
}

