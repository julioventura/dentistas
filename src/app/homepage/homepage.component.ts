/* 
  Métodos do componente HomepageComponent:
  1. ngOnInit() - Inicializa o componente, verificando se o usuário está logado e, caso haja um username na URL, carrega o perfil público.
  2. loadUserProfile(username: string): void - Busca e carrega o perfil público do usuário com base no username.
  3. openHomepage(): void - Abre a homepage pública do usuário em uma nova janela.
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../shared/user.service';
import { CommonModule } from '@angular/common';
import { ChatbotWidgetComponent } from './chatbot-widget/chatbot-widget.component';
import { EnderecoComponent } from "./endereco/endereco.component";
import { ContatoComponent } from "./contato/contato.component";
import { TitulacoesComponent } from "./titulacoes/titulacoes.component";
import { HorariosComponent } from "./horarios/horarios.component";
import { ConveniosComponent } from "./convenios/convenios.component";
import { RedesComponent } from "./redes/redes.component";
import { CartaoComponent } from "./cartao/cartao.component";
import { CapaComponent } from "./capa/capa.component";
import { WhatsappButtonComponent } from "./whatsapp-button/whatsapp-button.component";
import { RodapeHomepageComponent } from "./rodape-homepage/rodape-homepage.component";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ChatbotWidgetComponent,
    EnderecoComponent,
    ContatoComponent,
    TitulacoesComponent,
    HorariosComponent,
    ConveniosComponent,
    RedesComponent,
    CartaoComponent,
    CapaComponent,
    WhatsappButtonComponent,
    RodapeHomepageComponent
]
})
export class HomepageComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
  isChatbotExpanded = false;
  username: string | null = null;  // Added missing property
  isCurrentUserProfile = false;    // Added missing property
  
  // Manteremos userProfile como uma referência local para compatibilidade,
  // mas não o passaremos mais como @Input para os componentes filhos
  get userProfile(): any {
    return this.userService.userProfile;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afAuth: AngularFireAuth,
    public userService: UserService, // Agora é public para acesso nos templates
  ) { }

  ngOnInit() {
    // Código existente para obter username da URL...
    this.route.params.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.loadUserProfile(username);
      } else {
        // Lidar com caso sem username...
      }
    });
  }

  loadUserProfile(username: string): void {
    this.isLoading = true;
    this.username = username; // Set the username property
    
    // Agora usando o método do UserService
    this.userService.loadUserProfileByUsername(username)
      .subscribe(
        (userProfiles) => {
          if (userProfiles && userProfiles.length > 0) {
            // O userService já define userProfile internamente
            this.errorMessage = '';
            
            // Check if this is the current user's profile
            this.afAuth.authState.subscribe(user => {
              if (user) {
                this.isCurrentUserProfile = (user.email === userProfiles[0].email);
                console.log('Is current user profile:', this.isCurrentUserProfile);
              } else {
                this.isCurrentUserProfile = false;
              }
            });
          } else {
            this.errorMessage = `Não foi encontrado um perfil com o username: ${username}`;
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Erro ao carregar perfil:', error);
          this.errorMessage = 'Erro ao carregar o perfil.';
          this.isLoading = false;
        }
      );
  }

  openHomepage(): void {
    console.log("Opening homepage for username:", this.username);
    
    if (this.username) {
      if (this.isCurrentUserProfile) {
        // Se for o usuário atual, navega dentro do app
        console.log("Navigating to current user's homepage within app");
        this.router.navigate([`/${this.username}`]);
      } else {
        // Para outros usuários, abre em uma nova aba
        console.log("Opening user homepage in new tab");
        const homepageUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${this.username}`;
        if (typeof window !== 'undefined') {
          window.open(homepageUrl, '_blank', 'noopener,noreferrer');
        }
      }
    } else {
      console.error('Username not defined');
      this.errorMessage = 'Nome de usuário não definido.';
    }
  }

  editProfile(): void {
    if (this.isCurrentUserProfile) {
      this.router.navigate(['/perfil']);
    }
  }

  onChatbotExpansionChange(isExpanded: boolean): void {
    this.isChatbotExpanded = isExpanded;
  }

  formatWhatsApp(phoneNumber: string | undefined): string {
    if (!phoneNumber) return '5521981707207'; // Número padrão se não houver número
    // Remove non-numeric characters
    return phoneNumber.replace(/\D/g, '');
  }
}
