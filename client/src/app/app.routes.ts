import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { Home } from './pages/home/home';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { Pages } from './pages/pages';
import { Publicacion } from './pages/publicacion/publicacion';
import { authGuard } from './auth/guards/auth-guard';
import { Usuarios } from './dashboard/usuarios/usuarios';
import { adminGuard } from './auth/guards/admin-guard';
import { Estadisticas } from './dashboard/estadisticas/estadisticas';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    {
        path: 'auth',
        children: authRoutes,
    },
    {
        path: 'pages', 
        component: Pages,
        canActivate: [authGuard],
        children: [
            { path: 'publicaciones', component: Home },
            { path: 'perfil/:username', component: MiPerfil },
            { path: 'publicaciones/:id', component: Publicacion },
        ]
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [adminGuard],
        children: [
            {path: 'estadisticas', component: Estadisticas},
            {path: 'usuarios', component: Usuarios}
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
