import { Component, OnInit } from '@angular/core';
import { NetsolinApp } from '../../global';

@Component({
  selector: 'app-appsettings',
  templateUrl: './appsettings.component.html',
  styleUrls: ['./appsettings.component.css']
})
export class AppsettingsComponent implements OnInit {
  objoapp:any;
  cargoini=false;
  linksegobj='';  
  
  constructor() { }

  ngOnInit() {
       this.objoapp=NetsolinApp.oapp;
      //  this.linksegobj='javascript:show_dialogo_con("../EjeConsultaLis.wss?VRCod_obj=SEGURIDADOBJ&VCAMPO=&VCONDI=Especial&VRPLINKXML=N&VTEXTO=PVXICOD_OBJ=['+NetsolinApp.oapp.obj_actual+'],PVXITIPO=[]","Seg. Objeto","700px","100%",true)';
       this.linksegobj='javascript:show_dialogo_con("../EjeConsultaLis.wss?VRCod_obj=MONCSOLICITUD&VCAMPO=&VCONDI=Especial&VRPLINKXML=N&VTEXTO=PVXICOD_OBJ=['+NetsolinApp.oapp.obj_actual+'],PVXITIPO=[]","Crear Solicitud","700px","100%",true)';
       this.cargoini=true;
  }

}
