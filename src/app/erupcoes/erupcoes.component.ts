import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilService } from '../shared/util.service';

@Component({
  selector: 'app-erupcoes',
  templateUrl: './erupcoes.component.html',
  styleUrls: ['./erupcoes.component.scss']
})
export class ErupcoesComponent implements OnInit {
  userId: string | null = null;
  pacientes: any[] = [];

  // Dados de erupção embutidos diretamente como JSON
  private erupcaoTabela = [
    // Dentes Decíduos
    { Dente: 51, De: 7.5, Nome: "Incisivo Central", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
    { Dente: 52, De: 9, Nome: "Incisivo Lateral", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
    { Dente: 53, De: 18, Nome: "Canino", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
    { Dente: 54, De: 14, Nome: "Primeiro Molar", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
    { Dente: 55, De: 24, Nome: "Segundo Molar", Dentição: "Decíduo", Lado: "Direito", Arcada: "Superior" },
    { Dente: 61, De: 7.5, Nome: "Incisivo Central", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
    { Dente: 62, De: 9, Nome: "Incisivo Lateral", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
    { Dente: 63, De: 18, Nome: "Canino", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
    { Dente: 64, De: 14, Nome: "Primeiro Molar", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
    { Dente: 65, De: 24, Nome: "Segundo Molar", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Superior" },
    { Dente: 71, De: 6, Nome: "Incisivo Central", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
    { Dente: 72, De: 7, Nome: "Incisivo Lateral", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
    { Dente: 73, De: 16, Nome: "Canino", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
    { Dente: 74, De: 12, Nome: "Primeiro Molar", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
    { Dente: 75, De: 20, Nome: "Segundo Molar", Dentição: "Decíduo", Lado: "Direito", Arcada: "Inferior" },
    { Dente: 81, De: 6, Nome: "Incisivo Central", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
    { Dente: 82, De: 7, Nome: "Incisivo Lateral", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
    { Dente: 83, De: 16, Nome: "Canino", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
    { Dente: 84, De: 12, Nome: "Primeiro Molar", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
    { Dente: 85, De: 20, Nome: "Segundo Molar", Dentição: "Decíduo", Lado: "Esquerdo", Arcada: "Inferior" },
 
    // Dentes Permanentes
    { Dente: 11, De: 84, Nome: "Incisivo Central", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
  { Dente: 12, De: 96, Nome: "Incisivo Lateral", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
  { Dente: 13, De: 132, Nome: "Canino", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
  { Dente: 14, De: 120, Nome: "Primeiro Pré-Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
  { Dente: 15, De: 120, Nome: "Segundo Pré-Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
  { Dente: 16, De: 72, Nome: "Primeiro Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
  { Dente: 17, De: 144, Nome: "Segundo Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
  { Dente: 18, De: 204, Nome: "Terceiro Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Superior" },
  { Dente: 21, De: 84, Nome: "Incisivo Central", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
  { Dente: 22, De: 96, Nome: "Incisivo Lateral", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
  { Dente: 23, De: 132, Nome: "Canino", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
  { Dente: 24, De: 120, Nome: "Primeiro Pré-Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
  { Dente: 25, De: 120, Nome: "Segundo Pré-Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
  { Dente: 26, De: 72, Nome: "Primeiro Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
  { Dente: 27, De: 144, Nome: "Segundo Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
  { Dente: 28, De: 204, Nome: "Terceiro Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Superior" },
  { Dente: 31, De: 72, Nome: "Incisivo Central", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
  { Dente: 32, De: 84, Nome: "Incisivo Lateral", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
  { Dente: 33, De: 108, Nome: "Canino", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
  { Dente: 34, De: 120, Nome: "Primeiro Pré-Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
  { Dente: 35, De: 132, Nome: "Segundo Pré-Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
  { Dente: 36, De: 72, Nome: "Primeiro Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
  { Dente: 37, De: 132, Nome: "Segundo Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
  { Dente: 38, De: 204, Nome: "Terceiro Molar", Dentição: "Permanente", Lado: "Direito", Arcada: "Inferior" },
  { Dente: 41, De: 72, Nome: "Incisivo Central", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
  { Dente: 42, De: 84, Nome: "Incisivo Lateral", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
  { Dente: 43, De: 108, Nome: "Canino", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
  { Dente: 44, De: 120, Nome: "Primeiro Pré-Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
  { Dente: 45, De: 132, Nome: "Segundo Pré-Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
  { Dente: 46, De: 72, Nome: "Primeiro Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
  { Dente: 47, De: 132, Nome: "Segundo Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" },
  { Dente: 48, De: 204, Nome: "Terceiro Molar", Dentição: "Permanente", Lado: "Esquerdo", Arcada: "Inferior" }
  ];


  
  pacientesComErupcao: any[] = [];
  resultados: any[] = [];

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    public util: UtilService
  ) { }


  ngOnInit(): void {
    console.log("ngOnInit()");

    // Obtém o ID do usuário autenticado e carrega os dados dos pacientes
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        this.carregarPacientes();
      } else {
        console.error('Usuário não autenticado.');
      }
    });

  }

  carregarPacientes(): void {
    console.log("carregarPacientes()");

    if (!this.userId) return;

    // Carrega os dados da coleção "pacientes" do usuário
    this.firestore
      .collection(`/users/${this.userId}/pacientes`)
      .valueChanges()
      .subscribe((pacientes: any[]) => {
        this.pacientes = pacientes.map(paciente => ({
          nome: paciente.nome,
          nascimento: paciente.nascimento,
          meses: paciente.meses,
        }));
        this.verificarErupcoes();
      });
  }

  verificarErupcoes(): void {
    console.log("Início da verificação de erupções");

    // Log da tabela de erupção de dentes e lista de pacientes
    console.log("Tabela de erupção de dentes:", this.erupcaoTabela);
    console.log("Lista de pacientes com idade calculada em meses:");
    
    this.pacientesComErupcao = this.pacientes.map(paciente => {
        // Cálculo de meses com base na data de nascimento

        console.log("=========================");
        console.log("Paciente = ", paciente);
        console.log("=========================");

        const dataNascimento = new Date(paciente.nascimento);
        const hoje = new Date();

        // const pacienteMeses = Math.floor(
        //     (hoje.getTime() - dataNascimento.getTime()) / (1000 * 60 * 60 * 24 * 30.44)  // Aproximação de 1 mês
        // );
        
        const pacienteMeses = paciente.meses;
        console.log("pacienteMeses = ", paciente.meses);


        console.log(`Nome: ${paciente.nome}, Nascimento: ${paciente.nascimento}, Meses calculados: ${pacienteMeses}`);

        // Filtra dentes que ainda não erupcionaram
        const dentesNaoNascidos = this.erupcaoTabela
            .filter(dente => {
                const inicioErupcao = Number(dente.De);

                console.log(`Verificando dente: ${dente.Dente}, De: ${inicioErupcao}, paciente.meses: ${pacienteMeses}`);

                return inicioErupcao > pacienteMeses;
            })
            .map(dente => dente.Dente);

        console.log("dentesNaoNascidos para", paciente.nome, "=", dentesNaoNascidos);

        return {
            nome: paciente.nome,
            nascimento: paciente.nascimento,
            dentesNaoNascidos,
        };
    }).filter(paciente => paciente.dentesNaoNascidos.length > 0);

    console.log("Pacientes com dentes ainda não erupcionados:", this.pacientesComErupcao);
}



}


  // 51: De 7.5
  // 52: De 9
  // 53: De 18
  // 54: De 14
  // 55: De 24
  // 61: De 7.5
  // 62: De 9
  // 63: De 18
  // 64: De 14
  // 65: De 24
  // 71: De 6
  // 72: De 7
  // 73: De 16
  // 74: De 12
  // 75: De 20
  // 81: De 6
  // 82: De 7
  // 83: De 16
  // 84: De 12
  // 85: De 20
  // 11: De 84
  // 12: De 96
  // 13: De 132
  // 14: De 120
  // 15: De 120
  // 16: De 72
  // 17: De 144
  // 18: De 204
  // 21: De 84
  // 22: De 96
  // 23: De 132
  // 24: De 120
  // 25: De 120
  // 26: De 72
  // 27: De 144
  // 28: De 204
  // 31: De 72
  // 32: De 84
  // 33: De 108
  // 34: De 120
  // 35: De 132
  // 36: De 72
  // 37: De 132
  // 38: De 204
  // 41: De 72
  // 42: De 84
  // 43: De 108
  // 44: De 120
  // 45: De 132
  // 46: De 72
  // 47: De 132
  // 48: De 204
  