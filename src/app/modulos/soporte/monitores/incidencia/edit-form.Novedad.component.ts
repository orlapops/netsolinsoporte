import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Incidente } from '../../modeldatoincidente';
// import { NetsolinService } from '../services/netsolin.service';
import { NetsolinService } from '../../../../services/netsolin.service';
import { Logcaso } from '../../modeldatolog';

@Component({
    selector: 'kendo-grid-editnov-form',
    styles: [
        'input[type=text] { width: 100%; }'
      ],
      templateUrl: "./edit-form.Novedad.component.html",
  })

export class GridEditnovedadFormComponent {
    public active = false;
    public editnovForm: FormGroup = new FormGroup({
        'maninterno': new FormControl(false),
        'cerrarcaso': new FormControl(false),
        'ocasionadopor': new FormControl('Usuario', Validators.required),        
        'causalcliente': new FormControl('NA', Validators.required),        
        'causalnetsolin': new FormControl('NA', Validators.required),        
        'modulo': new FormControl('', Validators.required),        
        'pendiente': new FormControl(''),
        'novedad': new FormControl('', Validators.required)
    });
    @Input() public isNew = false;

    @Input() public set model(logcaso: any) {
        this.editnovForm.reset(logcaso);

        this.active = logcaso !== undefined;
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<Incidente> = new EventEmitter();
    public listocasionadopor: Array<string> = [
        'Usuario', 'Netsolin',' Requerimiento'
    ];
    public listcanalesing: Array<string> = [
        'web', 'skype', 'email','telfijo','celular','whatsapp','otro'
    ];
  
    cargoparametroscierre = false;
    causalesclientes: any[] = [];
    causalesnetsolin: any[] = [];
    modulos: any[] = [];
    constructor(
        public service: NetsolinService,
    ){
        this.cargaparametroscierre();
    }
    cargaparametroscierre(){
        this.cargoparametroscierre = false;
        this.service.getCausalesclientesFB().subscribe((datos:any) =>{
          console.log('getCausalesclientesFB leidos ', datos);
          if (datos){
            this.causalesclientes = datos;
            console.log(this.causalesclientes);            
            this.service.getCausalesnetsolinFB().subscribe((datos:any) =>{
                console.log('getCausalesnetsolinFB leidos ', datos);
                if (datos){
                    this.causalesnetsolin = datos;
                    console.log(this.causalesnetsolin);            
                      this.service.getModulosFB().subscribe((datos:any) =>{
                        console.log('getModulosFB leidos ', datos);
                        if (datos){
                          this.cargoparametroscierre = true;
                          this.modulos = datos;
                          console.log(this.modulos);            
                        }
                      });
                }
              });
      
          }
        });
      
      }
    public onSave(e): void {
        e.preventDefault();
        console.log('onsave',e, this.editnovForm.value);
        this.save.emit(this.editnovForm.value);
        this.active = false;
    }

    public onCancel(e): void {
        e.preventDefault();
        this.closeForm();
    }

    private closeForm(): void {
        this.active = false;
        this.cancel.emit();
    }
    public handleChange(value) {
        const clieact =  this.service.clientes.filter(reg => reg.Nit === value);
        this.editnovForm.value.nom_empre = clieact[0].Empresa;
        console.log('change 1', value, this.editnovForm.value,this.editnovForm, this.editnovForm.controls);

      }
  
}
