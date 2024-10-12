import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { NavegacaoService } from '../shared/navegacao.service';
import { UserService } from '../shared/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CamposService } from '../shared/campos.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  collection!: string;
  registro: any = null;
  id!: string;
  isLoading = true;
  titulo_da_pagina: string = '';
  userId: string | null = null;
  campos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>,
    private navegacaoService: NavegacaoService,
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private camposService: CamposService
  ) { }

  ngOnInit() {
    this.collection = this.route.snapshot.paramMap.get('collection')!;
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.titulo_da_pagina = this.collection.charAt(0).toUpperCase() + this.collection.slice(1).toLowerCase();
    this.carregarCampos();

    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;

        if (this.id && this.collection) {
          this.titulo_da_pagina = this.titulo_view(this.collection);
          this.loadRegistro(this.id);
        }
      }
    });
  }

  carregarCampos() {
    this.camposService.getFormularios(this.collection).subscribe((campos: any[]) => {
      this.campos = campos || [];
    });
  }

  titulo_view(collection: string) {
    switch (this.collection) {
      case 'usuarios':
        return 'Usuário';
      case 'professores':
        return 'Professor';
      case 'alunos':
        return 'Aluno';
      case 'pacientes':
        return 'Paciente';
      case 'equipe':
        return 'Equipe';
      default:
        return 'Registro';
    }
  }

  loadRegistro(id: string) {
    if (!this.userId) return;

    this.firestoreService.getRegistroById(`users/${this.userId}/${this.collection}`, id).subscribe(
      (registro) => {
        this.registro = registro;
        this.isLoading = false;

        if (!this.registro) {
          console.error(`Registro com ID ${id} não encontrado na coleção ${this.collection}`);
          this.router.navigate([`/${this.collection}`]);
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Erro ao carregar registro:', error);
        this.router.navigate([`/${this.collection}`]);
      }
    );
  }

  voltar() {
    this.router.navigate([`/registros/${this.collection}`]);
  }

  editarRegistro() {
    this.router.navigate([`/edit/${this.collection}`, this.id]);
  }

  deletarRegistro() {
    if (confirm('Você tem certeza que deseja excluir este registro?')) {
      this.firestoreService.deleteRegistro(`users/${this.userId}/${this.collection}`, this.id)
        .then(() => {
          this.router.navigate([`/${this.collection}`]);
        })
        .catch((error) => {
          console.error('Erro ao excluir o registro:', error);
        });
    }
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  isImageUrl(url: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    try {
      const parsedUrl = new URL(url);
      const extension = parsedUrl.pathname.split('.').pop();
      return imageExtensions.includes(extension!.toLowerCase());
    } catch (e) {
      return false;
    }
  }

}
