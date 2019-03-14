import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Meta, Title, MetaDefinition } from '@angular/platform-browser';
import { NetsolinApp } from '../../../shared/global';
import { varGlobales } from '../../../shared/varGlobales';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  label: string = '';
  titulopag: string='';
  carcocomponente: boolean =true;
  constructor(
    public vglobal: varGlobales,
    private router: Router,
    public title: Title,
    public meta: Meta
   ) {
    //  console.log('breadcrumbs');
    //  console.log(vglobal);
    this.titulopag=vglobal.titulopag;
    this.getDataRoute()
      .subscribe( data => {

        // console.log( data );

        this.label = data.titulo;
        this.title.setTitle( this.label );

        let metaTag: MetaDefinition = {
          name: 'description',
          content: this.label
        };

        this.meta.updateTag(metaTag);

      });
      
  }

  getDataRoute() {

    return this.router.events
        .filter( evento =>  evento instanceof ActivationEnd)
        .filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null )
        .map( (evento: ActivationEnd) => {
          // console.log('map getdataroute');
          // console.log(evento);
          return evento.snapshot.data });

  }


  ngOnInit() {
  }

}
