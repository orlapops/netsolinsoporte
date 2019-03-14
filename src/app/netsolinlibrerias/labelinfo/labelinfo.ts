import { Text } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

@Component({
    selector: 'labelinfo',
    styleUrls: ['./labelinfo.css'],
    templateUrl: './labelinfo.html'
})
export class Labelinfo implements OnInit {
    @Input() titulo: string;
    @Input() valor: string;
    @Output() pasarDatos = new EventEmitter();
    
    public buscar:string = "";

    constructor() {               
     }

    ngOnInit() {
    }

    onEnter(value:string){
        this.pasarDatos.emit({cbuscar: value});
    }
    lanzarFunc(event){
        this.pasarDatos.emit({cbuscar: this.buscar});
    }
}

