import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetsolinApp } from '../../global';

import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { NetsolinService } from '../../../services/netsolin.service';

@Component({
  selector: 'app-appheader',
  templateUrl: './appheader.component.html',
  styleUrls: ['./appheader.component.css']
})
export class AppheaderComponent implements OnInit {
  headerNetsolin = '';
  oapp = null;
  pmensajes = null;
  cargomensajes = false;
  cargoalertas = false;
  cargorecordatorio = false;
  cargoprocesos = false;
  cargosolicitudes = false;
  palertas = null;
  precordatorio = null;
  pprocesos = null;
  psolicitudes = null;
  cargoini = false;
  pusuario = null;
  cargousuario = false;
  objoapp: any;
  hrefvtodo = 'javascript:show_dialogo_con("../EjeConsultaLis.wss?VRCod_obj=MONITORUSUARIO&VCAMPO=USUARIO&VCONDI=Inicia&VTEXTO=","Home","700px","100%",true)';
  constructor(
    private service: NetsolinService,
    private httpc: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.httpc.get('assets/netsolin_ini.json').subscribe(data => {
      NetsolinApp.urlNetsolin = data['url_netsolins'];
      // this.loadhtmlNetsolinbase();   
      // this.loadhtmlmenuslice();         
      this.objoapp = NetsolinApp.oapp;
      // console.log(this.objoapp);
      // console.log("En ngOnInit appheader ");
      // console.log(NetsolinApp.iniNetsolin);
      // console.log('cuserid: '+NetsolinApp.oapp.cuserid);
      // console.log('nomusuar: '+NetsolinApp.oapp.nomusuar);
      // console.log('superusuar: '+NetsolinApp.oapp.superusuar);
      // console.log('nom_empresa: '+NetsolinApp.oapp.nom_empresa);
      // console.log('nit_empresa: '+NetsolinApp.oapp.nit_empresa);

      this.headerNetsolin = localStorage.getItem('HeaderNetsolin');
      let lvar = '';
      lvar = localStorage.getItem('OappNetsolin');
      this.oapp = JSON.parse(lvar);
      this.cargoini = true;
      // console.log("En ngOnInit appheader oapp:"+this.oapp.nom_empresa);
      this.loadhtmlmenumessage();
      this.loadhtmlmenualert();
      this.loadhtmlmenurecordatorio();
      this.loadhtmlmenuprocesos();
      this.loadhtmlmenusolicitudes();
      this.loadhtmlmenuusuario();
    });

    // localStorage.setItem('FooterNetsolin',result.htmlfooter);
    // localStorage.setItem('OappNetsolin',result.oapp);

    // this.httpc.get('assets/netsolin_ini.json').subscribe(data => {
    // NetsolinApp.urlNetsolin =  data['url_netsolins'];
    // localStorage.setItem('urlNetsolin',NetsolinApp.urlNetsolin);
    // this.loadhtmlNetsolinbase();   
    // this.loadhtmlmenuslice();         
    // });      
  }
  cleanURL(oldURL: string) {
    return this.sanitizer.bypassSecurityTrustUrl(oldURL);
  }

  loadhtmlmenumessage() {
    this.service.getNetsolinMessages()
      .subscribe(result => {
        // console.log(result)
        this.cargomensajes = true;
        this.pmensajes = result;
        // console.log('pmensajes');
        // console.log(this.pmensajes);
      }, error => {
        this.cargomensajes = false;
        localStorage.setItem('Errorcargamensajes', error.message);
        //  console.log('error loadhtmlmenumessage');
        //  console.log(error.message);
      });
  }
  loadhtmlmenualert() {
    this.service.getNetsolinAlertas()
      .subscribe(result => {
        // console.log(result)
        this.palertas = result;
        this.cargoalertas = true;
        // console.log('palertas');
        // console.log(this.palertas);
      }, error => {
        this.cargoalertas = false;
        localStorage.setItem('Errorcargaalertas', error.message);
        console.log(error);
        console.log(error.message);
        // this.showError(error);
      });
  }

  loadhtmlmenuusuario() {
    this.service.getNetsolinUsuar()
      .subscribe(result => {
        // console.log(result)
        this.pusuario = result;
        this.cargousuario = true;
        // console.log('pusuario');
        // console.log(this.pusuario);
      }, error => {
        this.cargousuario = false;
        localStorage.setItem('Errorcargousuario', error.message);
        // this.showError(error);
      });
  }

  loadhtmlmenurecordatorio() {
    this.service.getNetsolinRecordatorio()
      .subscribe(result => {
        // console.log(result)
        this.precordatorio = result;
        this.cargorecordatorio = true;
        // console.log('palertas');
        // console.log(this.palertas);
      }, error => {
        this.cargorecordatorio = false;
        localStorage.setItem('Errorcargarecordat', error.message);
        // this.showError(error);
      });
  }

  loadhtmlmenuprocesos() {
    this.service.getNetsolinProcesos()
      .subscribe(result => {
        // console.log(result)
        this.pprocesos = result;
        this.cargoprocesos = true;
        // console.log('palertas');
        // console.log(this.palertas);
      }, error => {
        this.cargoprocesos = false;
        localStorage.setItem('Errorcargaproc', error.message);
        // this.showError(error);
      });
  }

  loadhtmlmenusolicitudes() {
    this.service.getNetsolinSolicitudes()
      .subscribe(result => {
        // console.log(result)
        this.psolicitudes = result;
        this.cargosolicitudes = true;
        // console.log('palertas');
        // console.log(this.palertas);
      }, error => {
        this.cargosolicitudes = false;
        localStorage.setItem('Errorcargasolicit', error.message);
        // this.showError(error);
      });
  }

}

