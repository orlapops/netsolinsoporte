import { RouterModule, Routes } from '@angular/router';

import { SoporteComponent } from './soporte.component';
import { MonitorPrinSoporteComponent } from './monitores/monitorprinsoporte.component';
import { MonitorPrinRequerimientoComponent } from './monitores/monitorprinrequerimiento.component';
import { MonitorPrinCasosfreComponent } from './monitores/monitorprincasosfrecue.component';
import { NopagesfoundComponent } from '../../shared/nopagesfound/nopagesfound.component';


import { MonitorObjetotablaComponent } from './monitores/objetotabla/monitor.component';
import { MonitorIncidenciaComponent } from './monitores/incidencia/monitor.component';
import { MonitorRequerimientoComponent } from './monitores/requerimiento/monitor.component';
import { MonitorGeneralComponent } from './monitores/general/monitor.component';
import { Netssoportebusqueda } from './componentes/soportebusqueda/soportebusquedamodal.componet';
import { MantBasicaComponent } from '../../mantablasbasicas/tbasica/mantbasica.component';
import { AddregtbasicaComponent } from '../../mantablasbasicas/tbasica/adicionar/adicionar.component';
import { VerregtbasicaComponent } from '../../mantablasbasicas/tbasica/ver/ver.component';
import { EditregtbasicaComponent } from '../../mantablasbasicas/tbasica/editar/editar.component';
import { MenuTbasComponent } from '../../mantablasbasicas/tbasica/menumtablas/menumtablas.component';

//Op marzo 7 18 Modelo soporte del modulo principal
//cambiar palabra modelo
//Incluya las soporte hijas

const soporteRoutes: Routes = [
    {
        path: '',
        component: SoporteComponent,
        children: [
            { path: 'home', component: MonitorPrinSoporteComponent, data: { titulo: 'Monitor Principal' } },
            {path: 'menutbas', component: MenuTbasComponent, data: { titulo: 'Menu Principal' }},
            { path: 'monitorprinsoporte', component: MonitorPrinSoporteComponent, data: { titulo: 'Monitor Principal' } },           
            { path: 'monitorprinrequerimiento', component: MonitorPrinRequerimientoComponent, data: { titulo: 'Monitor Requerimiento' } },           
            { path: 'monitorprincasosfrecuen', component: MonitorPrinCasosfreComponent, data: { titulo: 'Monitor Casos Frecuentes' } },           
            { path: 'mantbasica/:objeto', component: MantBasicaComponent, data: { titulo: 'Mantenimiento' }},
            { path: 'addregtbasica/:varParam', component: AddregtbasicaComponent, data: { titulo: 'Adicionar registro' }},
            { path: 'verregtbasica/:varParam/:id', component: VerregtbasicaComponent, data: { titulo: 'Consultar registro' }},
            { path: 'editregtbasica/:varParam/:id', component: EditregtbasicaComponent, data: { titulo: 'Editar registro' }},
            { path: 'monitorincidencia/:nit_empresa/:ticket', component: MonitorIncidenciaComponent, data: { titulo: 'Monitor Incidencia' } },
            { path: 'monitorrequerimiento/:nit_empresa/:idrequer', component: MonitorRequerimientoComponent, data: { titulo: 'Monitor Incidencia' } },
            { path: 'monitorgeneral', component: MonitorGeneralComponent, data: { titulo: 'Monitor General' }}, 
            { path: 'monitorobjtabla/:varParam/:id', component: MonitorObjetotablaComponent, data: { titulo: 'Monitor panel tabla' }}, 
            {path: '', redirectTo: '/home', pathMatch: 'full'},
            { path: '**', component: NopagesfoundComponent }
            // { path: '', redirectTo: '/monitorprinsoporte', pathMatch: 'full' }
        ]
    }
];


export const SOPOR_ROUTES = RouterModule.forChild( soporteRoutes);
