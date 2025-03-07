import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from '../../shared/utils/util.service';

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

  constructor(public util: UtilService) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('RedesComponent - ngOnChanges chamado');

    // Verificar se o userProfile mudou
    if (changes['userProfile']) {
      console.log('RedesComponent - userProfile atualizado:', this.userProfile);

      // Marcar dados como carregados se userProfile existir
      this.dadosCarregados = false;

      // Debugging: verificar a estrutura do objeto userProfile
      if (this.userProfile) {
        // console.log('RedesComponent - Estrutura completa do userProfile:', JSON.stringify(this.userProfile));
        console.log('userProfile:', this.userProfile);
        
        this.dadosCarregados = true;

        console.log('this.userProfile.instagram', this.userProfile.instagram);
        console.log('this.userProfile.facebook', this.userProfile.facebook);
        console.log('this.userProfile.linkedin', this.userProfile.linkedin);
        console.log('this.userProfile.youtube', this.userProfile.youtube);    
        console.log('this.userProfile.twitter', this.userProfile.twitter);
        console.log('this.userProfile.tiktok', this.userProfile.tiktok);
        console.log('this.userProfile.pinterest', this.userProfile.pinterest);

      }

    
    }
  }

  // Verificar se o usuário tem pelo menos uma rede social configurada
  hasRedesSociais(): boolean {
    if (this.userProfile &&
        (this.userProfile.instagram ||
          this.userProfile.facebook ||
          this.userProfile.linkedin ||
          this.userProfile.youtube ||
          this.userProfile.twitter ||
          this.userProfile.tiktok ||
          this.userProfile.pinterest)) {
      return true;
    }
    else {
      return false;
    }
  }

  // Métodos para navegar até URLs de redes sociais
  navigateToInstagram(): void {
    if (this.userProfile?.instagram) {
      this.util.go_url(this.userProfile.instagram);
    }
  }

  navigateToFacebook(): void {
    if (this.userProfile?.facebook) {
      this.util.go_url(this.userProfile.facebook);
    }
  }

  navigateToLinkedin(): void {
    if (this.userProfile?.linkedin) {
      this.util.go_url(this.userProfile.linkedin);
    }
  }

  navigateToYoutube(): void {
    if (this.userProfile?.youtube) {
      this.util.go_url(this.userProfile.youtube);
    }
  }

  navigateToTwitter(): void {
    if (this.userProfile?.twitter) {
      this.util.go_url(this.userProfile.twitter);
    }
  }

  navigateToTiktok(): void {
    if (this.userProfile?.tiktok) {
      this.util.go_url(this.userProfile.tiktok);
    }
  }

  navigateToPinterest(): void {
    if (this.userProfile?.pinterest) {
      this.util.go_url(this.userProfile.pinterest);
    }
  }
 
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