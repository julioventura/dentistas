import { Campo } from '../models/campo.model';

export const DEFAULT_CAMPOS_PADRAO: Campo[] = [
  { grupo: '', nome: 'nome', tipo: 'text', label: 'Nome' },
  { grupo: '', nome: 'codigo', tipo: 'text', label: 'Código' },
  { grupo: '', nome: 'data', tipo: 'text', label: 'Criado em' },
  { grupo: '', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: '', nome: 'valor', tipo: 'number', label: 'Valor' },
  { grupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos' },
];

export const DEFAULT_CAMPOS_PADRAO_FICHAS: Campo[] = [
  { grupo: '', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: '', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: '', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: '', nome: 'valor', tipo: 'number', label: 'Valor' },
  { grupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_EXAMES: Campo[] = [
  { grupo: '', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: '', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: '', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
  { grupo: 'Anamnese', nome: 'queixaPrincipal', tipo: 'text', label: 'Queixa Principal' },
  { grupo: 'Anamnese', nome: 'emTratamentoMedico', tipo: 'boolean', label: 'Está em tratamento médico?' },
  { grupo: 'Anamnese', nome: 'motivoTratamentoMedico', tipo: 'text', label: 'Motivo do tratamento médico' },
  { grupo: 'Anamnese', nome: 'usaMedicamento', tipo: 'boolean', label: 'Toma medicamentos?' },
  { grupo: 'Anamnese', nome: 'quaisMedicamentos', tipo: 'text', label: 'Quais medicamentos?' },
  { grupo: 'Anamnese', nome: 'motivoMedicamentos', tipo: 'text', label: 'Motivo dos medicamentos' },

];

export const CAMPOS_FICHAS_DOCUMENTOS: Campo[] = [
  { grupo: '', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: '', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: '', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];


export const CAMPOS_FICHAS_PLANOS: Campo[] = [
  { grupo: '', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: '', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: '', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_PAGAMENTOS: Campo[] = [
  { grupo: '', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: '', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
  { grupo: '', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: '', nome: 'forma', tipo: 'text', label: 'Forma de Pagamento' },
  { grupo: '', nome: 'valor', tipo: 'number', label: 'Valor' },
];

export const CAMPOS_FICHAS_ATENDIMENTOS: Campo[] = [
  { grupo: '', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: '', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: '', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
  // { grupo: '', nome: 'valor', tipo: 'number', label: 'Valor' },
];

export const CAMPOS_FICHAS_TRATAMENTOS: Campo[] = [
  { grupo: '', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: '', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: '', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
  // { grupo: '', nome: 'valor', tipo: 'number', label: 'Valor' },
];

export const CAMPOS_FICHAS_DENTES: Campo[] = [
  { grupo: '', nome: 'nome', tipo: 'text', label: 'Dente' },
  { grupo: '', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: '', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];


export const CAMPOS_FICHAS_DIAGNOSTICOS: Campo[] = [
  { grupo: '', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: '', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: '', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_RISCO: Campo[] = [
  { grupo: '', nome: 'nome', tipo: 'text', label: 'Dente' },
  { grupo: '', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: '', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_DENTES_ENDO: Campo[] = [
  // Dados principais 
  { grupo: '', subgrupo: '', nome: 'nome', tipo: 'number', label: 'Dente' },
  { grupo: '', subgrupo: '', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: '', subgrupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
  { grupo: '', subgrupo: '', nome: 'obs', tipo: 'textarea', label: 'Evolução' },

  // Aspectos Clínicos da Coroa - usando subgrupos
  { grupo: '01) Aspectos Clínicos da Coroa', subgrupo: 'Integridade', nome: 'higido', tipo: 'boolean', label: 'Hígida' },
  { grupo: '01) Aspectos Clínicos da Coroa', subgrupo: 'Integridade', nome: 'ausente', tipo: 'boolean', label: 'Ausente' },
  { grupo: '01) Aspectos Clínicos da Coroa', subgrupo: 'Alterações', nome: 'alteracaoCor', tipo: 'boolean', label: 'Alteração de cor' },
  { grupo: '01) Aspectos Clínicos da Coroa', subgrupo: 'Alterações', nome: 'carie', tipo: 'boolean', label: 'Cárie' },
  { grupo: '01) Aspectos Clínicos da Coroa', subgrupo: 'Alterações', nome: 'fratura', tipo: 'boolean', label: 'Fratura' },
  { grupo: '01) Aspectos Clínicos da Coroa', subgrupo: 'Restaurações', nome: 'coroaPermanente', tipo: 'boolean', label: 'Coroa Permanente' },
  { grupo: '01) Aspectos Clínicos da Coroa', subgrupo: 'Restaurações', nome: 'restaurado', tipo: 'boolean', label: 'Restaurada' },
  { grupo: '01) Aspectos Clínicos da Coroa', subgrupo: 'Restaurações', nome: 'coroaProvisoria', tipo: 'boolean', label: 'Provisória' },
  { grupo: '01) Aspectos Clínicos da Coroa', subgrupo: 'Pulpar', nome: 'exposicaoPulpar', tipo: 'boolean', label: 'Exposição pulpar' },
  { grupo: '01) Aspectos Clínicos da Coroa', subgrupo: 'Pulpar', nome: 'selamentoProvisorio', tipo: 'boolean', label: 'Selamento provisório' },

  // Aspectos Clínicos dos Tecidos Moles
  { grupo: '02) Aspectos Clínicos dos Tecidos Moles', nome: 'edemaintraoral', tipo: 'boolean', label: 'Edema intra-oral' },
  { grupo: '02) Aspectos Clínicos dos Tecidos Moles', nome: 'edemaextraoral', tipo: 'boolean', label: 'Edema extra-oral' },
  { grupo: '02) Aspectos Clínicos dos Tecidos Moles', nome: 'fistula', tipo: 'boolean', label: 'Fístula' },

  // Avaliação da Dor
  { grupo: '03) Avaliação da Dor', nome: 'dorPresente', tipo: 'boolean', label: 'Dor: Presente?' },
  { grupo: '03) Avaliação da Dor', nome: 'nivelDor', tipo: 'number', label: 'Intensidade (1/leve - 10/severa)' },
  { grupo: '03) Avaliação da Dor', nome: 'localizacaoDorLocalizada', tipo: 'boolean', label: 'Dor Localizada' },
  { grupo: '03) Avaliação da Dor', nome: 'localizacaoDorDifusa', tipo: 'boolean', label: 'Dor Difusa' },
  { grupo: '03) Avaliação da Dor', nome: 'denteLocalizado', tipo: 'text', label: 'Dente(s) com dor (se localizada)' },
  { grupo: '03) Avaliação da Dor', nome: 'regiaoDor', tipo: 'text', label: 'Região da dor (se difusa)' },

  // Frequência da Dor
  { grupo: '04) Frequência da Dor', nome: 'frequenciaConstante', tipo: 'boolean', label: 'Constante' },
  { grupo: '04) Frequência da Dor', nome: 'frequenciaIntermitente', tipo: 'boolean', label: 'Intermitente' },
  { grupo: '04) Frequência da Dor', nome: 'frequenciaOcasional', tipo: 'boolean', label: 'Ocasional' },

  // Gatilho da Dor
  { grupo: '05) Gatilho da Dor', nome: 'gatilhoDorFrio', tipo: 'boolean', label: 'Iniciada por frio' },
  { grupo: '05) Gatilho da Dor', nome: 'gatilhoDorCalor', tipo: 'boolean', label: 'Iniciada por calor' },
  { grupo: '05) Gatilho da Dor', nome: 'gatilhoDorMastigação', tipo: 'boolean', label: 'Iniciada por mastigação' },
  { grupo: '05) Gatilho da Dor', nome: 'gatilhoDorDoce', tipo: 'boolean', label: 'Iniciada por doce' },
  { grupo: '05) Gatilho da Dor', nome: 'gatilhoDorEspontanea', tipo: 'boolean', label: 'Iniciada espontaneamente' },

  // Alívio da Dor
  { grupo: '06) Alívio da Dor', nome: 'alivioDorFrio', tipo: 'boolean', label: 'Aliviada por frio' },
  { grupo: '06) Alívio da Dor', nome: 'alivioDorCalor', tipo: 'boolean', label: 'Aliviada por calor' },
  { grupo: '06) Alívio da Dor', nome: 'alivioDorAnalgesicos', tipo: 'boolean', label: 'Aliviada por analgesicos' },

  // Duração da Dor
  { grupo: '07) Duração da Dor', nome: 'duracaoSegundos', tipo: 'boolean', label: 'Duração de segundos' },
  { grupo: '07) Duração da Dor', nome: 'duracaoMinutos', tipo: 'boolean', label: 'Duração de minutos' },
  { grupo: '07) Duração da Dor', nome: 'duracaoHoras', tipo: 'boolean', label: 'Duração de horas' },


  // Exame Radiográfico Inicial – Câmara Pulpar
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioCarie', tipo: 'boolean', label: 'Cárie' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioRestauracao', tipo: 'boolean', label: 'Restauração' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioComunicacao', tipo: 'boolean', label: 'Comunicação com meio bucal' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioAcessadaProvisorio', tipo: 'boolean', label: 'Acessada com provisório' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioDensInDente', tipo: 'boolean', label: 'Dens in Dente' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioNoduloPulpar', tipo: 'boolean', label: 'Nódulo pulpar' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioAtresica', tipo: 'boolean', label: 'Atrésica' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioAmpla', tipo: 'boolean', label: 'Ampla' },

  // Exame Radiográfico Inicial – Canais Radiculares
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'calcificado', tipo: 'boolean', label: 'Calcificação' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'curvaturaAcentuada', tipo: 'boolean', label: 'Curvatura acentuada' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'medicacaoIntracanal', tipo: 'boolean', label: 'Medicação intracanal' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'presencaMaterialObturador', tipo: 'boolean', label: 'Material obturador presente' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'linhaFraturaLocalizacao', tipo: 'text', label: 'Linha de fratura - Localização' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'limaFraturadaLocalizacao', tipo: 'text', label: 'Lima fraturada - Localização' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'perfuracaoLocalizacao', tipo: 'text', label: 'Perfuração - Localização' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'tipoRetentor1', tipo: 'boolean', label: 'Retentor intrarradicular Metálico' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'tipoRetentor2', tipo: 'boolean', label: 'Retentor intrarradicular de Fibra de vidro' },
    { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'reabsorcao1', tipo: 'boolean', label: 'Reabsorção Externa' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'reabsorcao2', tipo: 'boolean', label: 'Reabsorção Interna' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'reabsorcao3', tipo: 'boolean', label: 'Reabsorção Lateral' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'reabsorcao4', tipo: 'boolean', label: 'Reabsorção Apical' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'reabsorcao5', tipo: 'boolean', label: 'Reabsorção Anquilose' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'localizacaoReabsorcao', tipo: 'text', label: 'Localização da reabsorção' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'regiaoFurca1', tipo: 'boolean', label: 'Região de furca integra' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'regiaoFurca2', tipo: 'boolean', label: 'Região de furca alterada' },

  // Exame Radiográfico Inicial – Região Periapical
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalSemAlteracao', tipo: 'boolean', label: 'Sem alteração' },
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalAumentoDeEspaco', tipo: 'boolean', label: 'Aumento de espaço do ligamento periodontal' },
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalRadiolucidezApical', tipo: 'boolean', label: 'Sem alteração' },
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalHipercementose', tipo: 'boolean', label: 'Hipercementose' },
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalOsteite', tipo: 'boolean', label: 'Osteíte condensante' },
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalExtravasamento', tipo: 'boolean', label: 'Material obturador extravasado ' },

  // Teste de Sensibilidade
  { grupo: '11) Teste de Sensibilidade', nome: 'denteControle', tipo: 'text', label: 'Dente controle' },
  { grupo: '11) Teste de Sensibilidade', nome: 'denteSuspeito', tipo: 'text', label: 'Dente suspeito' },

  { grupo: '12) Teste de Sensibilidade: Resposta', nome: 'respostaTestePositiva', tipo: 'boolean', label: 'Resposta positiva' },
  { grupo: '12) Teste de Sensibilidade: Resposta', nome: 'respostaTesteNegativa', tipo: 'boolean', label: 'Resposta negativa' },

  { grupo: '13) Teste de Sensibilidade: Duração', nome: 'duracaoIgualControle', tipo: 'boolean', label: 'Duração igual ao controle' },
  { grupo: '13) Teste de Sensibilidade: Duração', nome: 'duracaoMaisLenta', tipo: 'boolean', label: 'Retorno mais lento que o controle' },

  { grupo: '14) Teste de Sensibilidade: Intensidade', nome: 'intensidadeIgualControle', tipo: 'boolean', label: 'Intensidade igual ao controle' },
  { grupo: '14) Teste de Sensibilidade: Intensidade', nome: 'intensidadeMaisAgudo', tipo: 'boolean', label: 'Intensidade mais aguda que o controle' },

  // Testes Clínicos
  { grupo: '15) Testes', nome: 'testeMobilidade', tipo: 'boolean', label: 'Mobilidade' },
  { grupo: '15) Testes', nome: 'testePalpacao', tipo: 'boolean', label: 'Palpação' },
  { grupo: '15) Testes', nome: 'testePercussaoVertical', tipo: 'boolean', label: 'Percussão vertical' },
  { grupo: '15) Testes', nome: 'testePercussaoHorizontal', tipo: 'boolean', label: 'Percussão horizontal' },
  { grupo: '15) Testes', nome: 'testeSondagem', tipo: 'boolean', label: 'Sondagem: Bolsa Periodontal' },

  // Diagnóstico Pulpar
  // AAE Consensus Conference Recommended Diagnostic Terminology. Journal of Endodontics. 2009;35:1634. 
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar1', tipo: 'boolean', label: 'Polpa Normal' },
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar2', tipo: 'boolean', label: 'Pulpite Reversível' },
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar3', tipo: 'boolean', label: 'Pulpite Irreversível Sintomática' },
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar4', tipo: 'boolean', label: 'Pulpite Irreversível Assintomática' },
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar5', tipo: 'boolean', label: 'Polpa Necrosada' },
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar6', tipo: 'boolean', label: 'Tratamento Endodôntico Prévio' },
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar7', tipo: 'boolean', label: 'Terapia Previamente Iniciada' },
  
  // Diagnóstico Perirradicular
  // AAE Consensus Conference Recommended Diagnostic Terminology. Journal of Endodontics. 2009;35:1634. 
  { grupo: '17) Diagnóstico Perirradicular', nome: 'diagnosticoPerirradicular1', tipo: 'boolean', label: 'Tecidos apicais normais' },
  { grupo: '17) Diagnóstico Perirradicular', nome: 'diagnosticoPerirradicular2', tipo: 'boolean', label: 'Periodontite Apical Sintomática' },
  { grupo: '17) Diagnóstico Perirradicular', nome: 'diagnosticoPerirradicular3', tipo: 'boolean', label: 'Periodontite Apical Assintomática' },
  { grupo: '17) Diagnóstico Perirradicular', nome: 'diagnosticoPerirradicular4', tipo: 'boolean', label: 'Abscesso Apical Agudo' },
  { grupo: '17) Diagnóstico Perirradicular', nome: 'diagnosticoPerirradicular5', tipo: 'boolean', label: 'Abscesso Apical Crônico' },
  { grupo: '17) Diagnóstico Perirradicular', nome: 'diagnosticoPerirradicular6', tipo: 'boolean', label: 'Osteíte Condensante' },

  // Plano de Tratamento
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento1', tipo: 'boolean', label: 'Tratamento conservador' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento2', tipo: 'boolean', label: ' Apenas proservação' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento3', tipo: 'boolean', label: 'Tratamento endodôntico ' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento4', tipo: 'boolean', label: 'Continuação de terapia previamente iniciada por outros' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento5', tipo: 'boolean', label: 'Retratamento endodôntico não cirúrgico' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento6', tipo: 'boolean', label: 'Revascularização pulpar' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento7', tipo: 'boolean', label: 'Apicificação' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento8', tipo: 'boolean', label: 'Cirurgia parendodôntica' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento9', tipo: 'text', label: 'Encaminhamento para avaliação de outra especialidade' },

  // Grampo do Isolamento
  { grupo: '19) Grampo do Isolamento', nome: 'grampoIsolamento', tipo: 'text', label: 'Grampo do Isolamento Absoluto' },

  // Preparo Químico-Mecânico: Técnica de Instrumentação
  { grupo: '20) Técnica de Instrumentação', nome: 'tecnicaInstrumentacao1', tipo: 'boolean', label: 'Manual' },
  { grupo: '20) Técnica de Instrumentação', nome: 'tecnicaInstrumentacao2', tipo: 'boolean', label: 'Rotação contínua - ROTATÓRIA' },
  { grupo: '20) Técnica de Instrumentação', nome: 'tecnicaInstrumentacao3', tipo: 'boolean', label: 'Reciprocante' },
  { grupo: '20) Técnica de Instrumentação', nome: 'tecnicaInstrumentacao4', tipo: 'boolean', label: 'OSCILATÓRIA' },
  { grupo: '20) Técnica de Instrumentação', nome: 'tecnicaInstrumentacao5', tipo: 'boolean', label: 'Híbrida' },
  
  // Canais Radiculares
  // CAD – comprimento aparente do dente 
  // CRT – comprimento real de trabalho
  // CRI – comprimento real do instrumento 
  // IAF – Instrumento apical foraminal (Patência)
  // CPT – comprimento provisório de trabalho 
  // IAI - Instrumento inicial apical (Primeiro instrumento do preparo apical)
  // CRD – comprimento real do dente 
  // IM – Instrumento de memória (Último instrumento do preparo apical)
  
  // Canal 1
  { grupo: '21a) Canais Radiculares - Canal 1', nome: 'canal1Nome', tipo: 'text', label: 'Canal 1 - Nome/Sigla' },
  { grupo: '21a) Canais Radiculares - Canal 1', nome: 'canal1Ref', tipo: 'text', label: 'Canal 1 - Referência Coronária' },
  { grupo: '21a) Canais Radiculares - Canal 1', nome: 'canal1CAD', tipo: 'number', label: 'Canal 1 - CAD – comprimento aparente do dente' },
  { grupo: '21a) Canais Radiculares - Canal 1', nome: 'canal1CRI', tipo: 'number', label: 'Canal 1 - CRI – comprimento real do instrumento (CAD-2)' },
  { grupo: '21a) Canais Radiculares - Canal 1', nome: 'canal1CPT', tipo: 'number', label: 'Canal 1 - CPT – comprimento provisório de trabalho (CAD-4)' },
  { grupo: '21a) Canais Radiculares - Canal 1', nome: 'canal1CRD', tipo: 'number', label: 'Canal 1 - CRD – comprimento real do dente' },
  { grupo: '21a) Canais Radiculares - Canal 1', nome: 'canal1CRT', tipo: 'number', label: 'Canal 1 - CRT – comprimento real de trabalho' },
  { grupo: '21a) Canais Radiculares - Canal 1', nome: 'canal1IAF', tipo: 'text', label: 'Canal 1 - IAF – Instrumento apical foraminal (Patência)' },
  { grupo: '21a) Canais Radiculares - Canal 1', nome: 'canal1IAI', tipo: 'text', label: 'Canal 1 - IAI - Instrumento inicial apical' },
  { grupo: '21a) Canais Radiculares - Canal 1', nome: 'canal1IM', tipo: 'text', label: 'Canal 1 -IM – Instrumento de memória (Último instrumento do preparo apical)' },
  
  // Canal 2
  { grupo: '21b) Canais Radiculares - Canal 2', nome: 'canal2Nome', tipo: 'text', label: 'Canal 2 - Nome/Sigla' },
  { grupo: '21b) Canais Radiculares - Canal 2', nome: 'canal2Ref', tipo: 'text', label: 'Canal 2 - Referência Coronária' },
  { grupo: '21b) Canais Radiculares - Canal 2', nome: 'canal2CAD', tipo: 'number', label: 'Canal 2 - CAD – comprimento aparente do dente' },
  { grupo: '21b) Canais Radiculares - Canal 2', nome: 'canal2CRI', tipo: 'number', label: 'Canal 2 - CRI – comprimento real do instrumento (CAD-2)' },
  { grupo: '21b) Canais Radiculares - Canal 2', nome: 'canal2CPT', tipo: 'number', label: 'Canal 2 - CPT – comprimento provisório de trabalho (CAD-4)' },
  { grupo: '21b) Canais Radiculares - Canal 2', nome: 'canal2CRD', tipo: 'number', label: 'Canal 2 - CRD – comprimento real do dente' },
  { grupo: '21b) Canais Radiculares - Canal 2', nome: 'canal2CRT', tipo: 'number', label: 'Canal 2 - CRT – comprimento real de trabalho' },
  { grupo: '21b) Canais Radiculares - Canal 2', nome: 'canal2IAF', tipo: 'text', label: 'Canal 2 - IAF – Instrumento apical foraminal (Patência)' },
  { grupo: '21b) Canais Radiculares - Canal 2', nome: 'canal2IAI', tipo: 'text', label: 'Canal 2 - IAI - Instrumento inicial apical' },
  { grupo: '21b) Canais Radiculares - Canal 2', nome: 'canal2IM', tipo: 'text', label: 'Canal 2 -IM – Instrumento de memória (Último instrumento do preparo apical)' },
  
  // Canal 3
  { grupo: '21c) Canais Radiculares - Canal 3', nome: 'canal3Nome', tipo: 'text', label: 'Canal 3 - Nome/Sigla' },
  { grupo: '21c) Canais Radiculares - Canal 3', nome: 'canal3Ref', tipo: 'text', label: 'Canal 3 - Referência Coronária' },
  { grupo: '21c) Canais Radiculares - Canal 3', nome: 'canal3CAD', tipo: 'number', label: 'Canal 3 - CAD – comprimento aparente do dente' },
  { grupo: '21c) Canais Radiculares - Canal 3', nome: 'canal3CRI', tipo: 'number', label: 'Canal 3 - CRI – comprimento real do instrumento (CAD-2)' },
  { grupo: '21c) Canais Radiculares - Canal 3', nome: 'canal3CPT', tipo: 'number', label: 'Canal 3 - CPT – comprimento provisório de trabalho (CAD-4)' },
  { grupo: '21c) Canais Radiculares - Canal 3', nome: 'canal3CRD', tipo: 'number', label: 'Canal 3 - CRD – comprimento real do dente' },
  { grupo: '21c) Canais Radiculares - Canal 3', nome: 'canal3CRT', tipo: 'number', label: 'Canal 3 - CRT – comprimento real de trabalho' },
  { grupo: '21c) Canais Radiculares - Canal 3', nome: 'canal3IAF', tipo: 'text', label: 'Canal 3 - IAF – Instrumento apical foraminal (Patência)' },
  { grupo: '21c) Canais Radiculares - Canal 3', nome: 'canal3IAI', tipo: 'text', label: 'Canal 3 - IAI - Instrumento inicial apical' },
  { grupo: '21c) Canais Radiculares - Canal 3', nome: 'canal3IM', tipo: 'text', label: 'Canal 3 -IM – Instrumento de memória (Último instrumento do preparo apical)' },
  
  // Canal 4
  { grupo: '21d) Canais Radiculares - Canal 4', nome: 'canal4Nome', tipo: 'text', label: 'Canal 4 - Nome/Sigla' },
  { grupo: '21d) Canais Radiculares - Canal 4', nome: 'canal4Ref', tipo: 'text', label: 'Canal 4 - Referência Coronária' },
  { grupo: '21d) Canais Radiculares - Canal 4', nome: 'canal4CAD', tipo: 'number', label: 'Canal 4 - CAD – comprimento aparente do dente' },
  { grupo: '21d) Canais Radiculares - Canal 4', nome: 'canal4CRI', tipo: 'number', label: 'Canal 4 - CRI – comprimento real do instrumento (CAD-2)' },
  { grupo: '21d) Canais Radiculares - Canal 4', nome: 'canal4CPT', tipo: 'number', label: 'Canal 4 - CPT – comprimento provisório de trabalho (CAD-4)' },
  { grupo: '21d) Canais Radiculares - Canal 4', nome: 'canal4CRD', tipo: 'number', label: 'Canal 4 - CRD – comprimento real do dente' },
  { grupo: '21d) Canais Radiculares - Canal 4', nome: 'canal4CRT', tipo: 'number', label: 'Canal 4 - CRT – comprimento real de trabalho' },
  { grupo: '21d) Canais Radiculares - Canal 4', nome: 'canal4IAF', tipo: 'text', label: 'Canal 4 - IAF – Instrumento apical foraminal (Patência)' },
  { grupo: '21d) Canais Radiculares - Canal 4', nome: 'canal4IAI', tipo: 'text', label: 'Canal 4 - IAI - Instrumento inicial apical' },
  { grupo: '21d) Canais Radiculares - Canal 4', nome: 'canal4IM', tipo: 'text', label: 'Canal 4 -IM – Instrumento de memória (Último instrumento do preparo apical)' },
  
  // Canal 5
  { grupo: '21e) Canais Radiculares - Canal 5', nome: 'canal5Nome', tipo: 'text', label: 'Canal 5 - Nome/Sigla' },
  { grupo: '21e) Canais Radiculares - Canal 5', nome: 'canal5Ref', tipo: 'text', label: 'Canal 5 - Referência Coronária' },
  { grupo: '21e) Canais Radiculares - Canal 5', nome: 'canal5CAD', tipo: 'number', label: 'Canal 5 - CAD – comprimento aparente do dente' },
  { grupo: '21e) Canais Radiculares - Canal 5', nome: 'canal5CRI', tipo: 'number', label: 'Canal 5 - CRI – comprimento real do instrumento (CAD-2)' },
  { grupo: '21e) Canais Radiculares - Canal 5', nome: 'canal5CPT', tipo: 'number', label: 'Canal 5 - CPT – comprimento provisório de trabalho (CAD-4)' },
  { grupo: '21e) Canais Radiculares - Canal 5', nome: 'canal5CRD', tipo: 'number', label: 'Canal 5 - CRD – comprimento real do dente' },
  { grupo: '21e) Canais Radiculares - Canal 5', nome: 'canal5CRT', tipo: 'number', label: 'Canal 5 - CRT – comprimento real de trabalho' },
  { grupo: '21e) Canais Radiculares - Canal 5', nome: 'canal5IAF', tipo: 'text', label: 'Canal 5 - IAF – Instrumento apical foraminal (Patência)' },
  { grupo: '21e) Canais Radiculares - Canal 5', nome: 'canal5IAI', tipo: 'text', label: 'Canal 5 - IAI - Instrumento inicial apical' },
  { grupo: '21e) Canais Radiculares - Canal 5', nome: 'canal5IM', tipo: 'text', label: 'Canal 5 -IM – Instrumento de memória (Último instrumento do preparo apical)' },

  // Irrigação
  { grupo: '22) Irrigação', nome: 'hipoclorito', tipo: 'text', label: 'Hipoclorito de sódio (%)' },
  { grupo: '22) Irrigação', nome: 'clorexidinaLiquida', tipo: 'boolean', label: 'Clorexidina Líquida (2%)' },
  { grupo: '22) Irrigação', nome: 'clorexidinaGel', tipo: 'boolean', label: 'Clorexidina Gel (2%)' },
  { grupo: '22) Irrigação', nome: 'edta', tipo: 'boolean', label: 'EDTA a 17%' },
  { grupo: '22) Irrigação', nome: 'ObsIrrigacao', tipo: 'text', label: 'Observaçao sobre a irrigação' },

  // Potencialização da substância química
  { grupo: '23) Potencialização da substância química', nome: 'potencializacao', tipo: 'boolean', label: 'Potencialização da substância química?' },
  { grupo: '23) Potencialização da substância química', nome: 'tecnicaPotencializacao', tipo: 'text', label: 'Técnica de potencialização' },

  // Medicação Intracanal Consulta 1
  { grupo: '24) Medicação Intracanal Consulta 1', nome: 'medicacaoIntracanalConsulta1a', tipo: 'boolean', label: 'Hipoclorito de sódio' },
  { grupo: '24) Medicação Intracanal Consulta 1', nome: 'medicacaoIntracanalConsulta1b', tipo: 'boolean', label: 'Clorexidina' },
  { grupo: '24) Medicação Intracanal Consulta 1', nome: 'medicacaoIntracanalConsulta1c', tipo: 'boolean', label: 'Otosporin' },
  { grupo: '24) Medicação Intracanal Consulta 1', nome: 'medicacaoIntracanalConsulta1d', tipo: 'boolean', label: 'Hidróxido de cálcio' },
  
  // Medicação Intracanal Consulta 2
  { grupo: '25) Medicação Intracanal Consulta 2', nome: 'medicacaoIntracanalConsulta2a', tipo: 'boolean', label: 'Hipoclorito de sódio' },
  { grupo: '25) Medicação Intracanal Consulta 2', nome: 'medicacaoIntracanalConsulta2b', tipo: 'boolean', label: 'Clorexidina' },
  { grupo: '25) Medicação Intracanal Consulta 2', nome: 'medicacaoIntracanalConsulta2c', tipo: 'boolean', label: 'Otosporin' },
  { grupo: '25) Medicação Intracanal Consulta 2', nome: 'medicacaoIntracanalConsulta2d', tipo: 'boolean', label: 'Hidróxido de cálcio' },
  
    // Medicação Intracanal Consulta 3
  { grupo: '26) Medicação Intracanal Consulta 3', nome: 'medicacaoIntracanalConsulta3a', tipo: 'boolean', label: 'Hipoclorito de sódio' },
  { grupo: '26) Medicação Intracanal Consulta 3', nome: 'medicacaoIntracanalConsulta3b', tipo: 'boolean', label: 'Clorexidina' },
  { grupo: '26) Medicação Intracanal Consulta 3', nome: 'medicacaoIntracanalConsulta3c', tipo: 'boolean', label: 'Otosporin' },
  { grupo: '26) Medicação Intracanal Consulta 3', nome: 'medicacaoIntracanalConsulta3d', tipo: 'boolean', label: 'Hidróxido de cálcio' },
  
  // Medicação Intracanal Consulta 4
  { grupo: '27) Medicação Intracanal Consulta 4', nome: 'medicacaoIntracanalConsulta4a', tipo: 'boolean', label: 'Hipoclorito de sódio' },
  { grupo: '27) Medicação Intracanal Consulta 4', nome: 'medicacaoIntracanalConsulta4b', tipo: 'boolean', label: 'Clorexidina' },
  { grupo: '27) Medicação Intracanal Consulta 4', nome: 'medicacaoIntracanalConsulta4c', tipo: 'boolean', label: 'Otosporin' },
  { grupo: '27) Medicação Intracanal Consulta 4', nome: 'medicacaoIntracanalConsulta4d', tipo: 'boolean', label: 'Hidróxido de cálcio' },
  
  // Técnica de Obturação
  { grupo: '28) Técnica de Obturação', nome: 'tecnicaObturação1', tipo: 'boolean', label: 'Cone único' },
  { grupo: '28) Técnica de Obturação', nome: 'tecnicaObturação2', tipo: 'boolean', label: 'Condensação lateral' },
  { grupo: '28) Técnica de Obturação', nome: 'tecnicaObturação3', tipo: 'boolean', label: 'Termoplastificada' },
  { grupo: '28) Técnica de Obturação', nome: 'tecnicaObturação4', tipo: 'boolean', label: 'Plug de MTA' },
  { grupo: '28) Técnica de Obturação', nome: 'coneSelecionado', tipo: 'text', label: 'Cone selecionado' },
  { grupo: '28) Técnica de Obturação', nome: 'cimentoObturador', tipo: 'text', label: 'Cimento obturador' },

  // Selamento Coronário Provisório Consulta 1
  { grupo: '29) Selamento Coronário Provisório Consulta 1', nome: 'selamentoCoronarProvisorioConsulta1a', tipo: 'boolean', label: 'Teflon' },
  { grupo: '29) Selamento Coronário Provisório Consulta 1', nome: 'selamentoCoronarProvisorioConsulta1b', tipo: 'boolean', label: 'Coltosol' },
  { grupo: '29) Selamento Coronário Provisório Consulta 1', nome: 'selamentoCoronarProvisorioConsulta1c', tipo: 'boolean', label: 'Resina composta' },
  { grupo: '29) Selamento Coronário Provisório Consulta 1', nome: 'selamentoCoronarProvisorioConsulta1d', tipo: 'boolean', label: 'Resina flow' },
  { grupo: '29) Selamento Coronário Provisório Consulta 1', nome: 'selamentoCoronarProvisorioConsulta1e', tipo: 'boolean', label: 'Ionômero de vidro' },

  // Selamento Coronário Provisório Consulta 2
  { grupo: '30) Selamento Coronário Provisório Consulta 2', nome: 'selamentoCoronarProvisorioConsulta2a', tipo: 'boolean', label: 'Teflon' },
  { grupo: '30) Selamento Coronário Provisório Consulta 2', nome: 'selamentoCoronarProvisorioConsulta2b', tipo: 'boolean', label: 'Coltosol' },
  { grupo: '30) Selamento Coronário Provisório Consulta 2', nome: 'selamentoCoronarProvisorioConsulta2c', tipo: 'boolean', label: 'Resina composta' },
  { grupo: '30) Selamento Coronário Provisório Consulta 2', nome: 'selamentoCoronarProvisorioConsulta2d', tipo: 'boolean', label: 'Resina flow' },
  { grupo: '30) Selamento Coronário Provisório Consulta 2', nome: 'selamentoCoronarProvisorioConsulta2e', tipo: 'boolean', label: 'Ionômero de vidro' },
  
    // Selamento Coronário Provisório Consulta 3
  { grupo: '31) Selamento Coronário Provisório Consulta 3', nome: 'selamentoCoronarProvisorioConsulta3a', tipo: 'boolean', label: 'Teflon' },
  { grupo: '31) Selamento Coronário Provisório Consulta 3', nome: 'selamentoCoronarProvisorioConsulta3b', tipo: 'boolean', label: 'Coltosol' },
  { grupo: '31) Selamento Coronário Provisório Consulta 3', nome: 'selamentoCoronarProvisorioConsulta3c', tipo: 'boolean', label: 'Resina composta' },
  { grupo: '31) Selamento Coronário Provisório Consulta 3', nome: 'selamentoCoronarProvisorioConsulta3d', tipo: 'boolean', label: 'Resina flow' },
  { grupo: '31) Selamento Coronário Provisório Consulta 3', nome: 'selamentoCoronarProvisorioConsulta3e', tipo: 'boolean', label: 'Ionômero de vidro' },

  // Selamento Coronário Provisório Consulta 4
  { grupo: '32) Selamento Coronário Provisório Consulta 4', nome: 'selamentoCoronarProvisorioConsulta4a', tipo: 'boolean', label: 'Teflon' },
  { grupo: '32) Selamento Coronário Provisório Consulta 4', nome: 'selamentoCoronarProvisorioConsulta4b', tipo: 'boolean', label: 'Coltosol' },
  { grupo: '32) Selamento Coronário Provisório Consulta 4', nome: 'selamentoCoronarProvisorioConsulta4c', tipo: 'boolean', label: 'Resina composta' },
  { grupo: '32) Selamento Coronário Provisório Consulta 4', nome: 'selamentoCoronarProvisorioConsulta4d', tipo: 'boolean', label: 'Resina flow' },
  { grupo: '32) Selamento Coronário Provisório Consulta 4', nome: 'selamentoCoronarProvisorioConsulta4e', tipo: 'boolean', label: 'Ionômero de vidro' },

  // Extras
  { grupo: '33) Extras', nome: 'extras1', tipo: 'boolean', label: 'Remoção de retentor intracanal' },
  { grupo: '33) Extras', nome: 'extras2', tipo: 'boolean', label: 'Remoção de instrumento fraturado' },
  { grupo: '33) Extras', nome: 'extras3', tipo: 'boolean', label: 'Fechamento de perfuração' },
  { grupo: '33) Extras', nome: 'extras4', tipo: 'boolean', label: 'Calcificação' },

  // Tomografia Computadorizada
  { grupo: '34) Tomografia Computadorizada de Feixe Cônico', nome: 'tomografiaNecessaria', tipo: 'boolean', label: 'Necessária?' },
  { grupo: '34) Tomografia Computadorizada de Feixe Cônico', nome: 'tomografiaMotivo', tipo: 'text', label: 'Motivo' },
  { grupo: '34) Tomografia Computadorizada de Feixe Cônico', nome: 'tomografiaResultado', tipo: 'textarea', label: 'Resultado' },
];

export const CAMPOS_FICHAS_DENTES_PERIO: Campo[] = [
  { grupo: 'Dentes Perio', nome: 'nome', tipo: 'text', label: 'Dente' },
  { grupo: 'Dentes Perio', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: 'Dentes Perio', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: 'Dentes Perio', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_ANAMNESE: Campo[] = [
  { grupo: 'Anamnese', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: 'Anamnese', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: 'Anamnese', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: 'Anamnese', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];
