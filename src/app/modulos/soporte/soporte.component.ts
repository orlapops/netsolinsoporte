import { Component, OnInit } from "@angular/core";
import { error } from "util";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NetsolinService } from "../../services/netsolin.service";
import { NetsolinApp } from "../../shared/global";
import { environment } from "../../../environments/environment";
// import { SoporteService } from '../../services/soporte.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable } from "rxjs";

declare function init_plugins();

@Component({
  selector: "app-soporte",
  providers: [NetsolinService],
  templateUrl: "./soporte.component.html",
  styles: []
})

//Aqui debe cambiar Modelo por identificardo del modulo principal
export class SoporteComponent implements OnInit {
  title = "app";
  constructor(
    private service: NetsolinService,
    private fbDb: AngularFirestore,
    // public _soporservice: SoporteService,
    private httpc: HttpClient
  ) {
    console.log('constructo app.componet');
  }
  htmlheader = "";
  htmlfooter = "";
  titulo = "Netsolin Modelo";
  oapp = null;
  cargando = true;
  errorcargando = false;
  //para errores que no sean de carga eje inicio sesión
  errorcargandoxsesion = false;
  menerror = "";
  enerror = false;
  nom_empresa = "";
  nit_empresa = "";
  cuserid = "";
  mostrarmensaje = false;

  ngOnInit() {
    // console.log('ngOnInit app.componet');
    this.httpc.get("assets/netsolin_ini.json").subscribe(data => {
      NetsolinApp.urlNetsolin = data["url_netsolins"];
      // console.log("ngoninit urlNetsolin:"+NetsolinApp.urlNetsolin );
      localStorage.setItem("urlNetsolin", NetsolinApp.urlNetsolin);
      this.loadhtmlNetsolinbase().then((result) => {
        console.log('retorna promese ',result); 
        if (result){
          this.cargando = false;       
          this.errorcargando = false;
          this.enerror = false;
        } else {
          this.cargando = false;       
          this.errorcargando = true;
          this.menerror = 'Erro conectando con Netsolin y Firebase';
          this.enerror = true;
        }
      }).catch((err) => {
        console.log('erro promesa ', err);
        this.cargando = false;       
        this.errorcargando = true;
        this.menerror = 'Erro conectando con Netsolin y Firebase ' + err.message;
        this.enerror = true;
      });
      // this.loadhtmlmenuslice();
      // this._soporservice.getEmpresaActual(NetsolinApp.oapp.nit_empresa).subscribe((datos: any) => {

      // });
      // init_plugins();
    });
  }

  loadhtmlNetsolinbase(): any {
    return new Promise(resolve => {
      this.cargando = true;
      //  console.log("loadhtmlNetsolinbase  urlNetsolin:"+NetsolinApp.urlNetsolin );
      this.service.getNetsolinhtmlbase().subscribe(
        result => {
          console.log(result);
          if (typeof result.isCallbackError != "undefined") {
            this.errorcargando = true;
            this.errorcargandoxsesion = true;
            console.log("loadhtmlNetsolinbase Error");
            this.cargando = false;
            this.menerror = result.message;
            // return;
            resolve(false);
          }

          console.log("getNetsolinhtmlbase result");
          console.log(result);
          console.log("result.oapp");
          //  console.log(result.oapp);
          let var1 = JSON.stringify(result.oapp);
          // console.log("var 1");
          // console.log(var1);
          localStorage.setItem("OappNetsolin", var1);
          this.oapp = result.oapp;
          this.service.oappNetsolin = result.oapp;
          NetsolinApp.objtitmodulo.titulo = "Soporte";
          NetsolinApp.iniNetsolin = true;
          NetsolinApp.oapp.cuserid = this.oapp.cuserid;
          NetsolinApp.oapp.cuserpsw = this.oapp.cuserpsw;
          NetsolinApp.oapp.nomusuar = this.oapp.nomusuar;
          NetsolinApp.oapp.superusuar = this.oapp.superusuar;
          NetsolinApp.oapp.nom_empresa = this.oapp.nom_empresa;
          NetsolinApp.oapp.nit_empresa = this.oapp.nit_empresa;
          NetsolinApp.oapp.prefijo_sqlbd = this.oapp.prefijo_sqlbd;
          NetsolinApp.oapp.num_version = this.oapp.num_version;
          if (environment.production) {
            NetsolinApp.oapp.en_prod = "ENPROD";
            NetsolinApp.objenvrest.en_prod = "ENPROD";
            NetsolinApp.objenvrestddtabla.en_prod = "ENPROD";
            NetsolinApp.objenvrestsolcomobog.en_prod = "ENPROD";
            NetsolinApp.objenvrestcrud.en_prod = "ENPROD";
          } else {
            NetsolinApp.oapp.en_prod = "NOPROD";
            NetsolinApp.objenvrest.en_prod = "NOPROD";
            NetsolinApp.objenvrestddtabla.en_prod = "NOPROD";
            NetsolinApp.objenvrestsolcomobog.en_prod = "NOPROD";
            NetsolinApp.objenvrestcrud.en_prod = "NOPROD";
            NetsolinApp.oapp.cuserid = "NETSDESAA";
            NetsolinApp.objenvrest.usuario = "NETSDESAA";
            NetsolinApp.objenvrestddtabla.usuario = "NETSDESAA";
            NetsolinApp.objenvrestsolcomobog.usuario = "NETSDESAA";
            NetsolinApp.objenvrestcrud.usuario = "NETSDESAA";
          }

          NetsolinApp.oapp.motor = this.oapp.motor;
          this.nom_empresa = NetsolinApp.oapp.nom_empresa;
          this.nit_empresa = NetsolinApp.oapp.cuserid;
          this.cuserid = NetsolinApp.oapp.nit_empresa;
          //modificar objetos para comunicación con Netsolin con datos que llegan
          // console.log('this.oapp');
          // console.log(this.oapp);
          NetsolinApp.objenvrest.usuario = this.oapp.cuserid;
          NetsolinApp.objenvrest.psw = this.oapp.cuserpsw;
          NetsolinApp.objenvrest.prefijobd = this.oapp.prefijo_sqlbd;
          NetsolinApp.objenvrestddtabla.usuario = this.oapp.cuserid;
          NetsolinApp.objenvrestddtabla.psw = this.oapp.cuserpsw;
          NetsolinApp.objenvrestddtabla.prefijobd = this.oapp.prefijo_sqlbd;
          NetsolinApp.objenvrestsolcomobog.usuario = this.oapp.cuserid;
          NetsolinApp.objenvrestsolcomobog.psw = this.oapp.cuserpsw;
          NetsolinApp.objenvrestsolcomobog.prefijobd = this.oapp.prefijo_sqlbd;
          NetsolinApp.objenvrestcrud.usuario = this.oapp.cuserid;
          NetsolinApp.objenvrestcrud.psw = this.oapp.cuserpsw;
          NetsolinApp.objenvrestcrud.prefijobd = this.oapp.prefijo_sqlbd;

          console.log("nit empre");
          console.log(NetsolinApp.oapp.nit_empresa);
          // const id1 = '830099553';
          // const ref: AngularFirestoreDocument<any> = this.fbDb.collection(`clientes`).doc(id1);
          // ref.get().subscribe(snap => {
          //   if (snap.exists) {
          //     console.log('Existe', id1);
          //   } else {
          //     console.log('no existe crear',id1);
          //   }
          // });
          this.service
            .VeriExisteEmpresaActualFb(NetsolinApp.oapp.nit_empresa)
            .then(() => {
              this.service
                .getEmpreFB(NetsolinApp.oapp.nit_empresa)
                .subscribe((datos: any) => {
                  console.log("datos getEmpreFB ", datos);
                  if (datos) {
                    this.service.cargo_empre = true;
                    this.service.empreFb = datos;
                    console.log(this.service.empreFb);
                    //OJO CAMBIO PARA SOPORTE EN NETSOLIN
                    //verificar usuario actual como consultor este creado
                    console.log('usuario a buscar ',NetsolinApp.oapp.cuserid);
                    this.service
                      .VeriConsultorActualFb(NetsolinApp.oapp.cuserid)
                      .then(() => {
                        //Se suscribe datos usuario
                        console.log('usuario a buscar ',NetsolinApp.oapp.cuserid);
                        this.service
                          .getUsuarFB(NetsolinApp.oapp.cuserid)
                          .subscribe((datos: any) => {
                            console.log("datos getUsuarFB ", datos);
                            if (datos) {
                              this.service.cargo_usuar = true;
                              this.service.usuarFb = datos;
                              console.log(this.service.usuarFb);
                              this.cargaparametrosbasicos().then(() => {
                                resolve(true);
                              });
                            }
                          });
                      });
                  }
                });
            });
          // console.log(NetsolinApp.iniNetsolin);
          // console.log(NetsolinApp.oapp.cuserid);
          // console.log(NetsolinApp.oapp.nomusuar);
          // console.log(NetsolinApp.oapp.superusuar);
          // console.log(NetsolinApp.oapp.nom_empresa);
          // console.log(NetsolinApp.oapp.nit_empresa);
          // console.log('oapp en loadbase');
          // console.log(this.oapp);
          // console.log(NetsolinApp);
          // this.cargando = false;
          // resolve(false);
        },
        error => {
          //  console.log('error loadhtmlNetsolinbase');
          //  console.log(error.message);
          // this.showError(error);
          this.cargando = false;
          this.menerror = error.message;
          this.errorcargando = true;
          this.errorcargandoxsesion = false;
          resolve(false);
        }
      );
    });
  }
  cargaparametrosbasicos(){
    return new Promise(resolve => {
    this.service.cargoparametrosb = false;
    this.service.getNivelescriticidadFB().subscribe((datos:any) =>{
      // console.log('getNivelescriticidadFB leidos ', datos);
      if (datos){
        this.service.nivelescriticidad = datos;
        console.log(this.service.nivelescriticidad);            
        this.service.getProductosFB().subscribe((datos:any) =>{
            // console.log('getProductosFB leidos ', datos);
            if (datos){
              this.service.productosprin = datos;          
              this.service.getClientesFB().subscribe((datos:any) =>{
                // console.log('getClientesFB leidos ', datos);
                if (datos){
                  this.service.clientes = datos;          
                  this.service.getConsultoresFB().subscribe((datos:any) =>{
                    // console.log('getConsultoresFB leidos ', datos);
                    if (datos){
                      this.service.consultores = datos;          
                      this.service.getModulosFB().subscribe((datos:any) =>{
                        // console.log('getModulosFB leidos ', datos);
                        if (datos){
                          this.service.cargoparametrosb = true;        
                          this.service.modulos = datos;          
                          resolve(true);
                          // console.log(this.service.modulos);            
                        }
                      });                          
                    }
                  });     
                }
              });      
            }
          });  
      }
    });
  });
  }

}
