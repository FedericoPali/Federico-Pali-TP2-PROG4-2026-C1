import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { Home } from './pages/home/home';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { Pages } from './pages/pages';
import { Publicacion } from './pages/publicacion/publicacion';

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
                component: Home,
            },
            {
                path: 'perfil/:username',
                component: MiPerfil
            },
            {
                path: 'publicaciones/:id',
                component: Publicacion
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
