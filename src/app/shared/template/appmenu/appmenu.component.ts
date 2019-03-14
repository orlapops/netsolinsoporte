import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { NetsolinApp } from '../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { NetsolinService } from '../../../services/netsolin.service';

@Component({
  selector: 'app-appmenu',
  providers   : [NetsolinService],  
  templateUrl: './appmenu.component.html',
  styleUrls: ['./appmenu.component.css']
})
export class AppmenuComponent implements OnInit {
  objoapp:any;
  cargoini=false;
  cargomenumonitores = false;
  pmenumonitores = null;
  cargomenumantbas = false;
  pmenumantbas = null;
  mostmonibusquedas = false;

  constructor(
    private service: NetsolinService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
     private httpc: HttpClient    
  ) { }

  ngOnInit() {
       this.objoapp=NetsolinApp.oapp;
       this.cargoini=true;
      this.loadhtmlmenumonitores();
      this.loadhtmlmenumantbasicas();

  }
  loadhtmlmenumantbasicas() {
    this.service.getNetsolinMantbas('MTPB','0')
      .subscribe( result => {
          // console.log(result)
          this.cargomenumantbas = true;
          this.pmenumantbas = result;
          // console.log(this.pmenumantbas);
          
        },error => {
             this.cargomenumantbas = false;
             localStorage.setItem('Errorcargamenumtbas',error.message);
            //  console.log('error loadhtmlmenumessage');
            //  console.log(error.message);
      });        
  }
 loadhtmlmenumonitores() {
    this.service.getNetsolinMonitores()
      .subscribe( result => {
          // console.log(result)
          this.cargomenumonitores = true;
          this.pmenumonitores = result;
          // console.log('pmensajes');
          // console.log(this.pmensajes);
          
        },error => {
             this.cargomenumonitores = false;
             localStorage.setItem('Errorcargamenumonit',error.message);
            //  console.log('error loadhtmlmenumessage');
            //  console.log(error.message);
      });        
  }
  public closebusqueda() {
    this.mostmonibusquedas = false;
  }

  public openbusqueda() {
    this.mostmonibusquedas = true;
  }

}
