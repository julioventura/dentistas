import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserService } from '../user.service';

@Injectable({
    providedIn: 'root'
})
export class UsernameGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const username = route.paramMap.get('username');
        
        // Don't treat empty paths as usernames
        if (!username || username === '') {
            this.router.navigate(['/']);
            return of(false);
        }
        
        // Don't treat system routes as usernames
        const systemRoutes = ['home', 'login', 'config', 'perfil', 'homepage', /* other routes */];
        if (systemRoutes.includes(username)) {
            this.router.navigate([`/${username}`]);
            return of(false);
        }
        
        // Continue with your existing username validation
        return this.userService.isValidUsername(username).pipe(
            take(1),
            map(isValid => {
                if (isValid) {
                    return true;  // Username válido, permitir navegação
                } else {
                    this.router.navigate(['/home']);  // Username inválido, redireciona para a home
                    return false;
                }
            })
        );
    }
}
