// import { EventEmitter } from 'NodeJS';
import { Text } from "@angular/compiler/src/i18n/i18n_ast";
import { error } from "util";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  SimpleChanges
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  ValidatorFn
} from "@angular/forms";

import { Http } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { NetsolinApp } from '../../shared/global';
import { MantbasicaService } from "../../services/mantbasica.service";
import { MantablasLibreria } from "../../services/mantbasica.libreria";


@Component({
  selector: "nets-ccombog",
  template: `
    <nets-buscombog *ngIf="llamabuscar" [ptitulo]="ltitbusqueda" 
    (evenclose)="closebusqueda($event)" [vinibus]="valinibus" placeholder="{{placeholder}}" [objeto]="lobjbusqueda" [pcamporetorna]="camporetbusq"></nets-buscombog>
   
    <div class="input-group">
    <input #inputbus (keyup.enter)="onEnter(inputbus.value)" (blur)="onEnter(inputbus.value)"
        type="text" class="form-control"  [(ngModel)]="buscar"
        placeholder="{{placeholder}}" id="campbus">
        <span class="input-group-btn">
          <button type="button" (click)="openbusqueda()"  name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i></button>
     </span>
    </div>
  `
})


export class Netsbuscombogcampo implements OnInit {
  @ViewChild("inputbus") inputbus: ElementRef;
  // @Input() nomcampo: string;
  @Input() ltitbusqueda: string;
  // @Input() lForm: FormGroup;
  @Input() placeholder: string;
  @Input() lobjbusqueda: string;
  @Input() camporetbusq: string;
  @Input() valueini: any;

  // @Input() valini: string;
  @Output() recibeDatos = new EventEmitter();

  public buscar: string = this.valueini;

  llamabuscar = false;
  valinibus: any;
  enbusqueda = false;
  pasodatos = false;

  constructor(
    private mantbasicaService: MantbasicaService,
    public libmantab: MantablasLibreria,
    private pf: FormBuilder
  ) {}
  ngOnInit() {
    // console.log( 'ngOnInit inputbus html:'+this.inputbus.nativeElement.value);
    // console.log(this.inputbus);
    this.buscar = this.valueini;
  }

  onEnter(value: string) {
    // console.log(this.inputbus);
    this.buscar = value;
    this.pasodatos = true;
    this.recibeDatos.emit({ cbuscar: value });
  }
  lanzarFunc(event) {
    console.log( 'lanzarFunc inputbus html:'+this.inputbus.nativeElement.value);
    console.log(this.buscar);
    this.pasodatos = true;
    this.recibeDatos.emit({ cbuscar: this.buscar });
  }
  //cambia variable para que abra ventana de busqueda de referencia
  openbusqueda() {
    var lcontrolcampo: any;
    //leer lo digitato en referencia para que sea valor ini a buscar
    //   lcontrolcampo = this.lForm.controls[this.nomcampo];
    //   this.valinibus = lcontrolcampo.value;
    this.valinibus = this.buscar;
    this.llamabuscar = true;
    this.enbusqueda = false;
  }
  public closebusqueda(valllega) {
    //asignar el valor retornado a campo cod_refven
    if (typeof valllega != "undefined" && valllega != "") {
      this.buscar = valllega;
      // this.libmantab.asignaValorcampoform(this.lForm, "cod_refven", valllega)
    }
    this.enbusqueda = true;
    this.llamabuscar = false;
    this.inputbus.nativeElement.focus();
  }

  ngOnChanges(changes: SimpleChanges) {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    //   console.log( 'ngOnChanges inputbus html:'+this.inputbus.nativeElement.value);
    // //   console.log(this.inputbus);
    //   console.log("ngOnChanges listar.comp");
    // console.log('buscar:'+this.buscar);
  }
  ngDoCheck() {
    // console.log("ngDoCheck listar.comp");
    // console.log( 'ngDoCheck inputbus html:'+this.inputbus.nativeElement.value);
    // // console.log(this.inputbus);
    // console.log('buscar:'+this.buscar);
    // console.log('valueini:'+this.valueini);
    // console.log('enbusqueda:'+this.enbusqueda);
    // if (!this.enbusqueda){
    //     this.buscar = this.valueini;
    //     this.enbusqueda = false;
    // }
  }
  ngAfterContentInit() {
    // console.log("ngAfterContentInit listar.comp");
    // console.log('buscar:'+this.buscar);
  }
  ngAfterContentChecked() {
    // console.log("ngAfterContentChecked listar.comp");
    // console.log( 'ngAfterContentChecked inputbus html:'+this.inputbus.nativeElement.value);
    // console.log(this.inputbus);
    // console.log('buscar:'+this.buscar);
  }
  ngAfterViewInit() {
    // console.log("ngAfterViewInit listar.comp");
    // console.log('buscar:'+this.buscar);
  }

  ngAfterViewChecked() {
    // console.log( 'ngAfterViewChecked inputbus html:'+this.inputbus.nativeElement.value);
    // console.log(this.inputbus);
    // console.log("ngAfterViewChecked listar.comp");
    // console.log('buscar:'+this.buscar);
    // console.log('valueini:'+this.valueini);
  }
  ngOnDestroy() {
    // console.log("ngOnDestroy listar.comp");
    // console.log('buscar:'+this.buscar);
  }
}
