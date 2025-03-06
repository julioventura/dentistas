import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-redes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './redes.component.html',
  styleUrls: ['./redes.component.scss']
})
export class RedesComponent implements OnChanges {
  @Input() userProfile: any;
  @Input() darkMode: boolean = false;
  
  // Propriedade para rastrear se os dados estão carregados
  dadosCarregados = false;
  
  // Use ngOnChanges em vez de ngOnInit para detectar quando userProfile é atualizado
  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges called', changes);
    if (changes['userProfile']) {
      console.log('RedesComponent - userProfile received:', this.userProfile);
      
      // Marcar dados como carregados mesmo se userProfile for null ou undefined
      // Isso permitirá que a lógica do template lide com valores ausentes
      this.dadosCarregados = true;
      
      if (this.userProfile) {
        // Log das redes sociais disponíveis
        console.log('Instagram:', this.userProfile.instagram);
        console.log('Facebook:', this.userProfile.facebook);
        console.log('LinkedIn:', this.userProfile.linkedin);
        console.log('YouTube:', this.userProfile.youtube);
        console.log('Twitter:', this.userProfile.twitter);
        console.log('TikTok:', this.userProfile.tiktok);
        console.log('Pinterest:', this.userProfile.pinterest);
      } else {
        console.warn('userProfile is null or undefined');
      }
    }
  }
  
  // Verificar se o usuário tem pelo menos uma rede social configurada
  hasRedesSociais(): boolean {
    // Simplificar a verificação para depuração - mostramos a seção mesmo se a verificação falhar
    console.log('hasRedesSociais called, userProfile:', this.userProfile);
    
    if (!this.userProfile) {
      console.warn('userProfile is null or undefined in hasRedesSociais');
      return false;
    }
    
    const hasAny = !!(
      this.userProfile.instagram || 
      this.userProfile.facebook || 
      this.userProfile.linkedin || 
      this.userProfile.youtube ||
      this.userProfile.twitter ||
      this.userProfile.tiktok ||
      this.userProfile.pinterest
    );
    
    console.log('Has any social media:', hasAny);
    return hasAny;
  }

  // MÉTODOS SIMPLIFICADOS PARA RETORNAR APENAS O CONTEÚDO ORIGINAL
  
  // Instagram
  getInstagramUrl(): string {
    return this.userProfile?.instagram || '';
  }

  // Facebook
  getFacebookUrl(): string {
    return this.userProfile?.facebook || '';
  }

  // LinkedIn
  getLinkedinUrl(): string {
    return this.userProfile?.linkedin || '';
  }

  // YouTube
  getYoutubeUrl(): string {
    return this.userProfile?.youtube || '';
  }

  // Twitter
  getTwitterUrl(): string {
    return this.userProfile?.twitter || '';
  }

  // TikTok
  getTikTokUrl(): string {
    return this.userProfile?.tiktok || '';
  }

  // Pinterest
  getPinterestUrl(): string {
    return this.userProfile?.pinterest || '';
  }
  

}