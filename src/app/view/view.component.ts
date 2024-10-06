import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { NavegacaoService } from '../shared/navegacao.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  registro: any = null;  // O registro começa como null para verificar posteriormente
  collection!: string;
  id!: string;
  isLoading = true;  // Variável para exibir o carregamento
  titulo: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>,  // Serviço genérico
    private navegacaoService: NavegacaoService
  ) {}

  ngOnInit() {
    // Pega a coleção da URL (ex: 'pacientes', 'usuarios')
    this.collection = this.route.snapshot.paramMap.get('collection')!;
    this.id = this.route.snapshot.paramMap.get('id')!;
    if (this.id && this.collection) {
      this.titulo = this.collection.replace(/s$/, '').replace(/^\w/, (c) => c.toUpperCase());  // Titulo do view é o nome da collection, no singular e capitalizado: Ex: collection "pacientes" fera titulo "Paciente"
      if (this.titulo == 'Usuario') {this.titulo = 'Usuário'}
      console.log("Titulo = " + this.titulo);
      this.loadRegistro(this.id);
    }
  }

  loadRegistro(id: string) {
    // Busca o registro a partir da coleção
    this.firestoreService.getRegistros(this.collection).subscribe(registros => {
      this.registro = registros.find((registro: any) => registro.id === id);
      this.isLoading = false;  // Desativa o modo de carregamento após receber os dados

      if (!this.registro) {
        console.error(`Registro com ID ${id} não encontrado na coleção ${this.collection}`);
        this.router.navigate([`/${this.collection}`]);  // Redireciona para a página de listagem
      }
    }, error => {
      this.isLoading = false;
      console.error('Erro ao carregar registro:', error);
      this.router.navigate([`/${this.collection}`]);  // Redireciona em caso de erro
    });
  }

  voltar() {
    this.router.navigate([`/${this.collection}`]);  // Redireciona para o componente da coleção correspondente
  }

  editarRegistro() {
    this.router.navigate([`/edit/${this.collection}`, this.id]);
  }

  deletarRegistro() {
    if (confirm('Você tem certeza que deseja excluir este registro?')) {
      this.firestoreService.deleteRegistro(this.collection, this.id).then(() => {
        this.router.navigate([`/${this.collection}`]);  // Redireciona para a página de listagem após exclusão
      }).catch(error => {
        console.error('Erro ao excluir o registro:', error);
      });
    }
  }
}
