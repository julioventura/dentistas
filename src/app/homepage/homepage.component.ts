import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  public userProfile: any = {}; // Dados do perfil público
  public username: string | null = null;
  public currentYear: number = new Date().getFullYear(); // Obtém o ano atual

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService<any> // Serviço Firestore para buscar dados
  ) { }

  ngOnInit(): void {
    // Captura o parâmetro 'username' da rota
    this.username = this.route.snapshot.paramMap.get('username');

    if (this.username) {
      this.loadUserProfile(this.username);
    }
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
}
