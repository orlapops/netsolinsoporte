import { RouterModule, Routes } from '@angular/router';

// import { SoporteComponent } from './modulos/soporte/pages/soporte.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { NopagesfoundComponent } from './shared/nopagesfound/nopagesfound.component';
// import { GuardService } from './shared/servicios/guard.service';


const appRoutes: Routes = [
    // { path: 'login', component: LoginComponent, canActivate: [GuardService] },
    // { path: 'register', component: RegisterComponent, canActivate: [GuardService] },
    // { path: '**', component: NopagesfoundComponent, canActivate: [GuardService] }
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: '**', component: NopagesfoundComponent }
];


export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true } );
