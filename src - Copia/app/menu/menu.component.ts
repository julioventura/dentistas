import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilService } from '../shared/util.service';

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
    private util: UtilService
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
    const configPath = `users/${this.userId}/configuracoesMenu`;

    this.firestore.collection(configPath).doc(this.collection).get()
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
          console.warn(`Documento "configuracoesMenu/${this.collection}" não encontrado. Criando configuração padrão...`);

          // Usa o método getMenusPadraoPorCollection para obter subcoleções padrão
          const subcolecoesPadrao = this.getMenusPadraoPorCollection(this.collection);

          this.firestore.collection(configPath).doc(this.collection).set({ subcolecoes: subcolecoesPadrao })
            .then(() => {
              console.log(`Configuração padrão criada para a coleção "${this.collection}".`);
              this.subcolecoes = subcolecoesPadrao.map(nome => ({
                nome,
                rota: `/list-fichas/${this.collection}/${this.id}/fichas/${nome}`
              }));
            })
            .catch(error => {
              console.error('Erro ao criar configuração de subcoleções padrão:', error);
            });
        }
      }, error => {
        console.error('Erro ao carregar subcoleções:', error);
      });
  }



  getMenusPadraoPorCollection(colecao: string): any[] {
    const menusPadrao: { [key: string]: any[] } = {
      pacientes: ['exames', 'planos', 'atendimentos', 'pagamentos', 'historico'],
      clientes: ['planos', 'atendimentos', 'pagamentos', 'historico'],
      alunos: ['planos', 'atendimentos', 'historico'],
      professores: ['planos', 'atendimentos', 'historico'],
      dentistas: ['planos', 'atendimentos', 'pagamentos', 'historico'],
      equipe: ['planos', 'atendimentos', 'pagamentos', 'historico'],
      proteticos: ['planos', 'atendimentos', 'pagamentos', 'historico']
    };

    return menusPadrao[colecao] || [];
  }


  // Função para navegar para a rota da subcoleção selecionada
  navegarPara(subcolecao: Subcolecao) {
    console.log("navegarPara()");
    console.log("subcolecao =",subcolecao);
    console.log("subcolecao.nome =",subcolecao.nome);

    // Navega para a rota da subcoleção configurada
    if(subcolecao.nome == "erupcoes") {
      this.util.go("erupcoes");
      console.log(`Navegando para erupcoes`);
    }
    else {
      this.router.navigate([subcolecao.rota]);
      console.log(`Navegando para a subcoleção: ${subcolecao.nome} na rota: ${subcolecao.rota}`);    }
  }

}