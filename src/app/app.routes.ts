
import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { Home } from './home/home';
import { Register } from './register/register';
import { Login } from './login/login';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { Test } from './test/test';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./home/home').then(m => m.Home) },
    { path: 'register', loadComponent: () => import('./register/register').then(m => m.Register) },
    { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
    { path: 'admin-dashboard', loadComponent: () => import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboard), canActivate: [AuthGuard] },
    { path: 'manager-dashboard', loadComponent: () => import('./manager-dashboard/manager-dashboard').then(m => m.ManagerDashboard), canActivate: [AuthGuard] },
    { path: 'customer-dashboard', loadComponent: () => import('./customer-dashboard/customer-dashboard').then(m => m.CustomerDashboard), canActivate: [AuthGuard] },
    {
        path: 'product/:id',
        loadComponent: () =>
            import('./product-details/product-details')
                .then(m => m.ProductDetails),
        canActivate: [AuthGuard]
    },
    { path: 'test', loadComponent: () => import('./test/test').then(m => m.Test) }
];