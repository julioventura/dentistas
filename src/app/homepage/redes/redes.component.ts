import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from '../../shared/utils/util.service';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-redes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './redes.component.html',
  styleUrls: ['./redes.component.scss']
})
export class RedesComponent implements OnChanges {


  constructor(public util: UtilService,
    public userService: UserService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('RedesComponent - ngOnChanges chamado');

    // Verificar se o userService.userProfile mudou
    if (changes['userService.userProfile']) {
      console.log('RedesComponent - userService.userProfile atualizado:', this.userService.userProfile);


      // Debugging: verificar a estrutura do objeto userService.userProfile
      if (this.userService.userProfile) {
        // console.log('RedesComponent - Estrutura completa do userService.userProfile:', JSON.stringify(this.userService.userProfile));
        console.log('userService.userProfile:', this.userService.userProfile);

        console.log('this.userService.userProfile.instagram', this.userService.userProfile.instagram);
        console.log('this.userService.userProfile.facebook', this.userService.userProfile.facebook);
        console.log('this.userService.userProfile.linkedin', this.userService.userProfile.linkedin);
        console.log('this.userService.userProfile.youtube', this.userService.userProfile.youtube);
        console.log('this.userService.userProfile.twitter', this.userService.userProfile.twitter);
        console.log('this.userService.userProfile.tiktok', this.userService.userProfile.tiktok);
        console.log('this.userService.userProfile.pinterest', this.userService.userProfile.pinterest);

      }


    }
  }

  // Verificar se o usuário tem pelo menos uma rede social configurada
  hasRedesSociais(): boolean {
    if (this.userService.userProfile &&
      (this.userService.userProfile.instagram ||
        this.userService.userProfile.facebook ||
        this.userService.userProfile.linkedin ||
        this.userService.userProfile.youtube ||
        this.userService.userProfile.twitter ||
        this.userService.userProfile.tiktok ||
        this.userService.userProfile.pinterest)) {
      return true;
    }
    else {
      return false;
    }
  }

  // Métodos para navegar até URLs de redes sociais
  navigateToInstagram(): void {
    if (this.userService.userProfile.instagram) {

      this.util.go_url(this.userService.userProfile.instagram);
    }
  }

  navigateToFacebook(): void {
    if (this.userService.userProfile?.facebook) {
      this.util.go_url(this.userService.userProfile.facebook);
    }
  }

  navigateToLinkedin(): void {
    if (this.userService.userProfile?.linkedin) {
      this.util.go_url(this.userService.userProfile.linkedin);
    }
  }

  navigateToYoutube(): void {
    if (this.userService.userProfile?.youtube) {
      this.util.go_url(this.userService.userProfile.youtube);
    }
  }

  navigateToTwitter(): void {
    if (this.userService.userProfile?.twitter) {
      this.util.go_url(this.userService.userProfile.twitter);
    }
  }

  navigateToTiktok(): void {
    if (this.userService.userProfile?.tiktok) {
      this.util.go_url(this.userService.userProfile.tiktok);
    }
  }

  navigateToPinterest(): void {
    if (this.userService.userProfile?.pinterest) {
      this.util.go_url(this.userService.userProfile.pinterest);
    }
  }

  // Instagram
  getInstagramUrl(): string {
    return this.userService.userProfile?.instagram || '';
  }

  // Facebook
  getFacebookUrl(): string {
    return this.userService.userProfile?.facebook || '';
  }

  // LinkedIn
  getLinkedinUrl(): string {
    return this.userService.userProfile?.linkedin || '';
  }

  // YouTube
  getYoutubeUrl(): string {
    return this.userService.userProfile?.youtube || '';
  }

  // Twitter
  getTwitterUrl(): string {
    return this.userService.userProfile?.twitter || '';
  }

  // TikTok
  getTikTokUrl(): string {
    return this.userService.userProfile?.tiktok || '';
  }

  // Pinterest
  getPinterestUrl(): string {
    return this.userService.userProfile?.pinterest || '';
  }
}