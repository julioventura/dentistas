import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Substitua Auth por AngularFireAuth
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { ChatbotComponent } from "../chatbot/chatbot.component";  // Importe o ChatbotComponent (presumindo que você esteja usando no template)
import { MenuComponent } from '../menu/menu.component';  // Importando o MenuComponent (presumindo que você esteja usando no template)

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  nome: string = '';  // Variável para armazenar o nome do usuário logado

  constructor(
    private auth: AngularFireAuth,  // Usando AngularFireAuth
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Exemplo de uso do AngularFireAuth para obter o usuário logado
    this.auth.user.subscribe(user => {
      if (user) {
        this.nome = this.capitalize(user.displayName || user.email || 'Usuário');
      } else {
        console.log('Nenhum usuário logado.');
        // Redireciona para a página de login se o usuário não estiver logado
        this.router.navigate(['/login']);
      }
    });

    // Acesse os dados do usuário diretamente no serviço
    const userData = this.userService.getUser();
    if (userData) {
      console.log(userData);
      this.nome = this.capitalize(userData.nome || userData.email);
    }
  }

  // Função para capitalizar a primeira letra de cada palavra
  capitalize(text: string): string {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Método para navegação dinâmica
  go(component: string) {
    console.log("Navegando para " + component);
    this.router.navigate(['/' + component]);
  }
}
