import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserService } from './shared/user.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('0.4s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {

  showFooter = true;
  isChatbotExpanded = false;
  isHomepageRoute = false; // Nova propriedade para verificar se estamos na homepage

  constructor(
    private userService: UserService,
    private router: Router // Injetar o Router
  ) { }

  ngOnInit(): void {
    this.userService.chatbotExpanded$.subscribe(expanded => {
      this.isChatbotExpanded = expanded;
      console.log('Chatbot expanded status:', expanded);
    });

    // Monitorar mudanças de rota para detectar quando estamos em uma rota de homepage
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      
      // Verificar se é uma rota de username (não é uma rota do sistema)
      const systemRoutes = ['/home', '/login', '/config', '/perfil', '/backup'];
      const isSystemRoute = systemRoutes.some(route => url.startsWith(route));
      
      // Se temos uma rota não-sistema e não é a raiz
      this.isHomepageRoute = !isSystemRoute && url !== '/' && url.split('/').length === 2;
      
      console.log(`Rota atual: ${url}, É homepage? ${this.isHomepageRoute}`);
      
      // Adicionar/remover classe ao body dependendo da rota
      if (this.isHomepageRoute) {
        document.body.classList.add('homepage-active');
      } else {
        document.body.classList.remove('homepage-active');
      }
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
