import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import { AutenticacionService } from '../../../shared/servicios/autenticacion.service';
import { NetsolinService } from '../../../services/netsolin.service';
import { NetsolinApp } from '../../../shared/global';
import { varGlobales } from '../../../shared/varGlobales';



@Component({
  selector: 'menu-tbas',
  styleUrls: ['./menumtablas.component.css'],
  templateUrl: './menumtablas.component.html'
})

export class MenuTbasComponent {
  resultados = false;
  resultadosmod = false;
  enerror = false;
  message="";
  aregsmenu: any[] = [];
  resultadostu = false;
  aregsmenutu: any[] = [];
  netsmodulos = "General,0,Contabilidad,1,Ventas,10";
  netsmoduluact = '21'
  constructor(
    // private autService: AutenticacionService,
    public vglobal: varGlobales,
    private router: Router,
    private service: NetsolinService,              
    private httpc: HttpClient,
    private activatedRouter: ActivatedRoute) {
      this.vglobal.mostrarbreadcrumbs = false;

  }
  ngOnInit() {
    NetsolinApp.objtitmodulo.titulo="titulo header";
    this.cargaModulos();
  }
    
  cargaModulos(){
    this.resultadosmod = false;
    // se debe asegurar que se ha leido archivo con url o fallara el servicio
    this.httpc.get('assets/netsolin_ini.json').subscribe(data => {
      NetsolinApp.urlNetsolin = data['url_netsolins'];
      //carga menu mantenimiento de tablas
        this.service.getNetsolinMantbas('MOD',this.netsmoduluact)
          .subscribe( result => {
            //  console.log("inicializando menu MODULOS ");
              // console.log(result);
              this.netsmodulos = result.modulos;
              this.resultadosmod = true;
              // console.log(this.netsmodulos);
              this.cargaMenuTablas();
              /***************************** */
            }, error => {
              this.showError(error.message);
          });                 
    });
  }

  cargaMenuTablas(){
    this.resultados = false;
    // se debe asegurar que se ha leido archivo con url o fallara el servicio
    this.httpc.get('assets/netsolin_ini.json').subscribe(data => {
      NetsolinApp.urlNetsolin = data['url_netsolins'];
      //carga menu mantenimiento de tablas
        this.service.getNetsolinMantbas('MTPB',this.netsmoduluact)
          .subscribe( result => {
            //  console.log("inicializando menu cargaMenuTablas ");
              // console.log(result);
              this.aregsmenu = result;
              this.resultados = true;
              // console.log(this.aregsmenu);
              this.service.getNetsolinMantbas('MTUB',this.netsmoduluact)
              .subscribe( result => {
                  //     console.log("inicializando menu usuario");
                  //  console.log(result);
                  this.aregsmenutu = result;
                  this.resultadostu = true;
                  //  console.log(this.aregsmenutu);
                  /***************************** */
                }, error => {
                  this.showError(error.message);
                  // if (error.status == 400) {
                  //   this.showError(error.statusText);
                  //  } else {
                  //   this.showError(error.message);
                  //  }
                   console.log('error');
                  // console.log(error);
                   console.log(error.message);
                  // console.log(error.statusText);
                  
              });        
    
              /***************************** */
            }, error => {
              this.showError(error.message);
          });                 
    });
  }

  verListnum(valor){
    // console.log("verListnum Modulo");
     this.netsmoduluact = valor.value;     
     this.cargaMenuTablas();
    //  console.log(this.netsmoduluact);
    }
    showError(pmensaje){
      this.enerror=true;
      this.message=pmensaje;
    }
  isAuth() {
    //  return this.autService.isAuthenticated();
  }

  onLogout() {
      // this.autService.logout();
      this.router.navigate(['/inicio'])

  }
  
}

