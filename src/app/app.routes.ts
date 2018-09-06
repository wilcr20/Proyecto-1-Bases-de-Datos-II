import {RouterModule, Routes} from '@angular/router';
import { IngresoComponent } from './components/ingreso/ingreso.component';
import { HomeComponent } from 'src/app/components/home/home.component';


// arreglo de rutas
const APP_ROUTES: Routes =[
    { path: 'ingreso', component: IngresoComponent},
    { path: 'home', component: HomeComponent},
    { path: '**',pathMatch: 'full', redirectTo:'ingreso' }
];

export const APP_ROUTING= RouterModule.forRoot(APP_ROUTES);
