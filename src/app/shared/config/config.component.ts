import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { NavegacaoService } from '../navegacao.service';
import { ConfigService } from '../config.service';  
import { UtilService } from '../utils/util.service';
import { SubcolecaoService, Subcolecao } from '../subcolecao.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  standalone: false
})

export class ConfigComponent implements OnInit {
  ambiente: string = '';
  new_window: boolean = false;
  colecaoSelecionada: string = '';

  colecoesDisponiveis = [
    'Campos das coleções',
    'Campos das fichas sub-coleções',
    'Menu das fichas',
    'Seu perfil',
    'Sua homepage',
  ];

 // A array agora será carregada dinamicamente pelo serviço
 subcolecoesDisponiveis: { nome: string; selecionado: boolean }[] = [];


  constructor(
    public config: ConfigService,
    private router: Router,
    private navegacaoService: NavegacaoService,
    public util: UtilService,
    private firestore: AngularFirestore,
    private subcolecaoService: SubcolecaoService
  ) { }

  ngOnInit(): void {
    console.log("ngOnInit()");
    // Pegando as configurações do ConfigService

    this.ambiente = this.config.getAmbiente();

    // Carregar a lista de subcoleções dinamicamente a partir do SubcolecaoService
    this.carregarSubcolecoesDisponiveis();
  }

  carregarSubcolecoesDisponiveis() {
    // Obter as subcoleções definidas no serviço e mapear para incluir o campo "selecionado"
    this.subcolecoesDisponiveis = this.subcolecaoService.getSubcolecoesDisponiveis().map(sub => ({
      nome: sub.nome,
      // Definir true para 'exames' ou como padrão false
      selecionado: sub.nome === 'exames' ? true : false
    }));
  }

  selecionarColecao(colecao: string) {
    // Toggle entre a coleção e uma string vazia para "desselecionar"
    this.colecaoSelecionada = this.colecaoSelecionada === colecao ? '' : colecao;
    this.carregarConfiguracoes();
  }


  // Método para navegação dinâmica
  go(component: string, new_window: boolean = false) {
    this.new_window = new_window;
    if (new_window) {
      const introUrl = `/${component}/intro`;
      this.router.navigate([introUrl]); // Navega para a introdução no próprio app
    } else {
      this.router.navigate(['/' + component]);
    }
  }

  
  carregarConfiguracoes() {
    if (this.colecaoSelecionada) {
      this.firestore.collection('configuracoesMenu').doc(this.colecaoSelecionada).get().subscribe(doc => {
        const dados = doc.data() as { subcolecoes?: string[] };
        if (dados?.subcolecoes) {
          this.subcolecoesDisponiveis = this.subcolecoesDisponiveis.map(sub => ({
            ...sub,
            selecionado: dados.subcolecoes?.includes(sub.nome) || false
          }));
        }
      });
    }
  }

  
  
  // salvar() {
  // }


  salvarConfiguracoes() {
    const subcolecoesSelecionadas = this.subcolecoesDisponiveis
      .filter(sub => sub.selecionado)
      .map(sub => sub.nome);

    this.firestore.collection('configuracoesMenu').doc(this.colecaoSelecionada).set({
      subcolecoes: subcolecoesSelecionadas
    }).then(() => {
      alert('Configurações salvas com sucesso!');
    }).catch(error => {
      console.error('Erro ao salvar configurações:', error);
    });
  }


  voltar() {
    this.navegacaoService.goBack(); 
  }


}
