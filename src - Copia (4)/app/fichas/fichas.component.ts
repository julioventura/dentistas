import { Component, HostListener, OnInit } from '@angular/core';
import { NavegacaoService } from '../shared/navegacao.service';
import { CamposFichaService } from '../shared/campos-ficha.service';
import { UserService } from '../shared/user.service'; // 
import { UtilService } from '../shared/utils/util.service';

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
  userId: string = ''; // Armazena o userId do usuário logado


  constructor(
    private CamposFichaService: CamposFichaService,
    private navegacaoService: NavegacaoService,
    private userService: UserService,
    public util: UtilService,

  ) { }

  ngOnInit(): void {
    // Obtém o userId do usuário logado
    this.userService.getUser().subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid; // Armazena o uid do usuário logado
        console.log("User ID:", this.userId);

        // Após recuperar o userId, carregar coleções e campos
        this.carregarColecoes();
        this.carregarCampos();
      } else {
        console.error("Usuário não está autenticado.");
      }
    });
  }

  carregarColecoes() {
    this.CamposFichaService.getColecoes(this.userId).subscribe((colecoes) => {
      this.colecoes = ['padrao', ...colecoes]; // 'padrao' aparece primeiro na lista de coleções
    });
  }

  carregarCampos() {
    // Carrega os campos da coleção selecionada
    this.CamposFichaService.getCamposRegistro(this.userId, this.colecaoSelecionada).subscribe((campos) => {
      this.campos = campos;
      this.camposIniciais = JSON.parse(JSON.stringify(campos)); // Faz uma cópia dos campos iniciais
    });
  }

  salvar() {
    // Salva as configurações da coleção atual
    this.CamposFichaService.setCamposRegistro(this.userId, this.colecaoSelecionada, this.campos).then(() => {
      alert('Configurações salvas com sucesso!');
      this.camposIniciais = JSON.parse(JSON.stringify(this.campos)); // Atualiza os campos iniciais após salvar
    });
  }

  adicionarCampo() {
    // Adiciona um novo campo com nome e tipo padrão
    this.campos.push({ nome: '', tipo: 'text', label: '' });
  }

  removerCampo(index: number) {
    // Adiciona um alerta de confirmação antes de remover o campo
    const confirmacao = confirm('Você tem certeza que deseja remover este campo?');
    if (confirmacao) {
      // Se o usuário confirmar, o campo é removido
      this.campos.splice(index, 1);
    }
  }

  adicionarColecao() {
    const novaColecao = prompt('Digite o nome da nova coleção:');
    if (novaColecao) {
      // Cria a nova coleção com base nos campos padrão
      this.CamposFichaService.setCamposRegistro(this.userId, novaColecao, [...this.CamposFichaService.camposPadrao]).then(() => {
        this.colecaoSelecionada = novaColecao;
        this.carregarColecoes();
        this.carregarCampos();
      });
    }
  }

  // Função para mover campo para cima
  moverCampoParaCima(index: number) {
    if (index > 0) {
      [this.campos[index - 1], this.campos[index]] = [this.campos[index], this.campos[index - 1]];
    }
  }

  // Função para mover campo para baixo
  moverCampoParaBaixo(index: number) {
    if (index < this.campos.length - 1) {
      [this.campos[index + 1], this.campos[index]] = [this.campos[index], this.campos[index + 1]];
    }
  }

  voltar() {
    this.navegacaoService.goBack();
  }

  // HostListener para interceptar o evento de saída da página
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (JSON.stringify(this.campos) !== JSON.stringify(this.camposIniciais)) {
      $event.returnValue = true; // Mostra o alerta de confirmação de saída
    }
  }
}
