//Op marzo 1 19
//Modelo de modulo principal de proyecto angular netsolin
//cambiar palabra modelo por identificardor del proeycto
//Incluir otros modulos si faltan
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SOPOR_ROUTES } from './soporte.routes';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';

//firebase feb 19 19 y agm para mapas google
// import { AngularFireModule } from 'angularfire2';
// import { AngularFirestoreModule } from 'angularfire2/firestore';
//firebase prueba oct 4 18
import { AgmCoreModule } from '@agm/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';

// ng2-charts
// import { ChartsModule } from 'ng2-charts';

import { SoporteComponent } from './soporte.component';

import { MonitorPrinSoporteComponent } from './monitores/monitorprinsoporte.component';
import { MonitorPrinRequerimientoComponent } from './monitores/monitorprinrequerimiento.component';
import { MonitorPrinCasosfreComponent } from './monitores/monitorprincasosfrecue.component';
import { NetsolinLibreriasModule } from '../../netsolinlibrerias/netsolin.librerias.module';
import { NetsolinMantablasModule } from '../../mantablasbasicas/netsolin.mantablas.module';
import { Netssoportebusqueda } from './componentes/soportebusqueda/soportebusquedamodal.componet';
import { MonitorIncidenciaComponent } from './monitores/incidencia/monitor.component';
import { MonitorRequerimientoComponent } from './monitores/requerimiento/monitor.component';
import { MonitorGeneralComponent } from './monitores/general/monitor.component';
import { MonitorObjetotablaComponent } from './monitores/objetotabla/monitor.component';

//Kendo
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { UploadModule } from '@progress/kendo-angular-upload';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Import the ButtonsModule
import { ButtonsModule } from '@progress/kendo-angular-buttons';
// Imports the AutoComplete module
import { AutoCompleteModule } from '@progress/kendo-angular-dropdowns';
// Imports the ComboBox module
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule,ExcelModule  } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ChartsModule } from '@progress/kendo-angular-charts';

import '@progress/kendo-angular-intl/locales/es/all';
import { AppmenuSoporteComponent } from './componentes/appmenuizq/appmenu.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { EditorModule } from '@progress/kendo-angular-editor';
// Load all required data for the ES locale
// import '@progress/kendo-angular-intl/locales/es/all';


import { SharedModule } from '../../shared/shared.module';
import { MultiCheckFilterComponent } from '../../netsolinlibrerias/filtromultiplegrid/multicheck-filter.component';
import { DateRangeFilterComponent } from '../../netsolinlibrerias/filtromultiplegrid/date-range-filter.component';
import { EditService } from '../../services/Editsoporte.service';
import { GridEditFormComponent } from './edit-form.Soporte.component';
import { GridEditFormarchComponent } from './monitores/incidencia/edit-formarch.Soporte.component';
import { GridEditnovedadFormComponent } from './monitores/incidencia/edit-form.Novedad.component';
import { GridEditFormCasofrecuenComponent } from './edit-form.casofrecuen.component';
import { GridEditFormRequerComponent } from './edit-form.requer.component';
import { GridEditFormarchrequerComponent } from './monitores/requerimiento/edit-formarch.requer.component';
import { GridEditnovedadrequerFormComponent } from './monitores/requerimiento/edit-form.Novedadrequer.component';
// import { UploadComponent } from './upload.component';
// import { UploadInterceptor } from './monitores/incidencia/edit-formarch.Soporte.component';

// import { GridEditFormarchComponent } from './edit-formarch.Soporte.component';
registerLocaleData(localeEs, 'es')
@NgModule({
    declarations: [
        SoporteComponent,
        Netssoportebusqueda,
        MonitorPrinSoporteComponent,
        MonitorPrinRequerimientoComponent,
        MonitorPrinCasosfreComponent,
        MonitorIncidenciaComponent,
        MonitorRequerimientoComponent,
        MonitorGeneralComponent,
        MonitorObjetotablaComponent,
        AppmenuSoporteComponent,
        MultiCheckFilterComponent,
        DateRangeFilterComponent,
        GridEditFormComponent,
        GridEditFormarchComponent,
        GridEditFormarchrequerComponent,
        GridEditFormCasofrecuenComponent,
        GridEditFormRequerComponent,
        GridEditnovedadFormComponent,
        GridEditnovedadrequerFormComponent
    ],
    exports: [
        MonitorPrinSoporteComponent,
        MonitorPrinRequerimientoComponent,
        MonitorPrinCasosfreComponent,
        Netssoportebusqueda,
        MonitorIncidenciaComponent,
        MonitorRequerimientoComponent,
        MonitorIncidenciaComponent,
        MonitorGeneralComponent,
        MonitorObjetotablaComponent,
        AppmenuSoporteComponent,
    ],
    
    imports: [
        CommonModule,
        SharedModule,
        // TiendaModule,
        NetsolinLibreriasModule,
        SOPOR_ROUTES,
        FormsModule,
        ReactiveFormsModule,
        NetsolinMantablasModule,
        RouterModule,
        CommonModule,
        FormsModule,
        BrowserModule, 
        BrowserAnimationsModule, 
        ScrollViewModule,
        NoopAnimationsModule,
        InputsModule,
        DropDownsModule,
        HttpClientModule,
        UploadModule,
        ReactiveFormsModule,    
        ButtonsModule,
        DropDownsModule,
        AutoCompleteModule,    
        ComboBoxModule,
        DialogModule,
        LayoutModule,
        GridModule,
        ExcelModule,
        ChartsModule,
        DateInputsModule,
        EditorModule,
        
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
            // apiKey: 'AIzaSyBCxuyq-qQPZFoWSc7UYY1uCznmZnjfqGI'
        }),
        // AngularFirestoreModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule, // imports firebase/firestore, only needed for database features        
        // ChartsModule
    ],
    providers: [
        AngularFirestore,
        { provide: LOCALE_ID, useValue: 'es' },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GridEditFormarchComponent, 
            multi: true
          },
        EditService
    ]

})
export class SoporteModule { }
