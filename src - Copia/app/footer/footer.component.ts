import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa a autenticação do Firebase
import firebase from 'firebase/compat/app'; // Importa o firebase para usar firebase.User
import { ConfigService } from '../shared/config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  user: firebase.User | null = null; // Armazena o usuário logado
  show_footer: boolean = false;
  ambiente: string = '';

  constructor(
    private router: Router,
    private auth: AngularFireAuth, // Injeta o serviço de autenticação
    public config: ConfigService
  ) { }

  ngOnInit() {
    console.log("ngOnInit()");

    // Verifica se há um usuário logado e armazena as informações
    this.auth.authState.subscribe((user) => {
      this.user = user;
      console.log(user);
      if(user?.email=='julio@dentistas.com.br'){
        this.config.is_admin = true;
      }
      else {
        this.config.is_admin = false;
      }
      console.log("this.config.is_admin = " + this.config.is_admin);
      console.log(user);

      this.ambiente = this.config.getAmbiente();
      this.show_footer = true;
    });
  }

  // Método para logout
  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']); // Redireciona para a página de login após o logout
    });
  }

  // Método para navegação dinâmica
  go(component: string) {
    this.router.navigate(['/' + component]);
  }
}
