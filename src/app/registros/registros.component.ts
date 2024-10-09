import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegacaoService } from '../shared/navegacao.service';
import { FirestoreService } from '../shared/firestore.service';
import { Registro } from './registro.model';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Usar AngularFireAuth
import { UserService } from '../shared/user.service'; // Serviço de usuário para pegar o ID
import firebase from 'firebase/compat/app'; // Importa firebase para usar firebase.User

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.scss']
})
export class RegistrosComponent implements OnInit {
  collection!: string;
  registros: Registro[] = [];
  totalRegistros = 0;
  page = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];
  userId: string | null = null; // ID do usuário logado
  titulo_da_pagina: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navegacaoService: NavegacaoService,
    private firestoreService: FirestoreService<Registro>,
    private afAuth: AngularFireAuth,  // Usando AngularFireAuth para autenticação
    private userService: UserService // Injeta o serviço de usuário
  ) { 
  }
  
  ngOnInit() {
    // Pega a coleção da URL (ex: 'pacientes', 'usuarios')
    this.collection = this.route.snapshot.paramMap.get('collection')!;
    console.log("Registros de " + this.collection);
    this.titulo_da_pagina = this.collection.charAt(0).toUpperCase() + this.collection.slice(1).toLowerCase();

    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid; // Define o ID do usuário logado
        this.loadRegistros(); // Carrega os registros do usuário
      }
    });
  }

  loadRegistros() {
    if (!this.userId) return; // Verifica se o userId está disponível

    // Carrega os registros da subcoleção específica do usuário
    this.firestoreService
      .getRegistros(`users/${this.userId}/registros`)
      .subscribe((registros: Registro[]) => {
        this.registros = registros;
        this.totalRegistros = this.registros.length;
        this.totalPages = Math.ceil(this.totalRegistros / this.pageSize);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      });
  }

  setPage(page: number) {
    this.page = page;
    this.loadRegistros();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  voltar() {
    this.navegacaoService.goBack();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadRegistros();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadRegistros();
    }
  }

  verFicha(id: string) {
    console.log('Navegando para a ficha do registro com ID:', id);
    this.router.navigate(['/view/registros', id]);
  }

  adicionar() {
    if (!this.userId) return; // Verifica se o userId está disponível

    this.firestoreService
      .gerarProximoCodigo(`users/${this.userId}/registros`)
      .then((novoCodigo) => {
        const novoRegistro: Registro = {
          id: this.firestoreService.createId(),
          codigo: novoCodigo,
          nome: '',
          sexo: '',
          cpf: '',
          telefone: '',
          nascimento: '',
        };

        // Adiciona o novo registro à subcoleção do usuário logado
        this.firestoreService
          .addRegistro(`users/${this.userId}/registros`, novoRegistro)
          .then(() => {
            this.router.navigate(['/edit/registros', novoRegistro.id]);
          })
          .catch((error) => {
            console.error('Erro ao adicionar novo registro:', error);
            alert('Erro ao adicionar novo registro.');
          });
      });
  }
}
