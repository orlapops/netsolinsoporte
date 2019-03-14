import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Incidente } from '../../modeldatoincidente';
// import { NetsolinService } from '../services/netsolin.service';
import { NetsolinService } from '../../../../services/netsolin.service';
import { Logcaso } from '../../modeldatolog';

@Component({
    selector: 'kendo-grid-editnovrequer-form',
    styles: [
        'input[type=text] { width: 100%; }'
      ],
      templateUrl: "./edit-form.Novedadrequer.component.html",
  })

export class GridEditnovedadrequerFormComponent {
    public active = false;
    public editnovForm: FormGroup = new FormGroup({
        'maninterno': new FormControl(false),
        'entregado': new FormControl(false),
        'etapa': new FormControl('', Validators.required),        
        'terminaetapa': new FormControl(false),
        'novedad': new FormControl('', Validators.required)
    });

    @Input() public isNew = false;

    @Input() public set model(logcaso: any) {
        this.editnovForm.reset(logcaso);

        this.active = logcaso !== undefined;
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<Incidente> = new EventEmitter();
    public listetapas: Array<string> = [
        '0 Inicial', '1 Diseño','2 Desarrollo','3 Pruebas','4 Entrega'
    ];
 
    constructor(
        public service: NetsolinService,
    ){
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
      }
  
}
