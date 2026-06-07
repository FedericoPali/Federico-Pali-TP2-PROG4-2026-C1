import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { Pages } from './pages/pages';

export const routes: Routes = [
    {
        path: 'auth',
        children: authRoutes,
    },
    {
        path: 'pages', 
        component: Pages, 
        children: [
            {
                path: 'publicaciones',
                component: Publicaciones,
                children: [
                    
                ]
            },
            {
                path: 'perfil/:id',
                component: MiPerfil
            }
        ]
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
