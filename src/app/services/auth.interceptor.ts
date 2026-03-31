import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

    let token: string | null = null;
    if (isBrowser) {
        token = localStorage.getItem('token');
    }

    if (token) {
        const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(cloned);
    }
    return next(req);
};