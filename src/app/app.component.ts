import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { filter } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('0.4s ease-in-out', style({ opacity: 1 }))  
      ])
    ])
  ],
  standalone: false
})

export class AppComponent implements OnInit {
  showFooter = true;
  isAuthenticated = false;
  isChatbotExpanded = false;
  currentUserId: string | null = null;
  currentUserName: string | null = null;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Detecta mudanças na rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Verifica se o caminho atual é para o componente Homepage
        const currentRoute = this.activatedRoute.firstChild?.snapshot.routeConfig?.path;

        // Verifica se o usuário está logado
        this.afAuth.authState.subscribe(user => {
          this.isAuthenticated = !!user;
          
          if (user) {
            this.currentUserId = user.uid;
            this.currentUserName = user.displayName || user.email?.split('@')[0] || 'Usuário';
            this.showFooter = true;
          } else {
            this.showFooter = false;
          }
          
          if (currentRoute && currentRoute.includes(':username')) {
            this.showFooter = false; // Se a rota for para o Homepage, ocultamos o menu
          }
        });
      });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  onChatbotExpansionChange(isExpanded: boolean): void {
    this.isChatbotExpanded = isExpanded;
  }
}
