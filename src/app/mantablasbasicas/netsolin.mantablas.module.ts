import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

import '@progress/kendo-angular-intl/locales/es/all';

import { SharedModule } from '../shared/shared.module';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AddregtbasicaComponent } from './tbasica/adicionar/adicionar.component';
import { EditregtbasicaComponent } from './tbasica/editar/editar.component';
import { VerregtbasicaComponent } from './tbasica/ver/ver.component';
import { ListbasicamodalComponent } from './tbasica/listar/listamant.modal.component';
import { ListbasicaComponent } from './tbasica/listar/listar.component';
import { ListbusquedamodalComponent } from './tbasica/listar/listbusqueda.modal.component';
import { MenuTbasComponent } from './tbasica/menumtablas/menumtablas.component';
import { MantBasicaComponent } from './tbasica/mantbasica.component';
import { Netsadmintablabasicamodal } from './tbasica/netstbasicamodal.componet';
import { AddregterceroComponent } from './terceros/adicionar/adicionar.component';
import { EditregterceroComponent } from './terceros/editar/editar.component';
import { VerregterceroComponent } from './terceros/ver/ver.component';
import { Netsmantterceromodal } from './terceros/netsmantterceromodal.componet';
import { NetsolinLibreriasModule } from '../netsolinlibrerias/netsolin.librerias.module';
import { varGlobales } from '../shared/varGlobales';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        SharedModule,
        FormsModule,
        BrowserModule, BrowserAnimationsModule, DropDownsModule,
        NoopAnimationsModule,
        InputsModule,
        ReactiveFormsModule,    
        ButtonsModule,
        DropDownsModule,
        AutoCompleteModule,    
        ComboBoxModule,
        DialogModule,
        LayoutModule,
        GridModule,   
        NetsolinLibreriasModule,

    ],
    declarations: [
        AddregtbasicaComponent,
        EditregtbasicaComponent,
        VerregtbasicaComponent,
        ListbasicamodalComponent,
        ListbasicaComponent,
        ListbusquedamodalComponent,
        MenuTbasComponent,
        MantBasicaComponent,
        Netsadmintablabasicamodal,
        AddregterceroComponent,
        EditregterceroComponent,
        VerregterceroComponent,
        Netsmantterceromodal
    ],
    exports: [
        AddregtbasicaComponent,
        EditregtbasicaComponent,
        VerregtbasicaComponent,
        ListbasicamodalComponent,
        ListbasicaComponent,
        ListbusquedamodalComponent,
        MenuTbasComponent,
        MantBasicaComponent,
        Netsadmintablabasicamodal,
        AddregterceroComponent,
        EditregterceroComponent,
        VerregterceroComponent,
        Netsmantterceromodal
    ],
    providers: [
        varGlobales
    ],

})
export class NetsolinMantablasModule { }
