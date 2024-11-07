import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilService } from '../shared/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-erupcoes',
  templateUrl: './erupcoes.component.html',
  styleUrls: ['./erupcoes.component.scss']
})
export class ErupcoesComponent implements OnInit {
  userId: string | null = null;
  pacientes: any[] = [];
  pacientesComErupcao: any[] = [];
  faixaDeMeses: number = 3;  // Define faixaDeMeses com um valor inicial

  isLoading: boolean = false;

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




  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    public util: UtilService,
  ) {
    this.faixaDeMeses = 1;  // Inicializa faixaDeMeses no construtor
  }


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

    this.isLoading = true; // Inicia o carregamento

    // Carrega os dados da coleção "pacientes" do usuário
    this.firestore
      .collection(`/users/${this.userId}/pacientes`)
      .valueChanges()
      .subscribe((pacientes: any[]) => {
        this.pacientes = pacientes.map(paciente => ({
          nome: paciente.nome,
          nascimento: paciente.nascimento,
          meses: paciente.meses,
          telefone: paciente.telefone,
          // Captura cada dente específico e seu valor
          dentesExaminados: {
            "11": paciente["11"], "12": paciente["12"], "13": paciente["13"], "14": paciente["14"],
            "15": paciente["15"], "16": paciente["16"], "17": paciente["17"], "18": paciente["18"],
            "21": paciente["21"], "22": paciente["22"], "23": paciente["23"], "24": paciente["24"],
            "25": paciente["25"], "26": paciente["26"], "27": paciente["27"], "28": paciente["28"],
            "31": paciente["31"], "32": paciente["32"], "33": paciente["33"], "34": paciente["34"],
            "35": paciente["35"], "36": paciente["36"], "37": paciente["37"], "38": paciente["38"],
            "41": paciente["41"], "42": paciente["42"], "43": paciente["43"], "44": paciente["44"],
            "45": paciente["45"], "46": paciente["46"], "47": paciente["47"], "48": paciente["48"],
            "51": paciente["51"], "52": paciente["52"], "53": paciente["53"], "54": paciente["54"],
            "55": paciente["55"], "61": paciente["61"], "62": paciente["62"], "63": paciente["63"],
            "64": paciente["64"], "65": paciente["65"], "71": paciente["71"], "72": paciente["72"],
            "73": paciente["73"], "74": paciente["74"], "75": paciente["75"], "81": paciente["81"],
            "82": paciente["82"], "83": paciente["83"], "84": paciente["84"], "85": paciente["85"]
          }
        }));
        this.verificarErupcoes();
      });
  }



  verificarErupcoes(): void {
    console.log("Início da verificação de erupções");

    this.pacientesComErupcao = this.pacientes.map(paciente => {
      // Converte `paciente.meses` para número inteiro, arredondando para baixo
      const pacienteMeses = Math.floor(Number(paciente.meses));
      const faixaMaxima = pacienteMeses + this.faixaDeMeses; // Faixa de erupção até idade + faixa de meses

      console.log(`Nome do paciente: ${paciente.nome}, Idade em meses: ${pacienteMeses}, Faixa máxima: ${faixaMaxima}`);

      // Filtra os dentes que vão erupcionar dentro da faixa especificada e que não estão marcados como "E"
      const dentesEmErupcao = this.erupcaoTabela
        .filter(dente => {
          const inicioErupcao = Math.floor(Number(dente.De)); // Converte `dente.De` para número inteiro
          const denteJaErupcionado = paciente.dentesExaminados[dente.Dente] === "E";

          // Verifica se o dente está na faixa de erupção e não foi marcado como erupcionado ("E")
          return inicioErupcao >= pacienteMeses &&
            inicioErupcao < faixaMaxima &&
            !denteJaErupcionado; // Exclui dentes já erupcionados
        })
        .map(dente => dente.Dente); // Mapeia apenas o número do dente

      return {
        nome: paciente.nome,
        nascimento: paciente.nascimento,
        telefone: paciente.telefone,
        meses: pacienteMeses,
        dentesEmErupcao: dentesEmErupcao || []
      };
    }).filter(paciente => paciente.dentesEmErupcao.length > 0); // Filtra pacientes sem dentes na faixa de erupção

    console.log("Pacientes com dentes em erupção na faixa especificada:", this.pacientesComErupcao);
    this.isLoading = false;  // Certifique-se de definir `isLoading` como `false` após a verificação
  }


  enviar_whatsapp(nome:string, telefone:string) {
    console.log("paciente = "),nome;

    if (!telefone || !nome) {
        console.error("Telefone ou nome do paciente não fornecido.");
        return;
    }

    // Formatação da mensagem, substituindo <nome> pelo nome real do paciente
    const mensagem = encodeURIComponent(`
        Ao responsável por *${nome}*

        Olá!

        Informamos que em breve vão nascer dentes importantes. 
        Este é o período de maior risco de cárie para esses dentes.

        Traga ${nome} para atendimento odontológico na *UBS Candeia São Sebastião* para os exames e orientação necessários para garantir a saúde dos novos dentes.


        Atenciosamente,
        
        *Equipe de Saúde Bucal UBS Candeia São Sebastião*
    `);

    // remove do telefone tudo que não for dígitos
    telefone = telefone.replace(/\D/g, '');  
    // Formatação da URL do WhatsApp com telefone e mensagem
    const whatsappUrl = `https://wa.me/${telefone}?text=${mensagem}`;

    // Abre a URL em uma nova aba
    window.open(whatsappUrl, '_blank');
}




  voltar() {
    console.log("voltar()");
    const listaPath = `list/pacientes`;
    this.router.navigate([listaPath]);
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
