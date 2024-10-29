import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface Subcolecao {
  nome: string;
  rota: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  // Recebe a coleção e ID para uso no carregamento de subcoleções e navegação
  @Input() collection: string = '';
  @Input() id: string = '';
  subcolecoes: Subcolecao[] = [];
  userId: string = '';

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    console.log("NgOnInit()");
    console.log("MenuComponent -> Collection:", this.collection);
    console.log("MenuComponent -> ID:", this.id);

    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        // Agora você pode carregar as configurações do menu

        if (!this.collection || !this.id) {
          console.warn('Collection ou ID não foram passados corretamente.');
          return;
        }

        this.carregarSubcolecoes();
      }
    });

    
  }

  carregarSubcolecoes() {
    this.firestore.collection('users').doc(this.userId).collection('configuracoesMenu').doc(this.collection).get()
      .subscribe(doc => {
        if (doc.exists) {
          const dados = doc.data() as { subcolecoes: string[] } | undefined;
          if (dados && dados.subcolecoes) {
            this.subcolecoes = dados.subcolecoes.map(nome => ({
              nome,
              rota: `/list-fichas/${this.collection}/${this.id}/fichas/${nome.toLowerCase()}`
            }));
          } else {
            console.warn(`Nenhuma subcoleção configurada para a coleção "${this.collection}".`);
          }
        } else {
          console.warn(`Documento "configuracoesMenu/${this.collection}" não encontrado.`);
        }
      }, error => {
        console.error('Erro ao carregar subcoleções:', error);
      });
  }



  // Função para navegar para a rota da subcoleção selecionada
  navegarPara(subcolecao: Subcolecao) {
    // Navega para a rota da subcoleção configurada
    this.router.navigate([subcolecao.rota]);
    console.log(`Navegando para a subcoleção: ${subcolecao.nome} na rota: ${subcolecao.rota}`);
  }

}
