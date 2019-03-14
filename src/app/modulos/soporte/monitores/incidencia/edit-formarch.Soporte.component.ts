import { Archivoinc } from '../../modeldatoarchivo';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
// import { AngularFireStorage } from '@angular/fire/storage';
import { FileInfo, FileRestrictions } from '@progress/kendo-angular-upload';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpProgressEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { concat } from 'rxjs/observable/concat';
import { delay } from 'rxjs/operators/delay';

@Component({
    selector: 'kendo-grid-editarch-form',
    styles: [
        'input[type=text] { width: 100%; }'
      ],
      templateUrl: "./edit-formarch.Soporte.component.html",
  })

export class GridEditFormarchComponent  implements OnInit, HttpInterceptor {
    public active = false;
    uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
    uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint  
    public archNombre: string;
    public archImages: Array<any>;
    public editForm: FormGroup;
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url === 'saveUrl') {
          const events: Observable<HttpEvent<any>>[] = [0, 30, 60, 100].map((x) => of(<HttpProgressEvent>{
            type: HttpEventType.UploadProgress,
            loaded: x,
            total: 100
          }).pipe(delay(1000)));
    
          const success = of(new HttpResponse({ status: 200 })).pipe(delay(1000));
          events.push(success);
    
          return concat(...events);
        }
    
        if (req.url === 'removeUrl') {
            return of(new HttpResponse({ status: 200 }));
        }
    
        return next.handle(req);
      }
    // public editForm: FormGroup = new FormGroup({
    //     'nombre': new FormControl('', Validators.required),
    //     'link': new FormControl(''),
    // });
    
    @Input() public isNew = false;

    @Input() public set model(archivoinc: Archivoinc) {
        // this.editForm.reset(archivoinc);

        this.active = archivoinc !== undefined;
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<Archivoinc> = new EventEmitter();
     constructor(private fb: FormBuilder
        //  private storage: AngularFireStorage
         )
     {
    }
    uploadFile(event) {
        const file = event.target.files[0];
        console.log('upload ',file);
        // const filePath = 'name-your-file-path-here';
        // const ref = this.storage.ref(filePath);
        // const task = ref.put(file, { customMetadata: { blah: 'blah' } });
      }
    ngOnInit() {
        this.editForm = this.fb.group({
          nombre: [this.archNombre, [Validators.required, Validators.minLength(4)]],
          myUpload: [this.archImages, [Validators.required]]
        });
    
        this.editForm.valueChanges.subscribe(data => this.onValueChanged(data));
      }
    
      onValueChanged(data?: any) {
        // handle model changes
      }
    
    public onSave(e): void {
        console.log('onSave', e, this.editForm.value, this.uploadSaveUrl, this.uploadRemoveUrl);
        e.preventDefault();
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
}
