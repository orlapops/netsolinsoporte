import { Text } from '@angular/compiler/src/i18n/i18n_ast';
import { error } from 'util';
import { Component, OnInit, Input, Output, OnChanges, SimpleChanges,EventEmitter } from '@angular/core';
import { NetsolinApp } from '../../shared/global';
import { NetsolinService } from '../../services/netsolin.service';
import { MantablasLibreria } from "../../services/mantbasica.libreria";
import { ChartsModule } from '@progress/kendo-angular-charts';
import { Router, ActivatedRoute } from "@angular/router";
import { varGlobales } from "../../shared/varGlobales";
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

interface Model {
  category: string;
  value: number;
}
interface ItemOpciones {
  id: string,
  opcion: string
}

@Component({
  selector: 'nets-grafico',
  templateUrl: './grafico.component.html',
  styles: []
})
export class GraficoComponent implements OnInit {
  @Input() titulo: string;
  @Input() leyendavisible: boolean = true;
  @Input() backgroundcolor: string = 'white';
  @Input() tipografico: string = 'line';
  @Input() formatoxy: string = '';
  @Input() formatoserie: string = "";
  @Input() style: string = "";
  @Input() oparamgrafico: any;
  //Para comunicar grafica
  @Input() clasegrafico:string='mes';

  inicializado=false;
  cambiomes=false;
  modelgrafserie1: Model[];
  modelgrafserie2: Model[];
  modeldatos: any;
  objretornado:any;
  linkexcel:string='';

  // public Itemopciones: { opcion: string } = { opcion: "Select ..." };
  public Itemopciones: { opcion: string } ;

  public titopciones: string='Opción 1';
  public listaopciones: any[] = [];
  public selectedopcion: ItemOpciones = this.listaopciones[0];

  public titopciones2: string='Opción 2';
  public listaopciones2: any[] = [];
  public selectedopcion2: ItemOpciones = this.listaopciones2[0];
  
  public showTransitions: boolean = true;
  public resultados:boolean = true;
  constructor(
    private service: NetsolinService,
    public libmantab: MantablasLibreria,
    private activatedRouter: ActivatedRoute,
    public vglobal: varGlobales,
    ) 
    { }
  ngOnChanges(changes: SimpleChanges): void {
      //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
      //Add '${implements OnChanges}' to the class.
      console.log('grafico.component detecta cambi ngonchanges');
      console.log(this.oparamgrafico);
      NetsolinApp.objenvrest.tiporet = 'OBJ'
    
      this.service.getNetsolinObjconParametros(this.oparamgrafico.objeto,this.oparamgrafico)
      .subscribe(result => {
          //viene registro con datos de la grafica
          this.inicializado = true;
          console.log("handleOpcionChange eje getNetsolinObjconParametros retorna result");
          console.log(result);
          this.listaopciones=result.opciones.opciones;
          
          this.modelgrafserie1=result.serie1.data;
          this.modelgrafserie2=result.serie2.data;
          this.modeldatos=result.curdatos;
          this.linkexcel=result.opciones.linkexcel;
          console.log('link excel:'+this.linkexcel);
          if (result.opciones.titulo != ''){
            this.titulo = result.opciones.titulo;
          }
        this.objretornado=result;
          var result0 = result[0];
          this.inicializado=true;
          // console.log(result0);
          if (typeof result.isCallbackError === "undefined") {       
            //viene el registro con datos para el grafico
            console.log("handleOpcionChange eje getNetsolinObjconParametros retorna con datos grafico result");
            console.log(result);  
          } else {
            //viene el registro con el error
            console.log("Error en getNetsolinObjconParametros result");
            console.log(result);
          }
        },
        error => {
          console.log("Error en getNetsolinObjconParametros error otro tipo");
          console.log(error);
        }
      );
          
    }
    
  ngOnInit() {
    console.log('ngOnInit grafico oparamgrafico');
    console.log(this.oparamgrafico);

    if (typeof(this.oparamgrafico.opcion) != "undefined") {
      this.oparamgrafico.opcion = '';

    // if (typeoff())
    }

    if (typeof(this.oparamgrafico.opcion2) != "undefined") {
      this.oparamgrafico.opcion2 = '';
  
    // if (typeoff())
    }
    

    console.log(this.oparamgrafico);
    NetsolinApp.objenvrest.tiporet = 'OBJ'
    this.service.getNetsolinObjconParametros(this.oparamgrafico.objeto,this.oparamgrafico)
    .subscribe(result => {
        //viene registro con datos de la grafica
        console.log("eje getNetsolinObjconParametros retorna result");
        console.log(result);

        this.listaopciones=result.opciones.opciones;
        if (typeof(result.opciones.titopcion) != "undefined") {
          this.titopciones=result.opciones.titopcion;
        }
        this.listaopciones2=result.opciones2.opciones2;
        if (typeof(result.opciones2.titopcion) != "undefined") {
          this.titopciones2=result.opciones2.titopcion;
        }

        console.log("LISTA MES");
        console.log(this.listaopciones2);

        if (result.opciones.titulo != ''){
          this.titulo = result.opciones.titulo;
        }
        

        this.modelgrafserie1=result.serie1.data;
        this.modelgrafserie2=result.serie2.data;
        this.modeldatos=result.curdatos;
        this.linkexcel=result.opciones.linkexcel;
        console.log('link excel:'+this.linkexcel);
        this.objretornado=result;
        var result0 = result[0];
        this.inicializado=true;
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
        console.log(error);
      }
    );

  
  
  }
  public labelContent(e: any): string {
    return `${ e.category }: \n ${e.value}`;
}
handleOpcionChange(value) {
  this.inicializado = false;
  console.log('handleOpcionChange 1');
  console.log('this.selectedopcion');
  console.log(this.selectedopcion);
  console.log(typeof(this.oparamgrafico.opcion));
  if (typeof(this.oparamgrafico.opcion) != "undefined") {
    console.log('handleOpcionChange cambio opcion');
    this.oparamgrafico.opcion = this.selectedopcion.id;
  // if (typeoff()) value.value
  }
  console.log('handleOpcionChange 2');
  console.log('this.selectedopcion');
  console.log(this.selectedopcion);
  console.log(this.oparamgrafico);
  NetsolinApp.objenvrest.tiporet = 'OBJ'

  this.service.getNetsolinObjconParametros(this.oparamgrafico.objeto,this.oparamgrafico)
  .subscribe(result => {
      //viene registro con datos de la grafica
      this.inicializado = true;
      console.log("handleOpcionChange eje getNetsolinObjconParametros retorna result");
      console.log(result);
      this.listaopciones=result.opciones.opciones;
      
      this.modelgrafserie1=result.serie1.data;
      this.modelgrafserie2=result.serie2.data;
      this.modeldatos=result.curdatos;
      this.linkexcel=result.opciones.linkexcel;
      console.log('link excel:'+this.linkexcel);
      if (result.opciones.titulo != ''){
        this.titulo = result.opciones.titulo;
      }
    this.objretornado=result;
      var result0 = result[0];
      this.inicializado=true;
      // console.log(result0);
      if (typeof result.isCallbackError === "undefined") {       
        //viene el registro con datos para el grafico
        console.log("handleOpcionChange eje getNetsolinObjconParametros retorna con datos grafico result");
        console.log(result);  
      } else {
        //viene el registro con el error
        console.log("Error en getNetsolinObjconParametros result");
        console.log(result);
      }
    },
    error => {
      console.log("Error en getNetsolinObjconParametros error otro tipo");
      console.log(error);
    }
  );
}  

handleOpcion2Change(value) {
  this.inicializado = false;
  console.log('handleOpcion2Change 1');
  console.log('this.selectedopcion');
  console.log(this.selectedopcion2);
  console.log(typeof(this.oparamgrafico.opcion2));
  if (typeof(this.oparamgrafico.opcion2) != "undefined") {
    console.log('handleOpcion2Change cambio opcion MES');
    this.oparamgrafico.opcion2 = this.selectedopcion2.id;
  // if (typeoff()) value.value
  }
  console.log('handleOpcion2Change 2');
  console.log('this.selectedopcion2');
  console.log(this.selectedopcion2);
  console.log(this.oparamgrafico);
  NetsolinApp.objenvrest.tiporet = 'OBJ'
  this.service.getNetsolinObjconParametros(this.oparamgrafico.objeto,this.oparamgrafico)
  .subscribe(result => {
      //viene registro con datos de la grafica
      this.inicializado = true;
      console.log("handleOpcion2Change eje getNetsolinObjconParametros retorna result");
      console.log(result);
      this.listaopciones2=result.opciones2.opciones2;
      this.modelgrafserie1=result.serie1.data;
      this.modelgrafserie2=result.serie2.data;
      this.modeldatos=result.curdatos;
      this.linkexcel=result.opciones.linkexcel;
      console.log('link excel:'+this.linkexcel);
      if (result.opciones.titulo != ''){
        this.titulo = result.opciones.titulo;
      }
    this.objretornado=result;
      var result0 = result[0];
      this.inicializado=true;
      // console.log(result0);
      if (typeof result.isCallbackError === "undefined") {       
        //viene el registro con datos para el grafico
        console.log("handleOpcionChange eje getNetsolinObjconParametros retorna con datos grafico result");
        console.log(result);  
      } else {
        //viene el registro con el error
        console.log("Error en getNetsolinObjconParametros result");
        console.log(result);
      }
    },
    error => {
      console.log("Error en getNetsolinObjconParametros error otro tipo");
      console.log(error);
    }
  );
}  


}
