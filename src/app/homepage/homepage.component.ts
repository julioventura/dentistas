import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Usando AngularFireAuth
// import * as QRCode from 'qrcode'; // Importa a biblioteca de QR Code

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: false,
})
export class HomepageComponent implements OnInit {
  public userProfile: any = {}; // Dados do perfil público
  public username: string | null = null;
  public currentYear: number = new Date().getFullYear(); // Obtém o ano atual
  public qrCodeUrl: string = 'https://dentistas.com.br/assets/qrcode_dentistascombr.png'; // Armazena a URL do QR Code gerado
  public loggedInUser: any; // Dados do usuário logado

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService<any>, // Serviço Firestore para buscar dados
    private auth: AngularFireAuth // Serviço de autenticação
  ) { }

  ngOnInit(): void {
    console.log("ngOnInit()");

    // Verifica se o usuário está logado
    this.auth.authState.subscribe(user => {
      if (user) {
        this.loggedInUser = user; // Armazena os dados do usuário logado
        this.username = this.route.snapshot.paramMap.get('username');

        // Se houver username na URL, carrega o perfil público, senão exibe mensagem de configuração
        if (this.username) {
          this.loadUserProfile(this.username);
          const userProfileUrl = 'https://dentistas.com.br/' + this.username;
          
          // this.generateQRCode(userProfileUrl); // Gera o QR Code
        }
      }
    });
  }

  // Função para buscar o perfil público pelo username
  loadUserProfile(username: string): void {
    // Agora vamos buscar o email associado ao username e carregar os dados pelo email
    this.firestoreService.getRegistroByUsername('usuarios/dentistascombr/users', username).subscribe((userProfiles) => {
      if (userProfiles && userProfiles.length > 0) {
        this.userProfile = userProfiles[0]; // Pegamos o primeiro resultado, pois esperamos que o username seja único
        console.log('Dados do usuário carregados:', this.userProfile);
      } else {
        console.error('Perfil não encontrado');
      }
    });
  }

  // Função para gerar o QR Code usando a biblioteca qrcode
  // generateQRCode(url: string): void {
  //   QRCode.toDataURL(url, {
  //     width: 300, // Define a largura
  //     margin: 3,  // Define a margem (borda ao redor)
  //     color: {
  //       dark: '#000000',  // Cor do QR Code (preto)
  //       light: '#ffffff'  // Cor de fundo (branco)
  //     }
  //   }, (err, url) => {
  //     if (err) {
  //       console.error('Erro ao gerar QR Code', err);
  //       return;
  //     }
  //     this.qrCodeUrl = url; // Armazena a URL gerada do QR Code
  //   });
  // }

  // Função para abrir a homepage pública em uma nova janela
  openHomepage(): void {
    if (this.username) {
      const homepageUrl = `/${this.username}`;
      window.open(homepageUrl, '_blank', 'noopener,noreferrer');
    }
  }
  
}