//Librerias para código compartido mantenimiento de tablas
import { Injectable } from "@angular/core";
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { catchError, map, tap } from "rxjs/operators";
import { NetsolinApp } from '../shared/global';

import {
  FormControl,
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  ValidatorFn
} from "@angular/forms";
import { varGlobales } from "../shared/varGlobales";
//Op. Enero 2018
//En esta libreria se tienen metodos utilizado para la grabación y mantenimiento de formularios
//Se usa tanto en tablas basicas como en especiales ejemplo de uso terceros

@Injectable()
export class MantablasLibreria {
  constructor() {}
  
  //Define validación para un campo.
  //recibe el formulario,campo del formulario al que se le asigna la validacion
  //y una matriz con validadores validos para el campo
  //se utiliza al inicializar el formulario en metodo:inicializaForm() para definir validaciones especificas
  defineValidaCampo(pform: FormGroup, pcampo: string, avalidators: any[]) {
    var lcontrol: any;
    console.log('defineValidaCampo pcampo:'+pcampo);
    console.log(avalidators);
    lcontrol = pform.get(pcampo);
    if (avalidators.length > 0) {
      console.log('defineValidaCampo pcampo 1 limpia :'+pcampo);
      lcontrol.clearValidators();
      console.log(lcontrol);
      console.log('defineValidaCampo pcampo 2 asigna :'+pcampo);
      lcontrol.setValidators(avalidators);
    } else {
      console.log('defineValidaCampo pcampo 3 solo limpia :'+pcampo);
      lcontrol.clearValidators();  
    }
    console.log(lcontrol);
    console.log(pform);    
}

  //Consulta propiedad validacion campo formulario
  //De acuerdo con campo y propiedad solitada
  //se utiliza en plantilla html para saber si el campo es valido, pristine touched
  conpropvalCampo(pcampo: string, popvalid: string, pform: FormGroup) {
    let vcontrol = pform.controls[pcampo];
    if (popvalid == "valid") {
      return vcontrol.valid;
    } else if (popvalid == "invalid") {
      return vcontrol.invalid;
    } else if (popvalid == "pristine") {
      return vcontrol.pristine;
    } else if (popvalid == "touched") {
      return vcontrol.touched;
    }
    // console.log(vcontrol);
    return true;
  }

  //Retorna valor inicial de un control netscombog
  //Se utiliza en plantilla html para pasarle a un componente netscombog
  //el valor inicial que tiene el combog
  valoriniCombog(pcampo, pform: FormGroup) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = pform.controls[pcampo];
    return lcontrolcampo.value;
  }
 //Recibe de un componente netscombog el dato de forma que en campos de usuarios o
  //formularios automaticos asigne al objeto del formualario capturado el valor que llega
  //En formularios con validaciones especificas puede usar este como base y puede aprovecha para
  //hacer validaciones o ejecutar algo adicional luego de que el usuario selecciona un valor
  verCombog(event, pcamporecibe, pcamporetorna, pform: FormGroup) {
    //  console.log("verCombog");
    //  console.log(event);
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = pform.controls[pcamporecibe];
    // console.log("typeof event verCombog");
    // console.log(typeof event);
    // console.log(event);

    //si es indefinido dejar vacio
    if (typeof event == "undefined") {
      lcontrolcampo.setValue("");
      lvalor = "";
      return;
    }
    //si es por combog que retorna el valor o es por el que retorna objeto
    if (typeof event != "object") {
      if (event) {
        // console.log("valor que llega ciudades 2 asigna event");
        // lcontrolcampo.setValue(event);
        lvalor = event;
        // console.log("valor que llega ciudades 2 asigna event 2");
        // return
      }
    } else if (event.length > 0) {
      var result0 = event[0];
      lncampo = "result0." + pcamporetorna;
      lvalor = eval(lncampo);
      if (lvalor) {
      } else {
        lncampo = "result0.id";
        lvalor = eval(lncampo);
      }
    } else {
      lvalor = "";
    }
    lcontrolcampo.setValue(lvalor);
  }

  //Recibe de un componente nets-ccombog campo con busqueda
  //llega variable que se asigna al formulario en el campo dado
  //formularios automaticos asigne al objeto del formualario capturado el valor que llega
  //En formularios con validaciones especificas puede usar este como base y puede aprovecha para
  //hacer validaciones o ejecutar algo adicional luego de que el usuario selecciona un valor
  recibeCombobus(event, pcamporecibe, pform: FormGroup) {
    //  console.log("recibeCombobus");
    //  console.log(event);
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = pform.controls[pcamporecibe];
    // console.log("typeof event recibeCombobus");
    // console.log(typeof event);
    // console.log(event);
    // console.log(event.cbuscar);
    // console.log("recibeCombobus 2");
    if (event.cbuscar.length > 0) {
      // console.log("recibeCombobus 2.1");
      lvalor = event.cbuscar;
      // console.log("recibeCombobus 2.2");
      if (lvalor) {
        // console.log("recibeCombobus 2.2.1.1");
        // lncampon = "result0.nombre";
      } else {
        // console.log("recibeCombobus 2.2.2.1");
        // console.log(result0);
        lncampo = "result0.id";
        lvalor = eval(lncampo);
      }
    }
    lcontrolcampo.setValue(lvalor);
  }

  //Retorna valor inicial de un control netslistnum
  //Se utiliza en plantilla html para pasarle a un componente netslistnum
  //el valor inicial que tiene el combo netslistnum
  valoriniListnum(pcampo, pform: FormGroup) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = pform.controls[pcampo];
    return lcontrolcampo.value;
  }

  //Recibe de un componente netslistnum (componente con lista de opciones) el dato de forma que en campos de usuarios o
  //formularios automaticos asigne al objeto del formualario capturado el valor que llega
  //En formularios con validaciones especificas puede usar este como base y puede aprovecha para
  //hacer validaciones o ejecutar algo adicional luego de que el usuario selecciona un valor
  verListnum(event, pcamporecibe, pcamporetorna, pform: FormGroup) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = pform.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
  }
  //Asigna los valores que llegan (un registro en preg) en json de una tabla
  //a el formulario pform de acuerdo con estructura de campos pcamposform
  //si esta editando envie psoloconsulta en false sino para consulta solamente true
  //Se utiliza en Ver y Editar en ngOnInit luego de getregTabla
  asignaValoresform(
    preg: any,
    pform: FormGroup,
    pcamposform: any,
    psoloconsulta: boolean
  ) {
    var lcampo = "";
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    for (var litemobj of pcamposform) {
      lcampo = litemobj.name;
      // console.log(lcampo);
      lncampo = "preg." + litemobj.name;
      lcontrolcampo = pform.controls[lcampo];
      lvalor = eval(lncampo);
      if (litemobj.type == "date") {
        lvalor = lvalor.substring(0, 10);
      }
      lcontrolcampo.setValue(lvalor);
      if (psoloconsulta) {
        lcontrolcampo.disable();
      }
    }
  }

  //Asigna valor a un campo de un formulario
  asignaValorcampoform(pform: FormGroup, pcampo: string, pvalor: any) {
    var lcontrolcampo: any;
    // console.log("asignaValorcampoform pcampo:"+pcampo);
    // console.log(pvalor);
    lcontrolcampo = pform.controls[pcampo];
    lcontrolcampo.setValue(pvalor);
    // console.log(lcontrolcampo);
  }

  //Asigna valor a un campo de un formulario solo si el campo esta vacio o no definido
  asignaValorcampoformsindato(pform: FormGroup, pcampo: string, pvalor: any) {
    var lcontrolcampo: any;
    // console.log("asignaValorcampoform pcampo:"+pcampo);
    // console.log(pvalor);
    lcontrolcampo = pform.controls[pcampo];
    // console.log("asignaValorcampoform valor anterior:");
    // console.log(lcontrolcampo);
    // console.log(lcontrolcampo.value);
    // console.log("asignaValorcampoform valor nuevo:");
    // console.log(pvalor);
    if (!lcontrolcampo.value || lcontrolcampo.value != pvalor) {
      // console.log("se asignara el valor:"+pvalor);
      lcontrolcampo.setValue(pvalor);
      // console.log(lcontrolcampo);
    }
  }

  //Retorna el valor de un campo del formulario que se esta capturando
  valCampoform(pform: FormGroup, pcampo: string): any {
    var lcontrolcampo: any;
    lcontrolcampo = pform.controls[pcampo];
    return lcontrolcampo.value;
  }
  //Desabilita campo formulario
  disableCampoform(pform: FormGroup, pcampo: string) {
    let lcontrol = pform.get(pcampo);
    // lcontrol.disabled ? lcontrol.enable() : lcontrol.disable();
    lcontrol.disable();
  }
  //habilita campo formulario
  enableCampoform(pform: FormGroup, pcampo: string) {
    
    let lcontrol = pform.get(pcampo);
    // lcontrol.disabled ? lcontrol.disable() : lcontrol.enable();
    lcontrol.enable();
  }
  public copiaVarcrumbs(vglobal: varGlobales){
    NetsolinApp.copiaCrumbs.titulopag = vglobal.titulopag;
    NetsolinApp.copiaCrumbs.rutaanterior = vglobal.rutaanterior;
    NetsolinApp.copiaCrumbs.titrutaanterior = vglobal.titrutaanterior;
    NetsolinApp.copiaCrumbs.mostrarbreadcrumbs = vglobal.mostrarbreadcrumbs;
}

public restauraVarcrumbs(vglobal: varGlobales){
    vglobal.titulopag=NetsolinApp.copiaCrumbs.titulopag;
    vglobal.rutaanterior=NetsolinApp.copiaCrumbs.rutaanterior;
    vglobal.titrutaanterior=NetsolinApp.copiaCrumbs.titrutaanterior;
    vglobal.mostrarbreadcrumbs=NetsolinApp.copiaCrumbs.mostrarbreadcrumbs;
}


}
