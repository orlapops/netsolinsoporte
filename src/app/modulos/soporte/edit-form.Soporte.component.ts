import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Incidente } from './modeldatoincidente';
import { NetsolinService } from '../../services/netsolin.service';

@Component({
    selector: 'kendo-grid-edit-form',
    styles: [
        'input[type=text] { width: 100%; }'
      ],
      templateUrl: "./edit-form.Soporte.component.html",
  })

export class GridEditFormComponent {
    public active = false;
    public editForm: FormGroup = new FormGroup({
        'nit_empre': new FormControl('', Validators.required),
        'nom_empre': new FormControl(''),        
        'nomusuarreporta': new FormControl('', Validators.required),
        'asunto': new FormControl('', Validators.required),
        'detalle': new FormControl('', Validators.required),
        'productoprin': new FormControl('netwin', Validators.required),
        'prioridad': new FormControl('Baja', Validators.required),
        'canaling': new FormControl('web', Validators.required),
        'nivelcriticidad': new FormControl('05', Validators.required)
    });
    @Input() public isNew = false;

    @Input() public set model(incidente: Incidente) {
        this.editForm.reset(incidente);

        this.active = incidente !== undefined;
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<Incidente> = new EventEmitter();
    public listprioridades: Array<string> = [
        'Baja', 'Media', 'Alta'
    ];
    public listcanalesing: Array<string> = [
        'web', 'skype', 'email','telfijo','celular','whatsapp','otro'
    ];
  
    cargoparametrosb = false;
    nivelescriticidad: any[] = [];
    productosprin: any[] = [];
    constructor(
        public service: NetsolinService,
    ){
        this.cargaparametrosbasicos();
    }
    cargaparametrosbasicos(){
        this.cargoparametrosb = false;
        this.service.getNivelescriticidadFB().subscribe((datos:any) =>{
          console.log('getNivelescriticidadFB leidos ', datos);
          if (datos){
            this.nivelescriticidad = datos;
            console.log(this.nivelescriticidad);            
            this.service.getProductosFB().subscribe((datos:any) =>{
                console.log('getProductosFB leidos ', datos);
                if (datos){
                  this.cargoparametrosb = true;
                  this.productosprin = datos;
                  console.log(this.nivelescriticidad);            
                }
              });
      
          }
        });
      
      }
    public onSave(e): void {
        e.preventDefault();
        console.log('onsave',e, this.editForm.value);
        this.save.emit(this.editForm.value);
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
        this.editForm.value.nom_empre = clieact[0].Empresa;
        console.log('change 1', value, this.editForm.value,this.editForm, this.editForm.controls);

      }
  
}
