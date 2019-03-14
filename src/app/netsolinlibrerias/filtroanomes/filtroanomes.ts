//import { Text } from '@angular/compiler/src/i18n/i18n_ast';
//import { error } from 'util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NetsolinApp } from '../../shared/global';
import { NetsolinService } from '../../services/netsolin.service';
import { MantablasLibreria } from "../../services/mantbasica.libreria";
//import { ChartsModule } from '@progress/kendo-angular-charts';
//import { Router, ActivatedRoute } from "@angular/router";
import { varGlobales } from "../../shared/varGlobales";
//import { TabStripComponent } from '@progress/kendo-angular-layout';
//import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

interface Item_mes {
  id: string,
  opcion: string
}
interface Item_ano {
  id: string,
  opcion: string
}

@Component({
    selector: 'nets-filtroanomes',
    styleUrls: ['./filtroanomes.css'],
    templateUrl: './filtroanomes.html'
})
export class Filtroanomes implements OnInit {
  //recibe tipo A filtra solo ano, M Filtra solo mes AM filtra año mes
  @Input() tipo: string;
  @Input() titulofiltro: string;
  @Input() anoini: string;
  @Input() mesini: string;
  //evento que retorna cuando cambia ano
  @Output() pasarAno = new EventEmitter();
  //evento que retorna cuando cambia mes
  @Output() pasarMes = new EventEmitter();
    
   

    inicializado=false;
    filtraano=false;
    filtrames=false;
    objretornado:any;

    filtroanomes : any ={
        objeto:'CRMFILANOMES',
        usuario: 'NETSOLIN'
      }

     
    public buscar:string = "";
    public Item_mes: { opcion: string } = { opcion: "Seleccione ..." };
    public lista_mes: Item_mes[];
    public selectedmes: Item_mes;
    public Item_ano: { opcion: string } = { opcion: "Selecione ..." };
    public lista_ano: Item_ano[];
    public selectedano: Item_ano;

    //public selectedopcion: Item_mes = this.lista_mes[0];

    constructor( private service: NetsolinService,
                 public vglobal: varGlobales,
                 public libmantab: MantablasLibreria ) 

    { }

    ngOnInit() {
       
        //  this.buscar=this.valini;

         NetsolinApp.objenvrest.tiporet = 'OBJ'
         this.service.getNetsolinObjconParametros(this.filtroanomes.objeto,this.filtroanomes)
         .subscribe(result => {
             //viene registro con datos de del  mes
            // console.log("PARAMETROS ENVIADOS");
            //console.log (this.filtroanomes.objeto)
            //console.log(this.filtroanomes)

            //console.log("Result AÑO-MES");
            //console.log(result);
     
             this.lista_mes=result.meses;
             this.lista_ano=result.anos;
             
        
             //console.log("LISTA MES-ANO");
             //console.log(this.lista_mes);
             //console.log(this.lista_ano);

             //console.log("LISTA AÑO FITLROANOMES");
             //console.log(this.lista_ano);
     
             this.objretornado=result;
             var result0 = result[0];
             this.inicializado=true;
             if (this.tipo == 'AM') {
              this.filtraano = true;
              this.filtrames = true;
            } else if (this.tipo == 'M'){
              this.filtraano = false;
              this.filtrames = true;
             } else {
              this.filtraano = true;
              this.filtrames = false;
             }

             // console.log(result0);
             if (typeof result.isCallbackError === "undefined") {    
                    
               //viene el registro con datos para el grafico
               console.log("eje getNetsolinObjconParametros retorna con datos grafico result");
               console.log(result);  
             } else {
               //viene el registro con el error
               console.log("Error en getNetsolinObjconParametros result");
               console.log(result);
               
             }
           },
           error => {
             console.log("Error en getNetsolinObjconParametros error otro tipo");
             console.log(error);}
         );
     
    }

    // onEnter(value:string){
    //     this.pasarDatos.emit({cbuscar: value});
    // }
    // lanzarFunc(event){
    //     //this.pasarDatos.emit({cbuscar: this.lista_mes});
    //     this.pasarDatos.emit(this.selectedmes);

    // }
    handleMesChange(value) {
      console.log('handleMesChange ');
      console.log(this.selectedmes);
      this.pasarMes.emit(this.selectedmes);
  }                    
    
  handleAnoChange(value) {
    console.log('handleAnoChange ');
    console.log(this.selectedano);
    this.pasarAno.emit(this.selectedano);
}                    


}

