import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UtilService {

  constructor(
    private router: Router
  ) { }

  // Regex para validação de email
  public EMAIL_REGEXP = /^[^@]+@([^@\.]+\.)+[^@\.]+$/;

  public ALFABETO: string = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';

  public milisegundos_de_um_dia = 86400000;
  public milisegundos_de_um_mes = 2592000000;

  public CADEADO_ABERTO = "/src/img/cadeado-aberto.png";
  public CADEADO_FECHADO = "/src/img/cadeado-fechado.png";

  public NOVO_CLIENTE = 'NOVO CLIENTE';
  public NOVO_ADVOGADO = 'NOVO ADVOGADO';
  public NOVA_MENSAGEM = 'NOVA MENSAGEM';
  public NOVO_EVENTO = 'NOVO EVENTO';

  public AGENDA = 'Agenda';
  public AGENDA_TITLE = 'Agenda';

  public CONFIRM_DELETE = 'EXCLUIR?';
  public INCLUIDO = 'INCLUIDO';
  public ENVIADA = 'ENVIADA';
  public SALVO = 'SALVO';
  public ERRO = 'ERRO';
  public EDITANDO = 'EDITANDO';
  public COMPLETAR = 'COMPLETAR';

  public GREY = 'grey';
  public BLUE = 'dodgerblue';
  public ORANGE = 'orange';
  public GREEN = 'green';
  public RED = 'red';

  public DIASDASEMANA = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
  ];

  public DIASDASEMANACURTOS = [
    'Dom',
    'Seg',
    'Ter',
    'Qua',
    'Qui',
    'Sex',
    'Sab'
  ];

  public MESESDOANO = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];

  public MESESDOANOCURTOS = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez"
  ];

  // Divisão dentária
  public ARCADA1 = ["11", "12", "13", "14", "15", "16", "17", "18"];
  public ARCADA2 = ["21", "22", "23", "24", "25", "26", "27", "28"];
  public ARCADA3 = ["31", "32", "33", "34", "35", "36", "37", "38"];
  public ARCADA4 = ["41", "42", "43", "44", "45", "46", "47", "48"];
  public DENTES = [...this.ARCADA1, ...this.ARCADA2, ...this.ARCADA3, ...this.ARCADA4];

  // Funções de data
  getAgoraEmMilisegundos() {
    return Date.now();
  }

  getTempoDecorridoEmMilisegundos(data: string) {
    return Date.parse(data);
  }

  public formata_data(data: string, data_recente: string = ''): string {
    if (!data) {
      return '';
    }

    data = data.replace(/\D/g, ''); // Limpa tudo que não é número

    if (data.length === 6) {
      let ano = Number(data.substr(4, 2)) + 1900;
      if (ano < 1950) {
        ano += 100;
      }
      return `${data.substr(0, 2)}/${data.substr(2, 2)}/${ano}`;
    } else if (data.length === 8) {
      return `${data.substr(0, 2)}/${data.substr(2, 2)}/${data.substr(4, 4)}`;
    }

    return data;
  }

  public formata_email(email: string): string {
    if (!email) return '';
    return email.trim().toLowerCase();
  }

  // Funções para CPF
  public formata_cpf(cpf: string): string {
    cpf = cpf.replace(/\D/g, ''); // Limpa tudo que não é número
    if (cpf.length !== 11) return ''; // Verifica se o CPF tem 11 dígitos

    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); // Formata CPF
  }

  // Função para data atual
  public hoje(): string {
    const hoje = new Date();
    const dia = this.pad(hoje.getDate(), 2);
    const mes = this.pad(hoje.getMonth() + 1, 2);
    const ano = hoje.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  // Funções auxiliares
  public pad(num: any, size: number): string {
    return num.toString().padStart(size, '0');
  }

  public isNumeric(n: any): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // Função para clonar um objeto
  public clone(object: any): any {
    return JSON.parse(JSON.stringify(object));
  }

  public formata_valor(x: any, decimais: number = 2): string {
    const numero = parseFloat(x).toFixed(decimais).toString();
    return numero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // ====================================
  // NOVOS 2024 Dentistas.com.br versão 4
  // ====================================
  public capitalizar(str: string): string {
    console.log("capitalizar(" + str + ")");

    if (!str || typeof str !== 'string') {
      return '';
    }

    str = str.toLowerCase().trim(); // Converte tudo para minúsculas e remove espaços no início e no fim

    // Capitaliza a primeira letra de cada palavra
    str = str.replace(/(?:^|\s)\S/g, function (letter) {
      return letter.toUpperCase();
    });

    // Exceções que devem permanecer em minúsculas
    const excecoesMinusculas = 'de do da dos das por para e com em à'.split(' ');

    // Exceções que devem permanecer em MAIÚSCULAS (exemplo: siglas de estados)
    const excecoesMaiusculas = 'AC AL AM AP BA CE DF ES GO MA MG MS MT PA PB PE PI PR RJ RN RO RR RS SC SE SP TO'.split(' ');

    str = str.split(' ').map(palavra => {
      if (excecoesMinusculas.includes(palavra.toLowerCase())) {
        return palavra.toLowerCase();
      } else if (excecoesMaiusculas.includes(palavra.toUpperCase())) {
        return palavra.toUpperCase();
      } else {
        return palavra;  // Mantém o restante como está
      }
    }).join(' ');


    return str;
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

  // Método para ir para a página home
  goHome() {
    this.router.navigate(['/home']);
  }

  go(route: string) {
    this.router.navigate(['/' + route]);
  }

  go_url(url: string) {
    window.open(url, '_blank'); // Abre em uma nova aba ou janela
  }




  titulo_ajuste_plural(titulo: string) {
    switch (titulo) {
      case 'usuarios':
        return 'Usuários';
      case 'professores':
        return 'Professores';
      case 'alunos':
        return 'Alunos';
      case 'pacientes':
        return 'Pacientes';
      case 'proteticos':
        return 'Protéticos';
      case 'equipe':
        return 'Equipe';
      case 'dentistas':
        return 'Dentistas';
      case 'dentais':
        return 'Dentais';
      case 'empresas':
        return 'Empresas';
      case 'notas':
        return 'Anotações';

      case 'exames':
        return 'Exames';
      case 'planos':
        return 'Planos';
      case 'atendimentos':
        return 'Atendimentos';
      case 'pagamentos':
        return 'Pagamentos';
       
      case 'erupcoes':
        return 'Erupções Dentárias';
      case 'risco':
        return 'Risco de Cárie';
      case 'retornos':
        return 'Retornos';
      case 'historico':
        return 'Histórico de Avisos';

      default:
        return 'Registros';
    }
  }

  titulo_ajuste_singular(titulo: string) {
    switch (titulo) {
      case 'usuarios':
        return 'Usuário';
      case 'professores':
        return 'Professor';
      case 'alunos':
        return 'Aluno';
      case 'pacientes':
        return 'Paciente';
      case 'proteticos':
        return 'Protético';
      case 'equipe':
        return 'Equipe';
      case 'dentistas':
        return 'Dentista';
      case 'dentais':
        return 'Dental';
      case 'empresas':
        return 'Empresa';
      case 'notas':
        return 'Anotação';

      case 'exames':
        return 'Exame';
      case 'planos':
        return 'Plano';
      case 'atendimentos':
        return 'Atendimento';
      case 'pagamentos':
        return 'Pagamento';

      case 'erupcoes':
        return 'Erupções Dentárias';
      case 'risco':
        return 'Risco de Cárie';
      case 'retornos':
        return 'Retornos';
      case 'historico':
        return 'Histórico de Avisos';

      default:
        return 'Registro';
    }
  }


  // Função para calcular o dígito verificador
  calcularDigitoVerificador(codigo: string): number {
    return codigo.split('').reduce((acc, num) => acc + parseInt(num, 10), 0) % 10;
  }



}
