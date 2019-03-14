import { Component, OnInit, Input } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HttpClient } from "@angular/common/http";

import { MantbasicaService } from "../../../services/mantbasica.service";
import { MantablasLibreria } from "../../../services/mantbasica.libreria";
import { NetsolinApp } from "../../../shared/global";
import { UpperCaseTextDirective } from "../../../netsolinlibrerias/directive/upper-case.directive";
import { varGlobales } from "../../../shared/varGlobales";

@Component({
  selector: "mtbas-editttercero",
  templateUrl: "./editar.component.html",
  styleUrls: ["./editar.component.css"]
})
export class EditregterceroComponent implements OnInit {
  @Input() vparcaptura: string;
  @Input() vid: any;
  ptablab: string;
  paplica: string;
  pcampollave: string;
  pclase_nbs: string;
  pclase_val: string;
  pcamponombre: string;
  title: string;
  subtitle = "(Editar Registro)";
  confmodifica = false;
  tablaForm: FormGroup;
  tablaFormOrig: FormGroup;
  regTabla: any;
  camposform: any;
  varParam: string;
  rutamant: string;
  id: string;
  enerror = false;
  enlistaerror = false;
  listaerrores: any[] = [];
  grabo = false;
  message = "";
  cargando = false;
  resultados = false;
  //indicador si esta grabando para que no ejecute onchange y no muestre algunos campos
  grabando = false; 

  constructor(
    private mantbasicaService: MantbasicaService,
    public vglobal: varGlobales,
    private libmantab: MantablasLibreria,
    private pf: FormBuilder,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private httpc: HttpClient
  ) {}

  ngOnInit() {
    this.activatedRouter.params.subscribe(parametros => {
      // this.varParam = parametros['varParam'];
      // this.id = parametros['id'];
      if (this.vparcaptura) {
        this.varParam = this.vparcaptura;
      } else {
        this.varParam = parametros["varParam"];
      }
      // this.id = parametros['id'];
      if (this.vparcaptura) {
        this.id = this.vid;
      } else {
        this.id = parametros["id"];
      }
      let lvart: any;
      lvart = localStorage.getItem(this.varParam);
      let lobjpar = JSON.parse(lvart);
      this.title = lobjpar.titulo;
      this.rutamant = lobjpar.rutamant;
      this.vglobal.titulopag = "Editar: " + this.title;
      this.vglobal.rutaanterior = "/" + this.rutamant;
      this.vglobal.titrutaanterior = "Listado";
      this.vglobal.mostrarbreadcrumbs = true;

      this.paplica = lobjpar.aplica;
      this.ptablab = lobjpar.tabla;
      this.pcampollave = lobjpar.campollave;
      this.pcamponombre = lobjpar.camponombre;
      this.pclase_nbs = lobjpar.clase_nbs;
      this.pclase_val = lobjpar.clase_val;
      this.tablaFormOrig = this.pf.group({});
      let lvar = "";
      lvar = localStorage.getItem("DDT" + this.ptablab);
      this.camposform = JSON.parse(lvar);
      for (var litemobj of this.camposform) {
        //Crear campo formulario con valor por default
        let lcampformctrl = new FormControl("");
        //adicionar validacion si es obligatorio
        var avalida = [];
        if (litemobj.mensaje_er.length == 0) {
          litemobj.mensaje_er = "Valor Invalido";
        }
        if (litemobj.obliga) {
          avalida.push(Validators.required);
          //   lcampformctrl.setValidators([Validators.required])
        }
        if (litemobj.type == "text" && litemobj.longitud > 0) {
          avalida.push(Validators.maxLength(litemobj.longitud));
        }
        if (avalida.length > 0) {
          lcampformctrl.setValidators(avalida);
        }
        //Se debe deshabilitar si no permite modificar o es campo llave
        var acllave = lobjpar.campollave.split(",");
        if (acllave.length > 1) {
          if (
            !litemobj.per_modificar ||
            acllave[0] == litemobj.name ||
            acllave[1] == litemobj.name
          ) {
            lcampformctrl.disable();
          }
        } else {
          if (!litemobj.per_modificar || lobjpar.campollave == litemobj.name) {
            lcampformctrl.disable();
          }
        }
        this.tablaFormOrig.addControl(litemobj.name, lcampformctrl);
      }
      this.tablaForm = this.tablaFormOrig;
      this.onChanges();
      this.mantbasicaService
        .getregTabla(
          this.id,
          this.ptablab,
          this.paplica,
          this.pcampollave,
          this.pclase_nbs,
          this.pclase_val,
          this.pcamponombre
        )
        .subscribe(
          regTabla => {
            var result0 = regTabla[0];
            if (typeof result0 != "undefined") {
              this.enlistaerror = true;
              this.listaerrores = regTabla;
            } else {
              this.asignaValores(regTabla);
            }
          },
          error => {
            this.showError(error);
          }
        );
    });
  }

  asignaValores(preg: any) {
    this.cargando = true;
    this.resultados = false;
    this.libmantab.asignaValoresform(
      preg,
      this.tablaForm,
      this.camposform,
      false
    );
    this.inicializaForm();
  }
  //Inicializar el formulario con validaciones adicionales
  inicializaForm() {
    //Dejar clase iden en 1 nit y nombres y apeelidos en blanco y desabilitados
    var lcontrol: any;
    var avalida = [];
    var lcontrol: any;
    var lvalor: string;
    var lvaloresempre: string;
    lcontrol = this.tablaForm.get("cod_tercer");
    //hacer que el control dispare el onchage solo cuando pierda el foco
    lcontrol._updateOn = "blur";
    avalida.push(Validators.required);
    //se pueden incluir otros como long minima etc ver documenta
    // avalida.push(Validators.minLength(3));
    this.libmantab.defineValidaCampo(this.tablaForm, "nit", avalida);
    //como es el mismo para otros requeridos unicamente se llama con mismo arreglao avalida
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_pais", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_ciudad", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "direccion", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "telefono", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "tipo_contri", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "regimen_i", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "ciudad_i", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "tipo_civa", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "regimen", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "tipo_cica", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "cod_acteic", avalida);
    this.libmantab.defineValidaCampo(this.tablaForm, "conta_cobr", avalida);
    //dependiendo de la clas_iden controlar validacion de nombre y apellidos
    lcontrol = this.tablaForm.get("clase_iden");
    lvalor = lcontrol.value;
    lvaloresempre = "14";
    if (lvaloresempre.indexOf(lvalor) >= 0) {
      lcontrol = this.tablaForm.get("primer_ape");
      this.tablaForm.get("primer_ape").disable();
      lcontrol.clearValidators();
      lcontrol.setValue("");
      lcontrol = this.tablaForm.get("segundo_ape");
      this.tablaForm.get("segundo_ape").disable();
      lcontrol.setValue("");
      lcontrol = this.tablaForm.get("primer_nom");
      this.tablaForm.get("primer_nom").disable();
      lcontrol.clearValidators();
      lcontrol.setValue("");
      lcontrol = this.tablaForm.get("segundo_nom");
      this.tablaForm.get("segundo_nom").disable();
      lcontrol.setValue("");
    } else {
      lcontrol = this.tablaForm.get("primer_ape");
      lcontrol.setValidators(avalida);
      this.tablaForm.get("primer_ape").enable();
      this.tablaForm.get("segundo_ape").enable();
      lcontrol = this.tablaForm.get("primer_nom");
      lcontrol.setValidators(avalida);
      this.tablaForm.get("primer_nom").enable();
      this.tablaForm.get("segundo_nom").enable();
    }
    this.cargando = false;
    this.resultados = true;
  }
  //Si cambia el codigo del tercero llenar el nit con el mismo si este esta vacio
  onChanges(): void {
    // console.log("onChanges");
    this.tablaForm.get("cod_tercer").valueChanges.subscribe(val => {
      var lcontrol: any;
      lcontrol = this.tablaForm.get("nit");
      if (lcontrol.value) {
        // console.log("set val lleno: "+lcontrol.value);
      } else {
        // console.log("set val vacio: "+lcontrol.value);
        lcontrol.setValue(val);
      }
    });
  }

  retornaRuta() {
    // console.log(this.rutamant);
    return "/" + this.rutamant;
  }

  onSubmit() {
    this.enerror = false;
    this.grabo = false;
    this.grabando = true;
    this.regTabla = this.saveregTabla();
    this.mantbasicaService
      .putregTabla(
        this.regTabla,
        this.id,
        this.ptablab,
        this.paplica,
        this.pcampollave,
        this.pclase_nbs,
        this.pclase_val,
        this.pcamponombre
      )
      .subscribe(
        newpro => {
          this.grabando = false;
          var result0 = newpro[0];
          // console.log(result0);
          if (typeof newpro.isCallbackError != "undefined") {
            this.grabo = false;
            this.confmodifica = false;
            this.enlistaerror = true;
            this.listaerrores = newpro.messages;
          } else {
            this.grabo = true;
            this.confmodifica = true;
            this.showMensaje("Se modifico registro.");
            // this.router.navigate(['/' + this.rutamant])
          }
        },
        error => {
          this.grabando = false;
          this.confmodifica = false;
          this.grabo = false;
          this.showError(error);
        }
      );
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

  //retorna si el campo es el campo llave vcerdadero para que sea disabled el campo llave
  isDisabled(pnomcampo: string) {
    if (this.pcampollave == pnomcampo) {
      return true;
    } else {
      return false;
    }
  }
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

  verCombocod_pais(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
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

  verCombocod_ciudad(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
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

  verCombociudad_i(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
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

  verCombocod_acteic(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
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

  verListclase_iden(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: string;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
    //Cambios inactivar apellidos y nombre si es Persona juridida
    var lvaloresempre: string;
    var lcontrol: any;
    var avalida = [];
    avalida.push(Validators.required);
    lvaloresempre = "14";
    if (lvaloresempre.indexOf(lvalor) >= 0) {
      lcontrol = this.tablaForm.get("primer_ape");
      this.tablaForm.get("primer_ape").disable();
      lcontrol.clearValidators();
      lcontrol.setValue("");
      lcontrol = this.tablaForm.get("segundo_ape");
      this.tablaForm.get("segundo_ape").disable();
      lcontrol.setValue("");
      lcontrol = this.tablaForm.get("primer_nom");
      this.tablaForm.get("primer_nom").disable();
      lcontrol.clearValidators();
      lcontrol.setValue("");
      lcontrol = this.tablaForm.get("segundo_nom");
      this.tablaForm.get("segundo_nom").disable();
      lcontrol.setValue("");
    } else {
      lcontrol = this.tablaForm.get("primer_ape");
      lcontrol.setValidators(avalida);
      this.tablaForm.get("primer_ape").enable();
      this.tablaForm.get("segundo_ape").enable();
      lcontrol = this.tablaForm.get("primer_nom");
      lcontrol.setValidators(avalida);
      this.tablaForm.get("primer_nom").enable();
      this.tablaForm.get("segundo_nom").enable();
    }
  }

  verListtipo_contri(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
  }

  verListregimen_i(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
  }

  verListtipo_civa(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
  }

  verListregimen(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
  }

  verListtipo_cica(event, pcamporecibe, pcamporetorna) {
    var lcontrolcampo: any;
    var lvalor: any;
    var lncampo: string;
    lcontrolcampo = this.tablaForm.controls[pcamporecibe];
    lvalor = event.value;
    lcontrolcampo.setValue(lvalor);
  }

  public close() {
    this.confmodifica = false;
  }

  public open() {
    this.confmodifica = true;
  }
}
