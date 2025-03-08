import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from '../../shared/utils/util.service';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

interface RedeSocial {
  nome: string;
  valor: string;
  exibir: boolean;
}

@Component({
  selector: 'app-redes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './redes.component.html',
  styleUrls: ['./redes.component.scss']
})
export class RedesComponent implements OnChanges, OnInit {
  @Input() userProfile: any;
  @Input() darkMode: boolean = false;

  // Propriedade para rastrear se os dados estão carregados
  dadosCarregados = false;
  
  // Array para debug no HTML
  redesSociais: RedeSocial[] = [];
  
  // HTML gerado para as redes sociais
  redesHtml: SafeHtml = '';
  html: string = '';

  constructor(
    public util: UtilService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    console.log('RedesComponent - userProfile atualizado:', this.userProfile);
    this.atualizarRedesSociais();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('RedesComponent - ngOnChanges chamado');

    if (changes['userProfile'] && this.userProfile) {
      console.log('RedesComponent - userProfile atualizado:', this.userProfile);
      this.atualizarRedesSociais();
    }
  }

  // Método para atualizar o array de redes sociais
  private atualizarRedesSociais() {
    console.log('atualizarRedesSociais() chamado'); 

    if (!this.userProfile) return;
    
    this.redesSociais = [
      { 
        nome: 'Instagram', 
        valor: this.formatUrl('Instagram', this.userProfile.instagram), 
        exibir: this.verificarRede(this.userProfile.instagram) 
      },
      { 
        nome: 'Facebook', 
        valor: this.formatUrl('Facebook', this.userProfile.facebook), 
        exibir: this.verificarRede(this.userProfile.facebook) 
      },
      { 
        nome: 'LinkedIn', 
        valor: this.formatUrl('LinkedIn', this.userProfile.linkedin), 
        exibir: this.verificarRede(this.userProfile.linkedin) 
      },
      { 
        nome: 'YouTube', 
        valor: this.formatUrl('YouTube', this.userProfile.youtube), 
        exibir: this.verificarRede(this.userProfile.youtube) 
      },
      { 
        nome: 'Twitter', 
        valor: this.formatUrl('Twitter', this.userProfile.twitter), 
        exibir: this.verificarRede(this.userProfile.twitter) 
      },
      { 
        nome: 'TikTok', 
        valor: this.formatUrl('TikTok', this.userProfile.tiktok), 
        exibir: this.verificarRede(this.userProfile.tiktok) 
      },
      { 
        nome: 'Pinterest', 
        valor: this.formatUrl('Pinterest', this.userProfile.pinterest), 
        exibir: this.verificarRede(this.userProfile.pinterest) 
      }
    ];

    console.log('RedesComponent - redesSociais atualizadas:', this.redesSociais);
    this.dadosCarregados = true;
    
    // Gerar o HTML para as redes sociais
    this.gerarRedesHtml();
  }

  // Método que gera o HTML para as redes sociais
  private gerarRedesHtml() {
    console.log('gerarRedesHtml() chamado');

    // Iniciar com uma string vazia
    let html = '';
    
    // Verificar se há redes sociais para mostrar
    const hasRedes = this.redesSociais.some(rede => rede.exibir);
    console.log('hasRedes:', hasRedes);

    // if (hasRedes) {
      console.log('Redes sociais encontradas:', this.redesSociais);
      console.log('Gerando HTML para redes sociais...');

      // Gerar HTML para cada rede social
      html += '<div class="redes-lista">';
      
      // Mapear ícones para cada rede social
      // Adicionar assinatura de índice para evitar o erro TS7053
      const icones: { [key: string]: string } = {
        'Instagram': 'fa-instagram',
        'Facebook': 'fa-facebook-f',
        'LinkedIn': 'fa-linkedin-in',
        'YouTube': 'fa-youtube',
        'Twitter': 'fa-twitter',
        'TikTok': 'fa-tiktok',
        'Pinterest': 'fa-pinterest-p'
      };
      
      // Gerar HTML para cada rede social
      this.redesSociais.forEach(rede => {
        console.log('Rede atual:', rede);
        
        rede.valor= this.userProfile[rede.nome.toLowerCase()];
        console.log('Rede valor:', rede.valor);
        // if (rede.exibir) {
          const iconeClass = icones[rede.nome] || 'fa-link';
          html += `
            <div class="rede-item ${iconeClass}" (click)="navigateTo(${rede.valor})">
              <i class="fab ${iconeClass}"></i>
              <span>{{ ${this.userProfile}.${rede.valor} }}</span>
            </div>
          `
        // }
      });
      
      html += '</div>';
      this.html = html;
    // } 
    // else {
    //   html += '<p>Nenhuma rede social disponível.</p>';
    // }
    
    // Sanitizar o HTML para evitar problemas de segurança
    this.redesHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    console.log('HTML gerado para redes sociais:', html);
  }

  navigateTo(iconeClass: string) {
    console.log('RedesComponent - navigateTo chamado:', iconeClass);
    console.log('RedesComponent -this.userProfile[iconeClass]:', this.userProfile[iconeClass]);
    this.util.go_url(this.userProfile[iconeClass]);
  }

  // Verificar se uma rede social está preenchida
  private verificarRede(valor: string): boolean {
    if (!valor) return false;
    let ok = valor.trim().length > 0;
    return ok;
  }

  // Método para formatar URL
  private formatUrl(rede: string, valor: string): string {
    if (!valor) return '';
    
    valor = valor.trim();
    
    if (valor.startsWith('http://') || valor.startsWith('https://')) {
      return valor;
    }
    
    switch (rede) {
      case 'Instagram':
        return `https://instagram.com/${valor.replace('@', '')}`;
      case 'Facebook':
        return `https://facebook.com/${valor}`;
      case 'LinkedIn':
        return `https://linkedin.com/in/${valor}`;
      case 'YouTube':
        return `https://youtube.com/${valor.startsWith('@') ? valor : '@' + valor}`;
      case 'Twitter':
        return `https://twitter.com/${valor.replace('@', '')}`;
      case 'TikTok':
        return `https://tiktok.com/@${valor.replace('@', '')}`;
      case 'Pinterest':
        return `https://pinterest.com/${valor.replace('@', '')}`;
      default:
        return valor;
    }
  }
  
  // Verificar se o usuário tem pelo menos uma rede social configurada
  hasRedesSociais(): boolean {
    return this.redesSociais.some(rede => rede.exibir);
  }
}