import { Routes } from '@angular/router';
import { LetradecambioComponent } from './components/letrasdecambio/letradecambio/letradecambio.component';
import { LetrasdecambioComponent } from './components/letrasdecambio/letrasdecambio.component';
import { ReporteComponent } from './components/letrasdecambio/reporte/reporte.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'letrasdecambio', // Redirigir a una ruta válida
        pathMatch: 'full',
    },
    {
        path: 'letrasdecambio',component: LetrasdecambioComponent,
        children: [
            { path: 'nuevo', component: LetradecambioComponent }
            ,{path:'busqueda',component:ReporteComponent}
        ]
    }
];
