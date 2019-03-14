import { Directive, ElementRef, Input,EventEmitter ,Output,HostListener} from '@angular/core';
@Directive({
    selector: '[UpperCase]',
    host: {
        '(input)': 'toUpperCase($event.target.value)',

    }

})
export class UpperCaseTextDirective  {

    @Input('UpperCase') allowUpperCase: boolean;
    @Output() ngModelChange = new EventEmitter();
    @Output() fxChange = new EventEmitter();
     
    constructor(private ref: ElementRef) {
    }

    toUpperCase(value: any) {
        if (this.allowUpperCase){
      
        this.ref.nativeElement.value = value.toUpperCase();
        this.ref.nativeElement.value = this.ref.nativeElement.value.toUpperCase();
        this.ngModelChange.emit(this.ref.nativeElement.value);
        this.fxChange.emit(this.ref.nativeElement.value);
    
        }
        
        
    }
}

// import { Directive, ElementRef, Input } from '@angular/core';
// @Directive({
// selector: '[UpperCase]',
// host: {
//    '(input)': 'toUpperCase($event.target.value)',

// }

// })
// export class UpperCaseTextDirective  {

// @Input('UpperCase') allowUpperCase: boolean;
// constructor(private ref: ElementRef) {
// }

// toUpperCase(value: any) {
//    if (this.allowUpperCase)
//    this.ref.nativeElement.value = value.toUpperCase();
// }

// }