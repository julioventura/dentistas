import { Component, HostListener, OnInit } from '@angular/core';
import { CamposService } from '../shared/campos.service';
import { NavegacaoService } from '../shared/navegacao.service';

@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.scss']
})
export class FormulariosComponent implements OnInit {
  colecaoSelecionada: string = 'padrao'; // Seleciona "padrao" inicialmente
  campos: any[] = []; // Armazena os campos da coleção selecionada
  colecoes: any[] = []; // Lista de coleções disponíveis
  camposIniciais: any[] = []; // Armazena os campos ao carregar a página

  constructor(
    private camposService: CamposService,
    private navegacaoService: NavegacaoService,
  ) { }

  ngOnInit(): void {
    this.carregarColecoes();
    this.carregarCampos();
  }

  carregarColecoes() {
    this.camposService.getColecoes().subscribe((colecoes) => {
      this.colecoes = ['padrao', ...colecoes]; // 'padrao' aparece primeiro na lista de coleções
    });
  }

  carregarCampos() {
    // Carrega os campos da coleção selecionada
    this.camposService.getFormularios(this.colecaoSelecionada).subscribe((campos) => {
      this.campos = campos;
      this.camposIniciais = JSON.parse(JSON.stringify(campos)); // Faz uma cópia dos campos iniciais
    });
  }

  salvar() {
    // Salva as configurações da coleção atual
    this.camposService.setFormularios(this.colecaoSelecionada, this.campos).then(() => {
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
      this.camposService.setFormularios(novaColecao, [...this.camposService.camposPadrao]).then(() => {
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
