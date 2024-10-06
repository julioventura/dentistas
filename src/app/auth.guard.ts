import { CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Observable((observer) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Usuário autenticado, permitir acesso
        observer.next(true);
      } else {
        // Usuário não autenticado, redirecionar para login
        router.navigate(['/login']);
        observer.next(false);
      }
      observer.complete();
    });
  });
};
