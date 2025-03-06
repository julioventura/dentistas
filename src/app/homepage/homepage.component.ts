/* 
  Métodos do componente HomepageComponent:
  1. ngOnInit() - Inicializa o componente, verificando se o usuário está logado e, caso haja um username na URL, carrega o perfil público.
  2. loadUserProfile(username: string): void - Busca e carrega o perfil público do usuário com base no username.
  3. openHomepage(): void - Abre a homepage pública do usuário em uma nova janela.
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../shared/user.service';
import { UtilService } from '../shared/utils/util.service';
import { CommonModule } from '@angular/common';
import { ChatbotWidgetComponent } from './chatbot-widget/chatbot-widget.component';
import { RodapeHomepageComponent } from './rodape-homepage/rodape-homepage.component';
import { EnderecoComponent } from "./endereco/endereco.component";
import { ContatoComponent } from "./contato/contato.component";
import { TitulacoesComponent } from "./titulacoes/titulacoes.component";
import { HorariosComponent } from "./horarios/horarios.component";
import { ConveniosComponent } from "./convenios/convenios.component";
import { RedesComponent } from "./redes/redes.component";
import { CartaoComponent } from "./cartao/cartao.component";
import { CapaComponent } from "./capa/capa.component";
import { MapsComponent } from "../shared/maps/maps.component";
import { WhatsappButtonComponent } from "./whatsapp-button/whatsapp-button.component";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ChatbotWidgetComponent,
    RodapeHomepageComponent,
    EnderecoComponent,
    ContatoComponent,
    TitulacoesComponent,
    HorariosComponent,
    ConveniosComponent,
    RedesComponent,
    CartaoComponent,
    CapaComponent,
    MapsComponent,
    WhatsappButtonComponent
]
})
export class HomepageComponent implements OnInit {
  public userProfile: any = {}; 
  public username: string | null = null;
  public currentYear: number = new Date().getFullYear();
  public loggedInUser: any;
  public isLoading: boolean = true;
  public errorMessage: string = '';
  public isCurrentUserProfile: boolean = false;
  isChatbotExpanded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>,
    private auth: AngularFireAuth,
    private userService: UserService,
    public util: UtilService,
  ) { }

  /**
   * ngOnInit()
   * @description Inicializa o componente:
   *   - Verifica se o usuário está logado através de authState.
   *   - Caso o usuário esteja logado, armazena os dados e tenta obter o username da URL.
   *   - Se houver um username, chama loadUserProfile para carregar o perfil público desse usuário.
   *   - Atualiza as flags de carregamento e mensagens de erro para fornecer feedback visual.
   */
  ngOnInit(): void {
    console.log("HomepageComponent ngOnInit()");
    this.isLoading = true;
    
    // Obtém o parâmetro 'username' da rota primeiro
    this.username = this.route.snapshot.paramMap.get('username');
    console.log("Username from route:", this.username);
    
    // Subscreve ao estado de autenticação para verificar se o usuário está logado
    this.auth.authState.subscribe(user => {
      if (user) {
        this.loggedInUser = user; // Armazena os dados do usuário logado
        console.log("Authenticated user:", this.loggedInUser);

        // Carrega os dados do usuário autenticado do seu perfil no app
        this.userService.getUserProfileData().subscribe(profileData => {
          if (profileData) {
            console.log("User profile data:", profileData);
            
            // Se não houver username na URL, usa o do perfil (se disponível)
            if (!this.username && profileData.username) {
              this.username = profileData.username;
              console.log("Using username from profile:", this.username);
              this.isCurrentUserProfile = true;
            }
            
            // Se temos um username, carregamos o perfil
            if (this.username) {
              this.loadUserProfile(this.username);
            } else {
              this.errorMessage = 'Usuário sem nome de usuário definido. Atualize seu perfil.';
              this.isLoading = false;
            }
          } else {
            console.log("No profile data found");
            if (this.username) {
              // Se temos um username da rota mas não há dados de perfil,
              // carregamos o perfil para esse username
              this.loadUserProfile(this.username);
            } else {
              this.errorMessage = 'Perfil não encontrado. Por favor, atualize seu perfil.';
              this.isLoading = false;
            }
          }
        }, error => {
          console.error("Error getting user profile:", error);
          if (this.username) {
            // Ainda tenta carregar o perfil com base no username da rota
            this.loadUserProfile(this.username);
          } else {
            this.errorMessage = 'Erro ao carregar perfil.';
            this.isLoading = false;
          }
        });
      } else {
        console.log("No authenticated user");
        if (this.username) {
          // Se temos um username da rota mas não há usuário autenticado,
          // tenta carregar o perfil (visualização pública)
          this.loadUserProfile(this.username);
        } else {
          this.errorMessage = 'Por favor, faça login para ver seu perfil.';
          this.isLoading = false;
        }
      }
    }, error => {
      console.error("Auth error:", error);
      if (this.username) {
        // Ainda tenta carregar o perfil com base no username da rota
        this.loadUserProfile(this.username);
      } else {
        this.errorMessage = 'Erro de autenticação.';
        this.isLoading = false;
      }
    });

    // Adicione isso para debug
    console.log('ChatbotWidgetComponent importado:', 
      !!ChatbotWidgetComponent);
  }

  /**
   * loadUserProfile(username: string): void
   * @param username - Nome de usuário usado para buscar o perfil público.
   * @description Busca os dados do usuário usando o FirestoreService.
   * Se o perfil for encontrado, armazena os dados no 'userProfile';
   * se não, define uma mensagem de erro para feedback visual.
   */
  loadUserProfile(username: string): void {
    if (!username) return;
    
    this.isLoading = true;
    this.firestoreService.getRegistroByUsername('usuarios/dentistascombr/users', username)
      .subscribe(
        (userProfiles) => {
          if (userProfiles && userProfiles.length > 0) {
            this.userProfile = userProfiles[0];
            // Adicionar logs para depuração
            console.log('Homepage - Perfil completo carregado:', this.userProfile);
            console.log('Homepage - Tipo de endereços:', typeof this.userProfile.enderecos);
            console.log('Homepage - Endereços:', this.userProfile.enderecos);
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Perfil não encontrado.';
            this.userProfile = {};
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Erro ao carregar perfil:', error);
          this.errorMessage = 'Erro ao carregar perfil.';
          this.isLoading = false;
        }
      );
  }

  /**
   * openHomepage(): void
   * @description Abre a homepage pública do usuário em uma nova janela utilizando o username.
   * Se o username estiver definido, cria a URL e a abre com as configurações de segurança.
   */
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
