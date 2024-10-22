import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserService } from '../user.service';

@Injectable({
    providedIn: 'root'
})
export class UsernameGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const username = route.paramMap.get('username');

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
