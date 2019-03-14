import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NetsolinApp } from '../../shared/global';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
    selector: 'netslistnum',
    styleUrls: ['./netslistnum.component.css'],
    templateUrl: './netslistnum.component.html'
})
export class Netslistnum implements OnInit {
    // @ViewChild('combo') public combo: ComboBoxComponent;
    // @Input() formcontrolname: string;
    // @Input() nomcontrol: string;
    @Input() valini: string;
    @Input() esdisabled: boolean;
    @Input() opciones: string;
    @Output() pasarDatos = new EventEmitter();

    cargando = false;
    cargoConfig = false;
    resultados = false;
    adatossolcombog: any[] = [];
    optionSelected: any;
    regDatos: any;
    public defaultItem: { text: string, value: number } = { text: "Seleccione...", value: null };

    public listItems: Array<{ text: string, value: string }> = [
    ];

    public events: string[] = [];
    constructor() {
    }

    //kendo ui

    ngOnInit() {
        // console.log('ngonit netslistnum');
        // console.log(this.opciones);
        // console.log("valini llega ngOnInit: "+this.valini);
        var aopciones = this.opciones.split(',');
        for (var _i = 0; _i < aopciones.length; _i++) {
            var num = aopciones[_i];
            // console.log(_i);
            // console.log(num);
            _i = _i + 1;
            var nva = aopciones[_i];
            // console.log(_i);
            // console.log(nva);
            var odop = { text: num, value: nva };
            // console.log(odop);
            this.listItems.push(odop);
        }
        this.resultados = true;
    }

    //carga un registro con la llave id para retornar el registro seleccionado al que llama
    loadReg(llave) {
        // console.log("valini llega loadReg: "+this.valini);
        //     console.log('pasar dato de lisnum');
        //     console.log(llave);
        this.pasarDatos.emit(llave);
    }

    message = "";
    // message = new MensajeError;

    showError(msg) {
        this.message = msg;
    }
    //evento que se dispara al cambiar el valor yperder foco
    public valueChange(value): void {
        // console.log("valuechange");
        // console.log(value);
        this.log("valueChange", value);
        this.resultados = true;

    }
    //evento que se dispara cuando se selecciona un elemento llama a cargar registro para retornal al que llamo el valor seleccionado
    public selectionChange(value: any): void {
        this.log("selectionChange", value);
        // this.log("value.id", value.id);
        // console.log("selectionChange");
        // console.log(value);
        if (typeof (value) != 'undefined') {
            this.loadReg(value);
        } else { }
        // alert(`id: ${id}, text: ${text}`);
    }

    public open(): void {
        // console.log("open");
        this.log("open", "");
    }

    public close(): void {
        // console.log("close");
        this.log("close", "");
    }

    public focus(): void {
        // console.log("focus");
        this.log("focus", "");
    }

    public blur(): void {
        // console.log("blur");
        this.log("blur", "");
    }
    //para ir viendo eventos que se disparan 
    //desmarcar en html para depurar solo usar en depuracion
    private log(event: string, arg: any): void {
        console.log("log event");
        console.log(event);
        console.log(arg);
        // this.events.push(`${event} ${arg || ""}`);
    }
    //
}
