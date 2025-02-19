import { Component, HostListener, OnInit } from '@angular/core';
import { NavegacaoService } from '../shared/navegacao.service';
import { CamposFichaService } from '../shared/campos-ficha.service';
import { UserService } from '../shared/user.service';
import { UtilService } from '../shared/utils/util.service';

@Component({
  selector: 'app-fichas',
  templateUrl: './fichas.component.html',
  styleUrls: ['./fichas.component.scss'],
  standalone: false
})
export class FichasComponent implements OnInit {
  colecaoSelecionada: string = 'padrao'; // Seleciona "padrao" inicialmente
  campos: any[] = []; // Armazena os campos fixos da coleção selecionada
  colecoes: string[] = []; // Lista fixa de coleções disponíveis
  userId: string = ''; // UID do usuário logado

  constructor(
    private camposFichaService: CamposFichaService,
    private navegacaoService: NavegacaoService,
    private userService: UserService,
    public util: UtilService
  ) { }

  ngOnInit(): void {
    // Obtém o userId do usuário logado
    this.userService.getUser().subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        console.log("User ID:", this.userId);
        // Define as coleções fixas
        this.colecoes = [
          'padrao',
          'exames',
          'pagamentos',
          'atendimentos',
          'dentes',
          'dentesEndo',
          'dentesPerio',
          'anamnese',
          'diagnosticos',
          'riscoCarie'
        ];
        this.carregarCampos();
      } else {
        console.error("Usuário não está autenticado.");
      }
    });
  }

  carregarCampos() {
    // Carrega os campos fixos para a coleção selecionada
    this.camposFichaService.getCamposFichaRegistro(this.userId, this.colecaoSelecionada).subscribe(
      (campos) => {
        this.campos = campos;
      },
      (error) => {
        console.error('Erro ao carregar campos:', error);
        alert('Erro ao carregar campos. Tente novamente.');
      }
    );
  }

  voltar() {
    this.navegacaoService.goBack();
  }

  // Removemos os métodos de adicionar/mover/remover campos e de adicionar coleção,
  // pois os campos e coleções agora são fixos.

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    // Se não há edição, não é necessário interceptar a saída da página
  }
}
