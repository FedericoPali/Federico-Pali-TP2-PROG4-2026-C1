import { Routes } from '@angular/router';
import { Auth } from './auth';
import { Login } from './login/login';
import { Register } from './register/register';

export const authRoutes: Routes = [
    {
        path: "",
        component: Auth,
        children: [
            {
                path: "login",
                component: Login
            },
            {
                path: "register",
                component: Register
            }
        ]
    }
]