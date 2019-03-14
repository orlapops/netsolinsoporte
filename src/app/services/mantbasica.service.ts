import { Injectable } from "@angular/core";
// import { Headers, Http, Response } from '@angular/http';
// import 'rxjs/Rx';
// import { Observable } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
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

@Injectable()
export class MantbasicaService {
  constructor(private http: HttpClient) {}

  getRegistros(
    ptabla: string,
    paplica: string,
    pcampollave: string,
    pclase_nbs: string,
    pclase_val: string
  ): Observable<any> {
    NetsolinApp.urlNetsolin = localStorage.getItem("urlNetsolin");
    NetsolinApp.objenvrestcrud.usuario = NetsolinApp.oapp.cuserid;
    NetsolinApp.objenvrestcrud.psw = NetsolinApp.oapp.cuserpsw;
    NetsolinApp.objenvrestcrud.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
    NetsolinApp.objenvrestcrud.tabla = ptabla;
    NetsolinApp.objenvrestcrud.orden = "";
    NetsolinApp.objenvrestcrud.aplica = parseInt(paplica);
    NetsolinApp.objenvrestcrud.campos = "*";
    NetsolinApp.objenvrestcrud.campollave = pcampollave;
    NetsolinApp.objenvrestcrud.clase_val = pclase_val;
    NetsolinApp.objenvrestcrud.clase_nbs = pclase_nbs;
    NetsolinApp.objenvrestcrud.llave = "";
    NetsolinApp.objenvrestcrud.cursor = "Tcursorx";
    NetsolinApp.objenvrestcrud.filtro = "";
    NetsolinApp.objenvrestcrud.filtro = "*";
    return this.http
      .post(
        NetsolinApp.urlNetsolin + "nets_v_exi_ref.csvc",
        NetsolinApp.objenvrestcrud
      )
      .pipe(
        map(resul => {
          // console.log('map getNetsolinMantbas');
          //  console.log(resul);
          return resul;
        })
      );
  }

  gettablaSearch(
    busqueda: string,
    ptabla: string,
    paplica: string,
    pcampollave: string,
    pclase_nbs: string,
    pclase_val: string,
    pcamponombre: string,
    porden: string,
    pobjeto: string,
    pexporta: string
  ): Observable<any> {
    NetsolinApp.urlNetsolin = localStorage.getItem("urlNetsolin");
    NetsolinApp.objenvrestcrud.usuario = NetsolinApp.oapp.cuserid;
    NetsolinApp.objenvrestcrud.psw = NetsolinApp.oapp.cuserpsw;
    NetsolinApp.objenvrestcrud.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
    NetsolinApp.objenvrestcrud.tabla = ptabla;
    NetsolinApp.objenvrestcrud.orden = porden;
    NetsolinApp.objenvrestcrud.aplica = parseInt(paplica);
    NetsolinApp.objenvrestcrud.campos = "*";
    NetsolinApp.objenvrestcrud.campollave = pcampollave;
    NetsolinApp.objenvrestcrud.clase_val = pclase_val;
    NetsolinApp.objenvrestcrud.clase_nbs = pclase_nbs;
    NetsolinApp.objenvrestcrud.llave = "";
    NetsolinApp.objenvrestcrud.objeto = pobjeto;
    NetsolinApp.objenvrestcrud.exporta = pexporta;
    NetsolinApp.objenvrestcrud.cursor = "Tcursorx";
    if (busqueda == "*") {
      //   console.log("filtro para buscar 1 VA *");
      NetsolinApp.objenvrestcrud.filtro = "*";
    } else {
      // console.log("filtro para buscar 2");
      //si viene un igual o > o < es porque ya viene filtro armado y no lo arma
      if (
        busqueda.indexOf("=") > 0 ||
        busqueda.indexOf(">") > 0 ||
        busqueda.indexOf("<") > 0 ||
        busqueda.indexOf("like") > 0 ||
        busqueda.indexOf("LIKE") > 0
      ) {
        // console.log("filtro para buscar 3 va por que encontro =");
        NetsolinApp.objenvrestcrud.filtro = busqueda;
      } else {
        //   console.log("filtro para buscar 2");
        //   console.log(pcampollave);
        var acllave = pcampollave.split(",");
        //   console.log(acllave);
        //solo tener encuenta 2 para armar condicion
        var lenallave = acllave.length;
        if (acllave.length > 1) {
          var condi = "";
          NetsolinApp.objenvrestcrud.filtro =
            acllave[0] +
            " like '%" +
            busqueda +
            "%' or " +
            acllave[1] +
            " like '%" +
            busqueda +
            "%' or " +
            pcamponombre +
            " like '%" +
            busqueda +
            "%'";
        } else {
          NetsolinApp.objenvrestcrud.filtro =
            pcampollave +
            " like '%" +
            busqueda +
            "%' or " +
            pcamponombre +
            " like '%" +
            busqueda +
            "%'";
        }
      }
    }
    // console.log("filtro para buscar");
    // console.log(NetsolinApp.objenvrestcrud.filtro);
    return this.http
      .post(
        NetsolinApp.urlNetsolin + "nets_v_exi_ref.csvc",
        NetsolinApp.objenvrestcrud
      )
      .pipe(
        map(resul => {
          // console.log('map post');
          //  console.log(resul);
          return resul;
        })
      );
  }

  getregTabla(
    id: any,
    ptabla: string,
    paplica: string,
    pcampollave: string,
    pclase_nbs: string,
    pclase_val: string,
    pcamponombre: string
  ): Observable<any> {
    // console.log("getregTabla");
    // console.log(id);
    NetsolinApp.urlNetsolin = localStorage.getItem("urlNetsolin");
    NetsolinApp.objenvrestcrud.usuario = NetsolinApp.oapp.cuserid;
    NetsolinApp.objenvrestcrud.psw = NetsolinApp.oapp.cuserpsw;
    NetsolinApp.objenvrestcrud.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
    NetsolinApp.objenvrestcrud.tabla = ptabla;
    NetsolinApp.objenvrestcrud.orden = "";
    NetsolinApp.objenvrestcrud.aplica = parseInt(paplica);
    NetsolinApp.objenvrestcrud.campos = "*";
    NetsolinApp.objenvrestcrud.campollave = pcampollave;
    NetsolinApp.objenvrestcrud.clase_val = pclase_val;
    NetsolinApp.objenvrestcrud.clase_nbs = pclase_nbs;
    // console.log('getregTabla pcampollave:'+pcampollave);
    if (typeof id == "string") {
      var acllave = pcampollave.split(",");
      var aid = id.split("|");
      // console.log(acllave);
      //solo tener encuenta 2 para armar condicion
      var lstrvalcampollave = "";
      if (acllave.length > 1) {
        var condi = "";
        condi =
          acllave[0] +
          "='" +
          aid[0] +
          "' AND " +
          acllave[1] +
          "='" +
          aid[1] +
          "'";
        NetsolinApp.objenvrestcrud.llave = condi;
      } else {
        NetsolinApp.objenvrestcrud.llave = id;
      }
    } else {
      NetsolinApp.objenvrestcrud.llave = id;
    }
    // console.log("NetsolinApp.objenvrestcrud.llave: "+NetsolinApp.objenvrestcrud.llave);
    NetsolinApp.objenvrestcrud.cursor = "Tcursorx";
    NetsolinApp.objenvrestcrud.filtro = "";
    NetsolinApp.objenvrestcrud.datos = id;
    return this.http
      .post(
        NetsolinApp.urlNetsolin + "nets_v_exi_ref.csvc",
        NetsolinApp.objenvrestcrud
      )
      .pipe(
        map(resul => {
          // console.log('getregtabla resul');
          // console.log(resul);
          var result0 = resul[0];
          // console.log(result0);
          //si hay error retorna lista de errores sino el registro solicitado
          if (typeof result0 == "undefined") {
            return resul;
          } else {
            return resul[0];
          }
          // return resul;
        })
      );
  }

  //adicionar
  postregTabla(
    regTabla: any,
    ptabla: string,
    paplica: string,
    pcampollave: string,
    pclase_nbs: string,
    pclase_val: string,
    pcamponombre: string
  ): Observable<any> {
    NetsolinApp.urlNetsolin = localStorage.getItem("urlNetsolin");
    NetsolinApp.objenvrestcrud.usuario = NetsolinApp.oapp.cuserid;
    NetsolinApp.objenvrestcrud.psw = NetsolinApp.oapp.cuserpsw;
    NetsolinApp.objenvrestcrud.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
    NetsolinApp.objenvrestcrud.tabla = ptabla;
    NetsolinApp.objenvrestcrud.orden = "";
    NetsolinApp.objenvrestcrud.aplica = parseInt(paplica);
    NetsolinApp.objenvrestcrud.campos = "*";
    NetsolinApp.objenvrestcrud.campollave = pcampollave;
    NetsolinApp.objenvrestcrud.clase_val = pclase_val;
    NetsolinApp.objenvrestcrud.clase_nbs = pclase_nbs;
    // console.log('postregTabla pcampollave:'+pcampollave);
    var acllave = pcampollave.split(",");
    // console.log(acllave);
    //solo tener encuenta 2 para armar condicion
    var lstrvalcampollave = "";
    if (acllave.length > 1) {
      var condi = "";
      lstrvalcampollave = "regTabla." + acllave[0];
      condi = acllave[0] + "='" + eval(lstrvalcampollave) + "'";
      lstrvalcampollave = "regTabla." + acllave[1];
      condi =
        condi + " AND " + acllave[1] + "='" + eval(lstrvalcampollave) + "'";
      NetsolinApp.objenvrestcrud.llave = condi;
    } else {
      // console.log('postregTabla ELSE pcampollave NO ESPLIT:'+pcampollave);
      // console.log('postregTabla regTabla');
      // console.log(regTabla);
      lstrvalcampollave = "regTabla." + pcampollave;
      // console.log('postregTabla strval campollave:'+lstrvalcampollave);
      NetsolinApp.objenvrestcrud.llave = eval(lstrvalcampollave);
      // console.log('postregTabla NetsolinApp.objenvrestcrud.llave:'+NetsolinApp.objenvrestcrud.llave);
    }
    // console.log('postregTabla strval campollave:'+lstrvalcampollave);
    // console.log('postregTabla val campollave:'+NetsolinApp.objenvrestcrud.llave);
    NetsolinApp.objenvrestcrud.cursor = "Tcursorx";
    NetsolinApp.objenvrestcrud.filtro = "";
    NetsolinApp.objenvrestcrud.datos = regTabla;
    // console.log(NetsolinApp.objenvrestcrud);
    return this.http
      .post(
        NetsolinApp.urlNetsolin + "restcrudtablanetsolin.csvc",
        NetsolinApp.objenvrestcrud
      )
      .pipe(
        map(resul => {
          return resul;
        })
      );
  }

  putregTabla(
    regTabla: any,
    id: any,
    ptabla: string,
    paplica: string,
    pcampollave: string,
    pclase_nbs: string,
    pclase_val: string,
    pcamponombre: string
  ): Observable<any> {
    NetsolinApp.urlNetsolin = localStorage.getItem("urlNetsolin");
    NetsolinApp.objenvrestcrud.usuario = NetsolinApp.oapp.cuserid;
    NetsolinApp.objenvrestcrud.psw = NetsolinApp.oapp.cuserpsw;
    NetsolinApp.objenvrestcrud.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
    NetsolinApp.objenvrestcrud.tabla = ptabla;
    NetsolinApp.objenvrestcrud.orden = "";
    NetsolinApp.objenvrestcrud.aplica = parseInt(paplica);
    NetsolinApp.objenvrestcrud.campos = "*";
    NetsolinApp.objenvrestcrud.campollave = pcampollave;
    NetsolinApp.objenvrestcrud.clase_val = pclase_val;
    NetsolinApp.objenvrestcrud.clase_nbs = pclase_nbs;
    // console.log('putregTabla pcampollave:'+pcampollave);
    var acllave = pcampollave.split(",");
    var aid = id.split("|");
    // console.log(acllave);
    //solo tener encuenta 2 para armar condicion
    var lstrvalcampollave = "";
    if (acllave.length > 1) {
      var condi = "";
      condi =
        acllave[0] +
        "='" +
        aid[0] +
        "' AND " +
        acllave[1] +
        "='" +
        aid[1] +
        "'";
      NetsolinApp.objenvrestcrud.llave = condi;
    } else {
      NetsolinApp.objenvrestcrud.llave = id;
    }
    NetsolinApp.objenvrestcrud.cursor = "Tcursorx";
    NetsolinApp.objenvrestcrud.filtro = "";
    NetsolinApp.objenvrestcrud.datos = regTabla;
    NetsolinApp.objenvrestcrud.delete = "N";
    // return this.http.put(NetsolinApp.urlNetsolin + "nets_v_exi_ref.csvc", NetsolinApp.objenvrestcrud)
    // console.log("modificar a llamar servicio");
    return this.http
      .put(
        NetsolinApp.urlNetsolin + "restcrudtablanetsolin.csvc",
        NetsolinApp.objenvrestcrud
      )
      .pipe(
        map(resul => {
          // console.log("modificar retorna servicio");
          // console.log(resul);
          return resul;
        })
      );
  }
  //trae una lista de una tabla pequeña como solcombog
  public getListadropdown(filtro: any,tabla: string,orden: string,aplica: number,objeto: string,filtroadi: any): any {
    NetsolinApp.objenvrestsolcomobog.usuario = NetsolinApp.oapp.cuserid;
    NetsolinApp.objenvrestsolcomobog.psw = NetsolinApp.oapp.cuserpsw;
    NetsolinApp.objenvrestsolcomobog.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
    NetsolinApp.objenvrestsolcomobog.tabla = tabla;
    NetsolinApp.objenvrestsolcomobog.orden = orden;
    NetsolinApp.objenvrestsolcomobog.aplica = aplica;
    NetsolinApp.objenvrestsolcomobog.filtro = filtro;
    NetsolinApp.objenvrestsolcomobog.llave = '';
    NetsolinApp.objenvrestsolcomobog.objeto = objeto;
    NetsolinApp.objenvrestsolcomobog.filtroadi=filtroadi;
    NetsolinApp.objenvrestsolcomobog.cursor = "Tcursorx";
    // console.log("getListadropdown por netsolin NetsolinApp.objenvrestsolcomobog");
    // console.log(NetsolinApp.objenvrestsolcomobog);
    return this.http
      .post(
        NetsolinApp.urlNetsolin + "NetsolComobog.csvc",
        NetsolinApp.objenvrestsolcomobog
      )
      .pipe(
        map(resul => {
          // console.log("getListadropdown por netsolin resul");
          // console.log(resul);
          return resul;
        })
      );
  }

  deleteTabla(
    regtabla: any,
    id: any,
    ptabla: string,
    paplica: string,
    pcampollave: string,
    pclase_nbs: string,
    pclase_val: string
  ): Observable<any> {
    NetsolinApp.urlNetsolin = localStorage.getItem("urlNetsolin");
    NetsolinApp.objenvrestcrud.usuario = NetsolinApp.oapp.cuserid;
    NetsolinApp.objenvrestcrud.psw = NetsolinApp.oapp.cuserpsw;
    NetsolinApp.objenvrestcrud.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
    NetsolinApp.objenvrestcrud.tabla = ptabla;
    NetsolinApp.objenvrestcrud.orden = "";
    NetsolinApp.objenvrestcrud.aplica = parseInt(paplica);
    NetsolinApp.objenvrestcrud.campos = "*";
    NetsolinApp.objenvrestcrud.campollave = pcampollave;
    NetsolinApp.objenvrestcrud.clase_val = pclase_val;
    NetsolinApp.objenvrestcrud.clase_nbs = pclase_nbs;
    // NetsolinApp.objenvrestcrud.llave = id;
    // console.log("deleteTabla pcampollave:" + pcampollave);
    // console.log(typeof id);
    if (typeof id != "number") {
      var acllave = pcampollave.split(",");
      var aid = id.split("|");
      // console.log(acllave);
      //solo tener encuenta 2 para armar condicion
      var lstrvalcampollave = "";
      if (acllave.length > 1) {
        var condi = "";
        condi =acllave[0] + "='" + aid[0] + "' AND " +acllave[1] + "='" + aid[1] +"'";
        NetsolinApp.objenvrestcrud.llave = condi;
      } else {
        NetsolinApp.objenvrestcrud.llave = id;
      }
    } else {
      NetsolinApp.objenvrestcrud.llave = id.toString();
    }
    NetsolinApp.objenvrestcrud.cursor = "Tcursorx";
    NetsolinApp.objenvrestcrud.delete = "S";
    NetsolinApp.objenvrestcrud.filtro = "";

    return this.http
      .put(
        NetsolinApp.urlNetsolin + "restcrudtablanetsolin.csvc",
        NetsolinApp.objenvrestcrud
      )
      .pipe(
        map(resul => {
          return resul;
        })
      );
  }
}
