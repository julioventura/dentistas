/* 
  Métodos do componente HomepageComponent:
  1. ngOnInit() - Inicializa o componente, verificando se o usuário está logado e, caso haja um username na URL, carrega o perfil público.
  2. loadUserProfile(username: string): void - Busca e carrega o perfil público do usuário com base no username.
  3. openHomepage(): void - Abre a homepage pública do usuário em uma nova janela.
  // 4. generateQRCode(url: string): void - (Atualmente comentado) Gera um QR Code a partir da URL fornecida.
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilService } from '../shared/utils/util.service'; 
// import * as QRCode from 'qrcode'; // Biblioteca para QR Code (atualmente comentada)

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: false,
})
export class HomepageComponent implements OnInit {
  public userProfile: any = {}; // Dados do perfil público
  public username: string | null = null; // Username utilizado para buscar o perfil público
  public currentYear: number = new Date().getFullYear(); // Ano atual
  public qrCodeUrl: string = 'https://dentistas.com.br/assets/qrcode_dentistascombr.png'; // URL do QR Code
  public loggedInUser: any; // Dados do usuário logado
  
  // Propriedades para feedback visual e tratamento de erros
  public isLoading: boolean = false;
  public errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService<any>, // Serviço para buscar dados
    private auth: AngularFireAuth, // Serviço de autenticação
    public utilService: UtilService, // Serviço de utilidades
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
    console.log("ngOnInit()");
    this.isLoading = true;
    // Subscreve ao estado de autenticação para verificar se o usuário está logado
    this.auth.authState.subscribe(user => {
      if (user) {
        this.loggedInUser = user; // Armazena os dados do usuário logado

        // Obtém o parâmetro 'username' da rota
        this.username = this.route.snapshot.paramMap.get('username');
        
        // Se houver um username na URL, carrega o perfil público do usuário
        if (this.username) {
          this.loadUserProfile(this.username);
          // Exemplo de como gerar um QR Code – função comentada:
          // const userProfileUrl = 'https://dentistas.com.br/' + this.username;
          // this.generateQRCode(userProfileUrl);
        } else {
          this.errorMessage = 'Username não definido na URL.';
          this.isLoading = false;
        }
      } else {
        this.errorMessage = 'Usuário não autenticado. Por favor, faça login.';
        this.isLoading = false;
      }
    },
    error => {
      console.error('Erro na autenticação:', error);
      this.errorMessage = 'Erro ao verificar autenticação.';
      this.isLoading = false;
    });
  }

  /**
   * loadUserProfile(username: string): void
   * @param username - Nome de usuário usado para buscar o perfil público.
   * @description Busca os dados do usuário usando o FirestoreService.
   * Se o perfil for encontrado, armazena os dados no 'userProfile';
   * se não, define uma mensagem de erro para feedback visual.
   */
  loadUserProfile(username: string): void {
    this.firestoreService.getRegistroByUsername('usuarios/dentistascombr/users', username).subscribe(
      (userProfiles) => {
        if (userProfiles && userProfiles.length > 0) {
          // Armazena o primeiro resultado (assumindo username único)
          this.userProfile = userProfiles[0];
          console.log('Dados do usuário carregados:', this.userProfile);
          this.errorMessage = '';
        } else {
          console.error('Perfil não encontrado');
          this.errorMessage = 'Perfil não encontrado para o username informado.';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar perfil:', error);
        this.errorMessage = 'Erro ao carregar perfil. Por favor, tente novamente.';
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
    console.log("openHomepage()");
    if (this.username) {
      const homepageUrl = `/${this.username}`;
      window.open(homepageUrl, '_blank', 'noopener,noreferrer');
    }
  }
  
  /*
  // Exemplo de função para gerar QR Code utilizando a biblioteca 'qrcode'
  // @param url - URL a ser convertida em QR Code.
  // @description Gera um QR Code para a URL fornecida e atualiza a propriedade qrCodeUrl com a imagem gerada.
  generateQRCode(url: string): void {
    QRCode.toDataURL(url, {
      width: 300, // Define a largura do QR Code
      margin: 3,  // Define a margem ao redor (borda)
      color: {
        dark: '#000000',  // Cor do QR Code (preto)
        light: '#ffffff'  // Cor de fundo (branco)
      }
    }, (err, url) => {
      if (err) {
        console.error('Erro ao gerar QR Code', err);
        return;
      }
      this.qrCodeUrl = url;
    });
  }
  */
}