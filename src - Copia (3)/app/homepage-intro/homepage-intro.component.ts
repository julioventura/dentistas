import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegacaoService } from '../shared/navegacao.service';

@Component({
  selector: 'app-homepage-intro',
  templateUrl: './homepage-intro.component.html',
  styleUrls: ['./homepage-intro.component.scss']
})
export class HomepageIntroComponent implements OnInit {
  public username: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private navegacaoService: NavegacaoService,
  ) { }

  ngOnInit(): void {
    // Obtém o parâmetro username da rota
    this.username = this.route.snapshot.paramMap.get('username');
  }

  // Função para abrir a homepage em uma nova aba
  openHomepage(): void {
    if (this.username) {
      const homepageUrl = `/${this.username}`;
      window.open(homepageUrl, '_blank', 'noopener,noreferrer');
    }
  }

  voltar() {
    this.navegacaoService.goBack();
  }
  
}
