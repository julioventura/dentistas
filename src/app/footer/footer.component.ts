import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa a autenticação do Firebase
import firebase from 'firebase/compat/app'; // Importa o firebase para usar firebase.User
import { ConfigService } from '../shared/services/config.service';
import { AiChatService } from '../chatbot-widget/ai-chat.service';
import { UserService } from '../shared/services/user.service'; // Adicionar import para UserService

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false
})
export class FooterComponent implements OnInit {
  user: firebase.User | null = null; // Armazena o usuário logado
  show_footer: boolean = false;
  ambiente: string = '';

  constructor(
    private router: Router,
    private auth: AngularFireAuth, // Injeta o serviço de autenticação
    public configuracoes: ConfigService,
    private aiChatService: AiChatService, // Adicionar injeção do AiChatService
    private userService: UserService // Adicionar injeção do UserService
  ) { }

  ngOnInit() {

    // Verifica se há um usuário logado e armazena as informações
    this.auth.authState.subscribe((user) => {
      this.user = user;
      if(user?.email=='julio@dentistas.com.br'){
        this.configuracoes.is_admin = true;
      }
      else {
        this.configuracoes.is_admin = false;
      }

      this.ambiente = this.configuracoes.getAmbiente();
      this.show_footer = true;
    });
  }

  
  chat_whatsapp() {
    
    // Se o chatbot estiver aberto, fechar antes de abrir o WhatsApp
    if (this.aiChatService) {
      // Exemplo de uso do aiChatService para não gerar warning
    }
    
    let nome: string = 'Dentistas.com.br';
    let telefone: string = '552124346931';

    // Formatação da mensagem, substituindo <nome> pelo nome real do paciente
    const mensagem = encodeURIComponent(`
        Olá!

        Estou entrando em contato pelo site do ${nome}.
    `);

    // remove do telefone tudo que não for dígitos
    telefone = telefone.replace(/\D/g, '');
    // Formatação da URL do WhatsApp com telefone e mensagem
    const whatsappUrl = `https://wa.me/${telefone}?text=${mensagem}`;

    // Abre a URL em uma nova aba
    window.open(whatsappUrl, '_blank');
  }


  // Método para logout
  logout(): void {
    
    // Limpar o contexto do chatbot
    this.aiChatService.resetContext();
    
    // Usar o userService para fazer logout
    this.userService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error('Erro ao fazer logout:', error);
    });
  }

  // Método para navegação dinâmica
  go(component: string) {
    this.router.navigate(['/' + component]);
  }
}
