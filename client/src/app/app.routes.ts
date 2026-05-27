import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';

export const routes: Routes = [
    {
        path: 'auth',
        children: authRoutes,
    },
    {
        path: 'publicaciones',
        component: Publicaciones
    },
    {
        path: 'mi-perfil',
        component: MiPerfil
    },
    {
        path: "",
        redirectTo: "auth",
        pathMatch: 'full'
    },
    {
        path: '**', 
        redirectTo: 'auth'
    }
];
