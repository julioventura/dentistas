import { Component, HostListener, OnInit } from '@angular/core';
import { NavegacaoService } from '../shared/navegacao.service';
import { CamposFichaService } from '../shared/campos-ficha.service';
import { FirestoreService } from '../shared/firestore.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fichas',
  templateUrl: './fichas.component.html',
  styleUrls: ['./fichas.component.scss']
})
export class FichasComponent implements OnInit {
  colecaoSelecionada: string = 'padrao'; // Seleciona "padrao" inicialmente
  campos: any[] = []; // Armazena os campos da coleção selecionada
  colecoes: any[] = []; // Lista de coleções disponíveis
  camposIniciais: any[] = []; // Armazena os campos ao carregar a página
  subColecoes: any[] = []; // Armazena as sub-coleções (exames, atendimentos, etc.)
  fichas: any[] = []; // Lista de fichas carregadas
  fichaSelecionadaId: string | null = null; // ID da ficha selecionada
  ficha: any = null; // Armazena os detalhes da ficha selecionada
  isLoading: boolean = true; // Indicador de carregamento
  collection!: string;
  id!: string;

  constructor(
    private camposFichaService: CamposFichaService,
    private navegacaoService: NavegacaoService,
    private firestoreService: FirestoreService<any>,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.collection = this.route.snapshot.paramMap.get('collection')!;
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.fichaSelecionadaId = this.route.snapshot.paramMap.get('fichaId');
    this.carregarColecoes();

    if (this.fichaSelecionadaId) {
      this.carregarFicha(this.fichaSelecionadaId);
    } else {
      this.carregarFichas();
    }
  }

  carregarColecoes() {
    this.camposFichaService.getColecoesFichas().subscribe((colecoes) => {
      this.colecoes = ['padrao', ...colecoes];
      if (this.colecoes.length > 0) {
        this.colecaoSelecionada = this.colecoes[0];
        this.carregarCampos();
        this.carregarSubColecoes();
      }
    }, (error) => {
      console.error('Erro ao carregar coleções de fichas:', error);
    });
  }

  carregarCampos() {
    this.camposFichaService.getCamposFicha(this.colecaoSelecionada).subscribe((campos) => {
      this.campos = campos || [];
      this.camposIniciais = JSON.parse(JSON.stringify(campos));
    }, (error) => {
      console.error(`Erro ao carregar campos da coleção ${this.colecaoSelecionada}:`, error);
    });
  }

  carregarSubColecoes() {
    const caminhoSubColecoes = `users/${this.id}/${this.collection}/fichas`;
    this.firestoreService.getColecao(caminhoSubColecoes).subscribe((subColecoes) => {
      this.subColecoes = subColecoes || [];
    }, (error) => {
      console.error('Erro ao carregar sub-coleções:', error);
    });
  }

  carregarFichas(): void {
    const fichasPath = `users/${this.id}/${this.collection}/fichas`;
    this.firestoreService.getColecao(fichasPath).subscribe((fichas) => {
      this.fichas = fichas;
      this.isLoading = false;
    });
  }
  // carregarFichas() {
  //   const collectionPath = 'users/yourUserId/fichas'; // Atualize para o caminho correto
  //   this.firestoreService.getColecao(collectionPath).subscribe((fichas: any[]) => {
  //     this.fichas = fichas;
  //     console.log('Fichas carregadas:', this.fichas);
  //   });
  // }

  carregarFicha(fichaId: string): void {
    const fichaPath = `users/${this.id}/${this.collection}/fichas/${fichaId}`;
    this.firestoreService.getRegistroById(fichaPath, fichaId).subscribe((ficha) => {
      this.ficha = ficha;
      this.isLoading = false;
    });
  }

  salvar() {
    this.camposFichaService.setCamposFicha(this.colecaoSelecionada, this.campos).then(() => {
      alert('Configurações salvas com sucesso!');
      this.camposIniciais = JSON.parse(JSON.stringify(this.campos));
    }).catch((error) => {
      console.error('Erro ao salvar as configurações:', error);
      alert('Erro ao salvar as configurações.');
    });
  }

  adicionarCampo() {
    this.campos.push({ nome: '', tipo: 'text', label: '' });
  }

  removerCampo(index: number) {
    const confirmacao = confirm('Você tem certeza que deseja remover este campo?');
    if (confirmacao) {
      this.campos.splice(index, 1);
    }
  }

  moverCampoParaCima(index: number) {
    if (index > 0) {
      [this.campos[index - 1], this.campos[index]] = [this.campos[index], this.campos[index - 1]];
    }
  }

  moverCampoParaBaixo(index: number) {
    if (index < this.campos.length - 1) {
      [this.campos[index + 1], this.campos[index]] = [this.campos[index], this.campos[index + 1]];
    }
  }

  voltar() {
    this.navegacaoService.goBack();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (JSON.stringify(this.campos) !== JSON.stringify(this.camposIniciais)) {
      $event.returnValue = true;
    }
  }
}
