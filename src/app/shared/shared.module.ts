import {LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { BreadcrumbsComponent } from './template/breadcrumbs/breadcrumbs.component';
import { AppheaderComponent } from './template/appheader/appheader.component';
import { AppmenuComponent } from './template/appmenu/appmenu.component';
import { AppfooterComponent } from './template/appfooter/appfooter.component';
import { AppsettingsComponent } from './template/appsettings/appsettings.component';
// import { AutenticacionService } from './servicios/autenticacion.service';
// import { GuardService } from './servicios/guard.service';
// import { HeaderComponent } from './headerpages/header.component';

//Kendo
// Import the ButtonsModule
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
// Imports the AutoComplete module
import { AutoCompleteModule } from '@progress/kendo-angular-dropdowns';
// Imports the ComboBox module
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';

import '@progress/kendo-angular-intl/locales/es/all';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppBootstrapModule } from '../app-boostrap/app-boostrap.module';
import { NopagesfoundComponent } from './nopagesfound/nopagesfound.component';
import { varGlobales } from './varGlobales';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        HttpClientModule, 
        HttpModule,
        HttpClientJsonpModule,
        BrowserModule,
        NoopAnimationsModule,
        InputsModule,
        // RouterModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,    
        ButtonsModule,
        DropDownsModule,
        AutoCompleteModule,    
        ComboBoxModule,
        DialogModule,
        LayoutModule,
        AppBootstrapModule, 
        GridModule,   
    ],
    declarations: [
        NopagesfoundComponent,
        AppheaderComponent,
        AppmenuComponent,
        AppfooterComponent,
        BreadcrumbsComponent,
        AppsettingsComponent,
        AppmenuComponent,
    ],
    exports: [
        NopagesfoundComponent,
        AppheaderComponent,
        AppmenuComponent,
        AppfooterComponent,
        BreadcrumbsComponent,
        AppsettingsComponent,
        AppmenuComponent,
    ], providers: [
        varGlobales
      ],
})
export class SharedModule { }
