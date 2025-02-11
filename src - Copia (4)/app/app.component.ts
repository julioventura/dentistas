import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa o serviço de autenticação

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0 }),      // Inicia invisível
        animate('0.4s ease-in-out', style({ opacity: 1 }))  
      ])
    ])
  ]
})

export class AppComponent implements OnInit {
  showFooter = false; // Variável que controla a exibição do menu

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private afAuth: AngularFireAuth

  ) { }

  ngOnInit(): void {
    // Detecta mudanças na rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd)) // Filtra apenas as mudanças de rota
      .subscribe(() => {
        // Verifica se o caminho atual é para o componente Homepage
        const currentRoute = this.activatedRoute.firstChild?.snapshot.routeConfig?.path;

        // Verifica se o usuário está logado
        this.afAuth.authState.subscribe(user => {
          this.showFooter = !!user; // Se o usuário estiver logado, showFooter é true; caso contrário, false
        });
        
        if (currentRoute && currentRoute.includes(':username')) {
          this.showFooter = false; // Se a rota for para o Homepage, ocultamos o menu
        } else {
          this.showFooter = true; // Para outras rotas, mostramos o menu
        }
      });
  }

  // Método para aplicar as animações nas rotas
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
