import { RouterModule, Routes } from '@angular/router';
import { LetradecambioComponent } from './components/letrasdecambio/letradecambio/letradecambio.component';
import { LetrasdecambioComponent } from './components/letrasdecambio/letrasdecambio.component';
import { ReporteComponent } from './components/letrasdecambio/reporte/reporte.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guard/AuthGuard.guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    
    { path: 'login', component: LoginComponent }, // Página de Login
    {
        path: 'letrasdecambio',
        component: LetrasdecambioComponent,
        canActivate: [AuthGuard], // Protegido por autenticación
        children: [
            { path: 'nuevo', component: LetradecambioComponent },
            { path: 'busqueda', component: ReporteComponent }
        ]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige al login por defecto
    { path: '**', redirectTo: 'login' } // Manejo de rutas no encontradas
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
