import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Casofrecuen } from './modeldatocasofrecuen';
import { NetsolinService } from '../../services/netsolin.service';

@Component({
    selector: 'kendo-grid-casofrecuenedit-form',
    styles: [
        'input[type=text] { width: 100%; }'
      ],
      templateUrl: "./edit-form.casofrecuen.component.html",
  })

export class GridEditFormCasofrecuenComponent {
    public active = false;
    public editForm: FormGroup = new FormGroup({
        'asunto': new FormControl('', Validators.required),
        'verificado': new FormControl(false),
        'detalle': new FormControl('', Validators.required),
        'instrucciones': new FormControl('', Validators.required),
        'productoprin': new FormControl('netwin', Validators.required),
        'publicarcliente': new FormControl(false),
        'modulo': new FormControl('netwin', Validators.required)
    });
    @Input() public isNew = false;

    @Input() public set model(incidente: Casofrecuen) {
        this.editForm.reset(incidente);

        this.active = incidente !== undefined;
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<Casofrecuen> = new EventEmitter(); 
    cargoparametrosb = false;
    nivelescriticidad: any[] = [];
    productosprin: any[] = [];
    modulos: any[] = [];
    constructor(
        public service: NetsolinService,
    ){
        this.cargaparametrosbasicos();
    }
    cargaparametrosbasicos(){
        this.cargoparametrosb = false;
        this.service.getModulosFB().subscribe((datos:any) =>{
          console.log('getModulosFB leidos ', datos);
          if (datos){
            this.modulos = datos;
            console.log(this.modulos);            
            this.service.getProductosFB().subscribe((datos:any) =>{
                console.log('getProductosFB leidos ', datos);
                if (datos){
                  this.cargoparametrosb = true;
                  this.productosprin = datos;
                  console.log(this.productosprin);            
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
        console.log('change 1', value, this.editForm.value,this.editForm, this.editForm.controls);
      }  
}
