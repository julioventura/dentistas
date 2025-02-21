import { Campo } from '../models/campo.model';

export const DEFAULT_CAMPOS_PADRAO: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Nome' },
  { nome: 'codigo', tipo: 'text', label: 'Código' },
  { nome: 'data', tipo: 'text', label: 'Criado em' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'valor', tipo: 'number', label: 'Valor' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos' },
];

export const DEFAULT_CAMPOS_PADRAO_FICHAS: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Titulo' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'valor', tipo: 'number', label: 'Valor' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_EXAMES: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Titulo' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_PLANOS: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Titulo' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_PAGAMENTOS: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Titulo' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'forma', tipo: 'text', label: 'Forma de Pagamento' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'valor', tipo: 'number', label: 'Valor' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_ATENDIMENTOS: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Titulo' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'valor', tipo: 'number', label: 'Valor' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_DENTES: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Dente' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_DENTES_ENDO: Campo[] = [
  // Dados principais 
  { nome: 'nome', tipo: 'number', label: 'Dente' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },

// { nome: 'pressaoArterial', tipo: 'text', label: 'Pressão Arterial (PA)' },
  
  // Encaminhamento e Dente
  // { nome: 'encaminhadoPor', tipo: 'text', label: 'Encaminhado por' },
  
  // Queixa e Histórico Clínico
  { nome: 'queixaPrincipal', tipo: 'text', label: 'Queixa Principal' },
  { nome: 'emTratamentoMedico', tipo: 'checkbox', label: 'Está em tratamento médico?' },
  { nome: 'motivoTratamentoMedico', tipo: 'text', label: 'Motivo do tratamento médico' },
  { nome: 'usaMedicamento', tipo: 'checkbox', label: 'Está tomando algum medicamento?' },
  { nome: 'quaisMedicamentos', tipo: 'text', label: 'Quais medicamentos?' },
  { nome: 'motivoMedicamentos', tipo: 'text', label: 'Motivo do uso de medicamentos' },

  // Aspectos Clínicos da Coroa
  { nome: 'higido', tipo: 'checkbox', label: 'Coroa: Hígido' },
  { nome: 'alteracaoCor', tipo: 'checkbox', label: 'Coroa: Alteração de cor' },
  { nome: 'ausente', tipo: 'checkbox', label: 'Coroa: Ausente' },
  { nome: 'carie', tipo: 'checkbox', label: 'Coroa: Cárie' },
  { nome: 'fratura', tipo: 'checkbox', label: 'Coroa: Fratura' },
  { nome: 'coroaPermanente', tipo: 'checkbox', label: 'Coroa: Permanente' },
  { nome: 'restaurado', tipo: 'checkbox', label: 'Coroa: Restaurado' },
  { nome: 'exposicaoPulpar', tipo: 'checkbox', label: 'Coroa: Exposição pulpar' },
  { nome: 'coroaProvisoria', tipo: 'checkbox', label: 'Coroa: Provisória' },
  { nome: 'selamentoProvisorio', tipo: 'checkbox', label: 'Coroa: Selamento provisório' },

  // Aspectos Clínicos dos Tecidos Moles
  { nome: 'edema', tipo: 'checkbox', label: 'Tecidos moles: Edema' },
  { nome: 'fistula', tipo: 'checkbox', label: 'Tecidos moles: Fístula' },

  // Avaliação da Dor
  { nome: 'dorPresente', tipo: 'checkbox', label: 'Dor: Presente?' },
  { nome: 'nivelDor', tipo: 'number', label: 'Dor: Nível de intensidade (1-10)' },
  { nome: 'localizacaoDor', tipo: 'text', label: 'Dor: Localização (Localizada/Difusa)' },
  { nome: 'denteLocalizado', tipo: 'text', label: 'Dente(s) com dor (se localizada)' },
  { nome: 'regiaoDor', tipo: 'text', label: 'Região da dor (se difusa)' },
  { nome: 'frequenciaDor', tipo: 'text', label: 'Dor: Frequência' },
  { nome: 'gatilhoDor', tipo: 'text', label: 'Dor: Iniciada por' },
  { nome: 'alivioDor', tipo: 'text', label: 'Dor: Aliviada por' },
  { nome: 'duracaoDor', tipo: 'text', label: 'Dor: Duração' },

  // Exame Radiográfico Inicial – Câmara Pulpar
  { nome: 'radioCarie', tipo: 'checkbox', label: 'Câmara Pulpar: Cárie' },
  { nome: 'radioRestauracao', tipo: 'checkbox', label: 'Câmara Pulpar: Restauração' },
  { nome: 'radioComunicacao', tipo: 'checkbox', label: 'Câmara Pulpar: Comunicação com meio bucal' },
  { nome: 'radioAcessadaProvisorio', tipo: 'checkbox', label: 'Câmara Pulpar: Acessada com provisório' },
  { nome: 'radioDensInDente', tipo: 'checkbox', label: 'Câmara Pulpar: Dens in Dente' },
  { nome: 'radioNoduloPulpar', tipo: 'checkbox', label: 'Câmara Pulpar: Nódulo pulpar' },
  { nome: 'radioAtresica', tipo: 'checkbox', label: 'Câmara Pulpar: Atrésica' },
  { nome: 'radioAmpla', tipo: 'checkbox', label: 'Câmara Pulpar: Ampla' },

  // Exame Radiográfico Inicial – Canais Radiculares
  { nome: 'calcificado', tipo: 'checkbox', label: 'Canais: Calcificado' },
  { nome: 'curvaturaAcentuada', tipo: 'checkbox', label: 'Canais: Curvatura acentuada' },
  { nome: 'medicacaoIntracanal', tipo: 'checkbox', label: 'Canais: Medicação intracanal' },
  { nome: 'presencaMaterialObturador', tipo: 'checkbox', label: 'Canais: Material obturador presente' },
  { nome: 'linhaFraturaLocalizacao', tipo: 'text', label: 'Canais: Linha de fratura - Localização' },
  { nome: 'limaFraturadaLocalizacao', tipo: 'text', label: 'Canais: Lima fraturada - Localização' },
  { nome: 'perfuracaoLocalizacao', tipo: 'text', label: 'Canais: Perfuração - Localização' },
  { nome: 'tipoRetentor', tipo: 'text', label: 'Canais: Tipo de retentor intrarradicular (Metálico/Fibra de vidro)' },
  { nome: 'reabsorpcao', tipo: 'text', label: 'Canais: Reabsorção (Externa, Interna, Lateral, Apical, Anquilose)' },
  { nome: 'localizacaoReabsorpcao', tipo: 'text', label: 'Canais: Localização da reabsorção' },
  { nome: 'regiaoFurca', tipo: 'text', label: 'Canais: Região de furca' },

  // Exame Radiográfico Inicial – Região Periapical
  { nome: 'regiaoPeriapical', tipo: 'text', label: 'Região Periapical' },

  // Teste de Sensibilidade
  { nome: 'denteControle', tipo: 'text', label: 'Dente controle (Sensibilidade)' },
  { nome: 'denteSuspeito', tipo: 'text', label: 'Dente suspeito (Sensibilidade)' },

  // Testes Clínicos
  { nome: 'testeMobilidade', tipo: 'checkbox', label: 'Teste: Mobilidade' },
  { nome: 'testePalpacao', tipo: 'checkbox', label: 'Teste: Palpação' },
  { nome: 'testePercussao', tipo: 'checkbox', label: 'Teste: Percussão' },
  { nome: 'testeSondagem', tipo: 'checkbox', label: 'Teste: Sondagem periodontal' },
  { nome: 'respostaTeste', tipo: 'checkbox', label: 'Teste: Resposta' },
  { nome: 'duracaoTeste', tipo: 'text', label: 'Teste: Duração' },
  { nome: 'intensidadeTeste', tipo: 'text', label: 'Teste: Intensidade' },

  // Diagnóstico
  { nome: 'diagnosticoPulpar', tipo: 'text', label: 'Diagnóstico: Pulpar' },
  { nome: 'diagnosticoPerirradicular', tipo: 'text', label: 'Diagnóstico: Perirradicular' },

  // Plano de Tratamento
  { nome: 'planoTratamento', tipo: 'textarea', label: 'Plano de Tratamento' },

  // Grampo do Isolamento
  { nome: 'grampoIsolamento', tipo: 'text', label: 'Grampo do Isolamento Absoluto' },

  // Preparo Químico-Mecânico
  { nome: 'tecnicaInstrumentacao', tipo: 'text', label: 'Técnica de instrumentação' },

  // Irrigação
  { nome: 'hipoclorito', tipo: 'text', label: 'Hipoclorito de sódio (%)' },
  { nome: 'clorexidina', tipo: 'text', label: 'Clorexidina (2%)' },
  { nome: 'edta', tipo: 'text', label: 'EDTA (17%)' },

  // Potencialização da substância química
  { nome: 'potencializacao', tipo: 'checkbox', label: 'Potencialização da substância química?' },
  { nome: 'tecnicaPotencializacao', tipo: 'text', label: 'Técnica de potencialização' },

  // Medicação Intracanal
  { nome: 'medicacaoIntracanalConsulta', tipo: 'text', label: 'Medicação Intracanal (por consulta)' },

  // Técnica de Obturação
  { nome: 'tecnicaObturação', tipo: 'text', label: 'Técnica de Obturação' },
  { nome: 'coneSelecionado', tipo: 'text', label: 'Cone selecionado' },
  { nome: 'cimentoObturador', tipo: 'text', label: 'Cimento obturador' },

  // Selamento Coronar Provisório
  { nome: 'selamentoCoronarProvisorio', tipo: 'text', label: 'Selamento Coronar Provisório' },

  // Extras
  { nome: 'extras', tipo: 'text', label: 'Extras (ex.: remoção de retentor, instrumentação, etc.)' },

  // Tomografia
  { nome: 'tomografiaNecessaria', tipo: 'checkbox', label: 'Tomografia necessária?' },
  { nome: 'motivoTomografia', tipo: 'textarea', label: 'Motivo para tomografia' },
  { nome: 'resultadoTomografia', tipo: 'textarea', label: 'Resultado da tomografia' },

  // Procedimentos
  { nome: 'procedimentos', tipo: 'textarea', label: 'Procedimentos realizados' },
];

export const CAMPOS_FICHAS_DENTES_PERIO: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Dente' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_ANAMNESE: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Titulo' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_DIAGNOSTICOS: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Titulo' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_RISCO: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Dente' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];