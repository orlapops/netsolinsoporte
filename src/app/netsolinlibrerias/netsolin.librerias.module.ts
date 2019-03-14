import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { Labelinfo } from './labelinfo/labelinfo';

import { IncrementadorComponent } from '../netsolinlibrerias/incrementador/incrementador.component';
import { GraficoComponent } from '../netsolinlibrerias/grafico/grafico.component';


//Kendo
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
// Import the ButtonsModule
import { ButtonsModule } from '@progress/kendo-angular-buttons';
// Imports the AutoComplete module
import { AutoCompleteModule } from '@progress/kendo-angular-dropdowns';
// Imports the ComboBox module
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';
import '@progress/kendo-angular-intl/locales/es/all';


import { Solsearch } from './solsearch/solsearch';
import { Filtroanomes } from './filtroanomes/filtroanomes';
import { NetscomboboxComponent } from './netscombobox/netscombobox.component';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Netscombog } from './netscombog/netscombog.component';
import { Netslistnum } from './netslistnum/netslistnum.component';
import { UpperCaseTextDirective } from './directive/upper-case.directive';
import { Netsbuscombog } from './netsbuscombog/netsbuscombog.componet';
import { Netsbuscombogcampo } from './netsbuscombog/netsbuscombogcampo.componente';
import { ListbusquedacomboglComponent } from './netsbuscombog/netsbuscomboglista.component';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { MonedaPipe } from './pipe/FormatoMoneda.pipe';
@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        SharedModule,
        FormsModule,
        ChartsModule,
        BrowserModule, BrowserAnimationsModule, DropDownsModule,
        ReactiveFormsModule,    
        ButtonsModule,
        DropDownsModule,
        AutoCompleteModule,    
        ComboBoxModule,
        DialogModule,
        LayoutModule,
        GridModule,   

    ],
    declarations: [
        Labelinfo,
        IncrementadorComponent,
        GraficoComponent,
        Solsearch,
        Filtroanomes,
        NetscomboboxComponent,
        Netscombog,
        Netslistnum,
        UpperCaseTextDirective,
        Netsbuscombog,
        Netsbuscombogcampo,
        ListbusquedacomboglComponent,
        SafeUrlPipe,
        MonedaPipe,
    ],
    exports: [
        Labelinfo,
        IncrementadorComponent,
        GraficoComponent,
        NetscomboboxComponent,
        Netscombog,
        Netslistnum,
        UpperCaseTextDirective,
        Netsbuscombog,
        Netsbuscombogcampo,
        ListbusquedacomboglComponent,
        Solsearch,
        Filtroanomes,
        MonedaPipe,
    ],
    providers: [
    ],

})
export class NetsolinLibreriasModule { }
