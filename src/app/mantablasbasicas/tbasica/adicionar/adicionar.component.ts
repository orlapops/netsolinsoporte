import { Component, VERSION, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Router, ActivatedRoute } from '@angular/router';
import { MantbasicaService } from '../../../services/mantbasica.service';
import { MantablasLibreria } from '../../../services/mantbasica.libreria';
import { NetsolinApp } from '../../../shared/global';
import { UpperCaseTextDirective } from '../../../netsolinlibrerias/directive/upper-case.directive';
import { varGlobales } from '../../../shared/varGlobales';

@Component({
  selector: 'mtbas-addtbasica',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.css']
})
export class AddregtbasicaComponent implements OnInit {
  a=UpperCaseTextDirective
  @Input() vparcaptura: string;
  //campo por defecto si tiene el formulario a asignar
  @Input() pcampoxdefecto: string;
  //valor a asignar al campo por defecto si tiene el formulario a asignar
  @Input() pvalxdefecto: any;
  
  ptablab: string;
  paplica: string;
  pcampollave: string;
  pclase_nbs: string;
  pclase_val: string;
  pcamponombre: string;
  enerror = false;
  grabo = false;
  enlistaerror = false;
  inicializado = false;
  listaerrores: any[] = [];
  message = "";
  title: string;
  subtitle = '(Adicionar Registro)';
  tablaForm: FormGroup;
  tablaFormOrig: FormGroup;
  regTabla: any;
  camposform: any;
  varParam: string;
  rutamant: string;
  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false; 

  // verangular:string;

  constructor(private mantbasicaService: MantbasicaService,
    public libmantab: MantablasLibreria,
    public vglobal: varGlobales,
    private activatedRouter: ActivatedRoute,
    private pf: FormBuilder,    
    ) {
    // this.verangular = `Angular! v${VERSION.full}`;
  }
  ngOnInit() {
    // console.log("ngOniit vparcaptura:"+this.vparcaptura);
    // console.log("ngOnInit adicionar tabla basica");
    // console.log("this.pcampoxdefecto:"+this.pcampoxdefecto);
    // console.log("this.pvalxdefecto:"+this.pvalxdefecto);

    this.activatedRouter.params
      .subscribe(parametros => {
        // console.log("ngOniit por parametros:");
        if (this.vparcaptura) {
          this.varParam = this.vparcaptura;
        } else {
          this.varParam = parametros['varParam'];
        }
        let lvart: any;
        lvart = localStorage.getItem(this.varParam);
        if (lvart) {
          // console.log('vienen parametros');
        } else {
          // console.log('No vienen parametros');
        }
        let lobjpar = JSON.parse(lvart);
        this.title = lobjpar.titulo;
        this.rutamant = lobjpar.rutamant;
        this.vglobal.titulopag ='Adicionar: '+this.title;
        this.vglobal.rutaanterior = '/' + this.rutamant;
        this.vglobal.titrutaanterior='Listado';
        this.vglobal.mostrarbreadcrumbs = true;
        // console.log('this.vglobal adicionar');
        // console.log(this.vglobal);
        
        this.paplica = lobjpar.aplica;
        this.ptablab = lobjpar.tabla;
        this.pcampollave = lobjpar.campollave;
        this.pcamponombre = lobjpar.camponombre;
        this.pclase_nbs = lobjpar.clase_nbs;
        this.pclase_val = lobjpar.clase_val;
        this.tablaFormOrig = this.pf.group({});
        let lvar = '';
        lvar = localStorage.getItem("DDT" + this.ptablab);
        this.camposform = JSON.parse(lvar);
        for (var litemobj of this.camposform) {
            //Crear campo formulario con valor por default
            let vardefa: any;
            if (litemobj.type == 'text' && litemobj.val_defaul.length != 0) {
              var strvd = litemobj.val_defaul.toUpperCase();
              if (strvd.substring(0, 5) != 'OAPP.' && strvd.substring(0, 9) != 'THISFORM.') {
                vardefa = eval(litemobj.val_defaul);
              } else {
                vardefa = '';
              }
            } else if (litemobj.type == 'checkbox' && litemobj.val_defaul.length != 0) {
              vardefa = litemobj.val_defaul == 'true', true, false;
            } else if (litemobj.type == 'autonumber') {
              // console.log('adciionar autonumera dando valor por default');
              vardefa = Math.floor(Math.random() * 99999999);
              // console.log(vardefa);
              // vardefa = 1;
            }
            //si tiene campo y valor por defecto asignar            
            if (litemobj.name==this.pcampoxdefecto){
              // console.log('cambia valor por defecto porpcampoxdefectop')
              vardefa = this.pvalxdefecto;
            }

            // let lcampformctrl = new FormControl(litemobj.val_defaul);
            let lcampformctrl = new FormControl(vardefa);
            //adicionar validacion si es obligatorio
            var avalida = [];
            if (litemobj.mensaje_er.length == 0) {
              litemobj.mensaje_er = 'Valor Invalido';
            }
            if (litemobj.obliga) {
              avalida.push(Validators.required);
              //   lcampformctrl.setValidators([Validators.required])
            };
            if (litemobj.type == 'text' && litemobj.longitud > 0) {
              avalida.push(Validators.maxLength(litemobj.longitud));
            }
            if (avalida.length > 0 && litemobj.type != 'autonumber') {
              lcampformctrl.setValidators(avalida);
            }
            //Se debe deshabilitar si no permite adicionar
            if (!litemobj.per_adicionar || litemobj.type === 'autonumber') {
              lcampformctrl.disable();
            }
            this.tablaFormOrig.addControl(litemobj.name, lcampformctrl);
        };
        this.tablaForm = this.tablaFormOrig;
        this.onChanges();
        this.inicializaForm();
        //  console.log('Formulario despues de init:');
        //  console.log(this.tablaForm);
      });

  }

  //Inicializar el formulario con valores por defecto adicionales a los que vienen del diccionario
  inicializaForm() {
    //PAra ver ejemplo ver terceros
    this.inicializado = true;
  }
  //Se usa para detectar cambios en un campo especifico ejemplo al validar un campo hacer 
  //que se haga algo adicional. En terceros al validar el tercero dejar este mismo en nit si esta vacio
  onChanges(): void {
    // Ver ejemplo terceros
  }

  onSubmit() {
    this.enerror = false;
    this.grabo = false;
    this.enlistaerror = false;
    this.grabando = true;
    this.regTabla = this.saveregTabla();
    this.mantbasicaService.postregTabla(this.regTabla, this.ptablab, this.paplica, this.pcampollave, this.pclase_nbs, this.pclase_val, this.pcamponombre)
      .subscribe(newpro => {
        this.grabando = false;
        // console.log('grabo registro');
        // console.log(newpro);
        var result0 = newpro[0];
        // console.log(result0);
        if (typeof (newpro.isCallbackError) != "undefined") {
          this.grabo = false;
          this.enlistaerror = true;
          this.listaerrores = newpro.messages;
        } else {
          this.grabo = true;
          this.tablaForm.reset();
          this.showMensaje('Se adiciono registro.');
        }
      }, error => {
        this.grabando = false;
        this.grabo = false;
        this.showError(error);
      })
  }

  saveregTabla() {
    //hacer copia de form captura para grabar antes habilitar campos
    var tablaFormGraba: FormGroup;
    tablaFormGraba =   this.tablaForm;
    //activar todos los campos para que pase en la grabación
    for (var litemobj of this.camposform) {
      this.libmantab.enableCampoform(tablaFormGraba,litemobj.name);
   }
    const saveregTabla = tablaFormGraba.value;
    return saveregTabla;
    
  }

  retornaRuta() {
    // console.log(this.rutamant);
    return '/' + this.rutamant;
  }
  // message = new MensajeError;

  showError(msg) {
    this.message = msg;
    this.enerror = true;
    // console.log(this.message);
  }

  showMensaje(msg) {
    this.message = msg;
    this.enerror = false;
    // console.log(this.message);
  }

}
