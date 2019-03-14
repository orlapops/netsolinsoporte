import { RouterModule, Routes } from '@angular/router';


import { MantBasicaComponent } from '../mantablasbasicas/tbasica/mantbasica.component';
import { AddregtbasicaComponent } from '../mantablasbasicas/tbasica/adicionar/adicionar.component';
import { VerregtbasicaComponent } from '../mantablasbasicas/tbasica/ver/ver.component';
import { EditregtbasicaComponent } from '../mantablasbasicas/tbasica/editar/editar.component';
import { AddregterceroComponent } from '../mantablasbasicas/terceros/adicionar/adicionar.component';
import { VerregterceroComponent } from '../mantablasbasicas/terceros/ver/ver.component';
import { EditregterceroComponent } from '../mantablasbasicas/terceros/editar/editar.component';
import { MenuTbasComponent } from '../mantablasbasicas/tbasica/menumtablas/menumtablas.component';


const mantablasdRoutes: Routes = [
    {
        path: '',
        children: [
            { path: 'mantbasica/:objeto', component: MantBasicaComponent, data: { titulo: 'Mantenimiento' }},
            { path: 'addregtbasica/:varParam', component: AddregtbasicaComponent, data: { titulo: 'Adicionar registro' }},
            { path: 'verregtbasica/:varParam/:id', component: VerregtbasicaComponent, data: { titulo: 'Consultar registro' }},
            { path: 'editregtbasica/:varParam/:id', component: EditregtbasicaComponent, data: { titulo: 'Editar registro' }},

            { path: 'addregttercero/:varParam/id_cliepoten', component: AddregterceroComponent, data: { titulo: 'Adicionar tercero' }},
            { path: 'verregttercero/:varParam/:id', component: VerregterceroComponent, data: { titulo: 'Consultar tercero' }},
            { path: 'editregttercero/:varParam/:id', component: EditregterceroComponent, data: { titulo: 'Ediar tercero' }}, 
        
        ]
    }
];


export const MANTABLAS_ROUTES = RouterModule.forChild( mantablasdRoutes );
