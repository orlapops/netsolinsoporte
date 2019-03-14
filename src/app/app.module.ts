import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

// Soporte
import { APP_ROUTES } from './app.routes';

// Modulos
import { SoporteModule } from './modulos/soporte/soporte.module';
// temporal
import { FormsModule } from '@angular/forms';
// Servicios
import { ServiceModule } from './services/service.module';

// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { varGlobales } from './shared/varGlobales';
// import { GuardService } from './shared/servicios/guard.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Load all required data for the ES locale
import '@progress/kendo-angular-intl/locales/es/all';
import { UploadModule } from '@progress/kendo-angular-upload';
import { HttpClientModule } from '@angular/common/http';
import { EditorModule } from '@progress/kendo-angular-editor';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';







@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    //Modulo principal cambie aqui por el modulo pruncipla la palabra modelo
    SoporteModule,
    // TiendaModule,
    FormsModule,
    ServiceModule,
  // AngularFirestoreModule,
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule,
  DateInputsModule,
  BrowserAnimationsModule,
  UploadModule,
  HttpClientModule,
  EditorModule,
  ChartsModule,
  GridModule,
  DropDownsModule,
  ToolBarModule // imports firebase/firestore, only needed for database features

  ],
  providers: [
    varGlobales,
    AngularFirestore,
    { provide: LOCALE_ID, useValue: 'es' }
    // GuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
