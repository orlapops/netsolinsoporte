import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SettingsService,
  SidebarService,
  SharedService
 } from './service.index';
import { MantablasLibreria } from './mantbasica.libreria';
import { MantbasicaService } from './mantbasica.service';
import { NetsolinService } from './netsolin.service';
import { EditService } from '../services/Editsoporte.service';
import { AgmCoreModule } from '@agm/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../../environments/environment';


@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD9BxeSvt3u--Oj-_GD-qG2nPr1uODrR0Y'
      // apiKey: 'AIzaSyBCxuyq-qQPZFoWSc7UYY1uCznmZnjfqGI'
  }),
  // AngularFirestoreModule,
  AngularFireStorageModule,
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule // imports firebase/firestore, only needed for database features

  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    MantablasLibreria,
    MantbasicaService,
    NetsolinService,
    EditService,
    AngularFirestore
  ],
  declarations: []
})
export class ServiceModule { }
