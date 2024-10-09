import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';  // Adicionar essas importações
import { CommonModule } from '@angular/common';  // Adicionar o CommonModule para o uso de *ngIf
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';  // Importando o FooterComponent

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']  
})
export class AppComponent {
  showMenu = true;

  constructor(private router: Router) {  
    // Injeção do serviço Router
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {  // Verifica se o evento é do tipo NavigationEnd
        // Exibir o menu em todas as páginas, exceto as de login e redefinição de senha
        const noMenuRoutes = ['/login', '/reset-password'];
        this.showMenu = !noMenuRoutes.includes(event.url);  // Controla menu e rodapé
      }
    });
  }

}
