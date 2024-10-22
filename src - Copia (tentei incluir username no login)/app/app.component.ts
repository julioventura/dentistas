import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'; // Importamos Router e ActivatedRoute
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showFooter = true; // Variável que controla a exibição do menu

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // Detecta mudanças na rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd)) // Filtra apenas as mudanças de rota
      .subscribe(() => {
        // Verifica se o caminho atual é para o componente Homepage
        const currentRoute = this.activatedRoute.firstChild?.snapshot.routeConfig?.path;
        if (currentRoute && currentRoute.includes(':username')) {
          this.showFooter = false; // Se a rota for para o Homepage, ocultamos o menu
        } else {
          this.showFooter = true; // Para outras rotas, mostramos o menu
        }
      });
  }
}
