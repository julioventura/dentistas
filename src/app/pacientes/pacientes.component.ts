import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavegacaoService } from '../shared/navegacao.service';
import { FirestoreService } from '../shared/firestore.service';  // Agora a interface Paciente está corretamente exportada
import { Paciente } from './paciente.model';  // Agora a interface Paciente está corretamente exportada

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss'],
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  totalPacientes = 0; // Atualizado para ser dinâmico com Firestore
  page = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];

  constructor(
    private router: Router, 
    private navegacaoService: NavegacaoService, 
    private firestoreService: FirestoreService<Paciente>  // Injeta o FirestoreService
  ) {}

  ngOnInit() {
    this.loadPacientes();
  }

  loadPacientes() {
    // Carrega os pacientes do Firestore
    this.firestoreService.getRegistros('pacientes').subscribe((pacientes: Paciente[]) => {
      this.pacientes = pacientes;
      this.totalPacientes = this.pacientes.length;
      this.totalPages = Math.ceil(this.totalPacientes / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    });
  }

  setPage(page: number) {
    this.page = page;
    this.loadPacientes(); // Recarrega os pacientes com a nova página
  }

  // Método para ir para a página home
  goHome() {
    this.router.navigate(['/home']);
  }

  // Método para voltar para a página anterior
  voltar() {
    this.navegacaoService.goBack();  // Chama o método do serviço para voltar
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadPacientes();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadPacientes();
    }
  }

  // Método para navegar para a ficha do paciente
  verFicha(id: string) {
    console.log("Navegando para a ficha do paciente com ID:", id);  // Verifica o valor de 'id'
    this.router.navigate(['/view/pacientes', id]);  // Navega para o componente view, passando a coleção 'pacientes' e o ID
  }

  adicionar() {
    this.firestoreService.gerarProximoCodigo('pacientes').then(novoCodigo => {
      const novoPaciente: Paciente = {
        id: this.firestoreService.createId(),  // Gera um novo ID automaticamente
        codigo: novoCodigo,  // Usa o código gerado automaticamente
        nome: '',
        sexo: '',
        cpf: '',
        telefone: '',
        nascimento: ''
      };

      // Adiciona o novo paciente ao Firestore
      this.firestoreService.addRegistro('pacientes', novoPaciente).then(() => {
        // Após adicionar, redireciona para a página de edição com o ID do novo paciente
        this.router.navigate(['/edit/pacientes', novoPaciente.id]);
      }).catch(error => {
        console.error('Erro ao adicionar novo paciente:', error);
        alert('Erro ao adicionar novo paciente.');
      });
    });
  }
}
