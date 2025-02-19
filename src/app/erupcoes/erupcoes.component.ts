import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DateUtils } from '../shared/utils/date-utils';

import { ErupcoesPopupComponent } from '../erupcoes-popup/erupcoes-popup.component';
import { UtilService } from '../shared/utils/util.service';
import { dentesTabela, Dente } from '../shared/dentes-tabela'; // Importa a tabela e a interface

@Component({
  selector: 'app-erupcoes',
  templateUrl: './erupcoes.component.html',
  styleUrls: ['./erupcoes.component.scss'],
  standalone: false
})
export class ErupcoesComponent implements OnInit {
  userId: string | null = null;
  pacientes: any[] = [];
  pacientesComErupcao: any[] = [];
  faixaDeMeses: number = 3;  // Define faixaDeMeses com um valor inicial
  public DateUtils = DateUtils;
  isLoading: boolean = false;


  // Usar a tabela de dentes importada
  private dentesTabela: Dente[] = dentesTabela;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    public util: UtilService,
    public dialog: MatDialog 
  ) {}


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


    // Getter para o texto formatado
    get faixaDeMesesTexto(): string {
      return `em ${this.faixaDeMeses} ${this.faixaDeMeses === 1 ? 'mês' : 'meses'}`;
    }


  
    abrirPopup(paciente: any): void {
      const dialogRef = this.dialog.open(ErupcoesPopupComponent);
      // Configura os dados manualmente usando `componentInstance`
      dialogRef.componentInstance.data = {
        nome: paciente.nome,
        nascimento: paciente.nascimento,
        telefone: paciente.telefone,
        idade: paciente.idade,
        dataChamadaInicial: '21/10/2024',
        dataUltimaChamada: '28/10/2024',
        dataResposta: '29/10/2024',
        dataComparecimento: '31/10/2024'
      };
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
          telefone: paciente.telefone,
          meses: paciente.meses,
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

      // console.log(`Nome do paciente: ${paciente.nome}, Idade em meses: ${pacienteMeses}, Faixa máxima: ${faixaMaxima}`);

      // Filtra os dentes que vão erupcionar dentro da faixa especificada e que não estão marcados como "E"
      const dentesEmErupcao = this.dentesTabela
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


  enviar_whatsapp(nome: string, telefone: string) {
    console.log("paciente = "), nome;

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


  aumentarFaixaMeses() {
    if (this.faixaDeMeses < 360) { // Limite máximo de 360 meses (30 anos)
      this.faixaDeMeses++;
      this.verificarErupcoes(); // Chama o método para verificar as erupções quando o valor muda
    }
  }

  diminuirFaixaMeses() {
    if (this.faixaDeMeses > 1) { // Limite mínimo de 1
      this.faixaDeMeses--;
      this.verificarErupcoes(); // Chama o método para verificar as erupções quando o valor muda
    }
  }


  voltar() {
    console.log("voltar()");
    const listaPath = `list/pacientes`;
    this.router.navigate([listaPath]);
  }


}