import { Campo } from '../models/campo.model';

export const DEFAULT_CAMPOS_PADRAO: Campo[] = [
  { grupo: 'Padrão', nome: 'nome', tipo: 'text', label: 'Nome' },
  { grupo: 'Padrão', nome: 'codigo', tipo: 'text', label: 'Código' },
  { grupo: 'Padrão', nome: 'data', tipo: 'text', label: 'Criado em' },
  { grupo: 'Padrão', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: 'Padrão', nome: 'valor', tipo: 'number', label: 'Valor' },
  { grupo: 'Padrão', nome: 'nuvem', tipo: 'url', label: 'Arquivos' },
];

export const DEFAULT_CAMPOS_PADRAO_FICHAS: Campo[] = [
  { grupo: 'Fichas', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: 'Fichas', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: 'Fichas', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: 'Fichas', nome: 'valor', tipo: 'number', label: 'Valor' },
  { grupo: 'Fichas', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_EXAMES: Campo[] = [
  { grupo: '', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: '', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: '', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: '', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_PLANOS: Campo[] = [
  { grupo: 'Planos', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: 'Planos', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: 'Planos', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: 'Planos', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_PAGAMENTOS: Campo[] = [
  { grupo: 'Pagamentos', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: 'Pagamentos', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: 'Pagamentos', nome: 'forma', tipo: 'text', label: 'Forma de Pagamento' },
  { grupo: 'Pagamentos', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: 'Pagamentos', nome: 'valor', tipo: 'number', label: 'Valor' },
  { grupo: 'Pagamentos', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_ATENDIMENTOS: Campo[] = [
  { grupo: 'Atendimentos', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: 'Atendimentos', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: 'Atendimentos', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: 'Atendimentos', nome: 'valor', tipo: 'number', label: 'Valor' },
  { grupo: 'Atendimentos', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_DENTES: Campo[] = [
  { grupo: 'Dentes', nome: 'nome', tipo: 'text', label: 'Dente' },
  { grupo: 'Dentes', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: 'Dentes', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: 'Dentes', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];


export const CAMPOS_FICHAS_DIAGNOSTICOS: Campo[] = [
  { grupo: 'Diagnósticos', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: 'Diagnósticos', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: 'Diagnósticos', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: 'Diagnósticos', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_RISCO: Campo[] = [
  { grupo: 'Risco', nome: 'nome', tipo: 'text', label: 'Dente' },
  { grupo: 'Risco', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: 'Risco', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: 'Risco', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];
export const CAMPOS_FICHAS_TRATAMENTOS: Campo[] = [
  { grupo: 'Tratamentos', nome: 'nome', tipo: 'text', label: 'Titulo' },
  { grupo: 'Tratamentos', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: 'Tratamentos', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { grupo: 'Tratamentos', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];

export const CAMPOS_FICHAS_DENTES_ENDO: Campo[] = [
  // Dados principais 
  { grupo: 'Dados principais', nome: 'nome', tipo: 'number', label: 'Dente' },
  { grupo: 'Dados principais', nome: 'data', tipo: 'date', label: 'Criado em' },
  { grupo: 'Dados principais', nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
  { grupo: 'Dados principais', nome: 'obs', tipo: 'textarea', label: 'Observações' },
  // Queixa e Histórico Clínico
  { grupo: 'Dados principais', nome: 'queixaPrincipal', tipo: 'text', label: 'Queixa Principal' },
  { grupo: 'Dados principais', nome: 'emTratamentoMedico', tipo: 'boolean', label: 'Está em tratamento médico?' },
  { grupo: 'Dados principais', nome: 'motivoTratamentoMedico', tipo: 'text', label: 'Motivo do tratamento médico' },
  { grupo: 'Dados principais', nome: 'usaMedicamento', tipo: 'boolean', label: 'Está tomando algum medicamento?' },
  { grupo: 'Dados principais', nome: 'quaisMedicamentos', tipo: 'text', label: 'Quais medicamentos?' },
  { grupo: 'Dados principais', nome: 'motivoMedicamentos', tipo: 'text', label: 'Motivo do uso de medicamentos' },

  // Encaminhamento e Dente (campos comentados não foram incluídos)


  // Aspectos Clínicos da Coroa
  { grupo: '01) Aspectos Clínicos da Coroa', nome: 'higido', tipo: 'boolean', label: 'Coroa: Hígido' },
  { grupo: '01) Aspectos Clínicos da Coroa', nome: 'alteracaoCor', tipo: 'boolean', label: 'Coroa: Alteração de cor' },
  { grupo: '01) Aspectos Clínicos da Coroa', nome: 'ausente', tipo: 'boolean', label: 'Coroa: Ausente' },
  { grupo: '01) Aspectos Clínicos da Coroa', nome: 'carie', tipo: 'boolean', label: 'Coroa: Cárie' },
  { grupo: '01) Aspectos Clínicos da Coroa', nome: 'fratura', tipo: 'boolean', label: 'Coroa: Fratura' },
  { grupo: '01) Aspectos Clínicos da Coroa', nome: 'coroaPermanente', tipo: 'boolean', label: 'Coroa: Permanente' },
  { grupo: '01) Aspectos Clínicos da Coroa', nome: 'restaurado', tipo: 'boolean', label: 'Coroa: Restaurado' },
  { grupo: '01) Aspectos Clínicos da Coroa', nome: 'exposicaoPulpar', tipo: 'boolean', label: 'Coroa: Exposição pulpar' },
  { grupo: '01) Aspectos Clínicos da Coroa', nome: 'coroaProvisoria', tipo: 'boolean', label: 'Coroa: Provisória' },
  { grupo: '01) Aspectos Clínicos da Coroa', nome: 'selamentoProvisorio', tipo: 'boolean', label: 'Coroa: Selamento provisório' },

  // Aspectos Clínicos dos Tecidos Moles
  { grupo: '02) Aspectos Clínicos dos Tecidos Moles', nome: 'edemaintraoral', tipo: 'boolean', label: 'Edema intra-oral' },
  { grupo: '02) Aspectos Clínicos dos Tecidos Moles', nome: 'edemaextraoral', tipo: 'boolean', label: 'Edema extra-oral' },
  { grupo: '02) Aspectos Clínicos dos Tecidos Moles', nome: 'fistula', tipo: 'boolean', label: 'Fístula' },

  // Avaliação da Dor
  { grupo: '03) Avaliação da Dor', nome: 'dorPresente', tipo: 'boolean', label: 'Dor: Presente?' },
  { grupo: '03) Avaliação da Dor', nome: 'nivelDor', tipo: 'number', label: 'Dor: Intensidade (Escala: 1/leve - 10/severa)' },
  { grupo: '03) Avaliação da Dor', nome: 'localizacaoDorLocalizada', tipo: 'boolean', label: 'Dor: Localizada' },
  { grupo: '03) Avaliação da Dor', nome: 'localizacaoDorDifusa', tipo: 'boolean', label: 'Dor: Difusa' },
  { grupo: '03) Avaliação da Dor', nome: 'denteLocalizado', tipo: 'text', label: 'Dente(s) com dor (se localizada)' },
  { grupo: '03) Avaliação da Dor', nome: 'regiaoDor', tipo: 'text', label: 'Região da dor (se difusa)' },

  // Frequência da Dor
  { grupo: '04) Frequência da Dor', nome: 'frequenciaConstante', tipo: 'boolean', label: 'Dor: Constante' },
  { grupo: '04) Frequência da Dor', nome: 'frequenciaIntermitente', tipo: 'boolean', label: 'Dor: Intermitente' },
  { grupo: '04) Frequência da Dor', nome: 'frequenciaOcasional', tipo: 'boolean', label: 'Dor: Ocasional' },

  { grupo: '05) Gatilho da Dor', nome: 'gatilhoDorFrio', tipo: 'boolean', label: 'Dor: Iniciada por frio' },
  { grupo: '05) Gatilho da Dor', nome: 'gatilhoDorCalor', tipo: 'boolean', label: 'Dor: Iniciada por calor' },
  { grupo: '05) Gatilho da Dor', nome: 'gatilhoDorMastigação', tipo: 'boolean', label: 'Dor: Iniciada por mastigação' },
  { grupo: '05) Gatilho da Dor', nome: 'gatilhoDorDoce', tipo: 'boolean', label: 'Dor: Iniciada por doce' },
  { grupo: '05) Gatilho da Dor', nome: 'gatilhoDorEspontanea', tipo: 'boolean', label: 'Dor: Iniciada espontaneamente' },

  { grupo: '06) Alívio da Dor', nome: 'alivioDorFrio', tipo: 'boolean', label: 'Dor: Aliviada por frio' },
  { grupo: '06) Alívio da Dor', nome: 'alivioDorCalor', tipo: 'boolean', label: 'Dor: Aliviada por calor' },
  { grupo: '06) Alívio da Dor', nome: 'alivioDorAnalgesicos', tipo: 'boolean', label: 'Dor: Aliviada por analgesicos' },

  { grupo: '07) Duração da Dor', nome: 'duracaoSegundos', tipo: 'boolean', label: 'Dor: Duração de segundos' },
  { grupo: '07) Duração da Dor', nome: 'duracaoMinutos', tipo: 'boolean', label: 'Dor: Duração de minutos' },
  { grupo: '07) Duração da Dor', nome: 'duracaoHoras', tipo: 'boolean', label: 'Dor: Duração de horas' },


  // Exame Radiográfico Inicial – Câmara Pulpar
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioCarie', tipo: 'boolean', label: 'Câmara Pulpar: Cárie' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioRestauracao', tipo: 'boolean', label: 'Câmara Pulpar: Restauração' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioComunicacao', tipo: 'boolean', label: 'Câmara Pulpar: Comunicação com meio bucal' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioAcessadaProvisorio', tipo: 'boolean', label: 'Câmara Pulpar: Acessada com provisório' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioDensInDente', tipo: 'boolean', label: 'Câmara Pulpar: Dens in Dente' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioNoduloPulpar', tipo: 'boolean', label: 'Câmara Pulpar: Nódulo pulpar' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioAtresica', tipo: 'boolean', label: 'Câmara Pulpar: Atrésica' },
  { grupo: '08) Radiografia Inicial - Câmara Pulpar', nome: 'radioAmpla', tipo: 'boolean', label: 'Câmara Pulpar: Ampla' },

  // Exame Radiográfico Inicial – Canais Radiculares
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'calcificado', tipo: 'boolean', label: 'Canais: Calcificado' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'curvaturaAcentuada', tipo: 'boolean', label: 'Canais: Curvatura acentuada' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'medicacaoIntracanal', tipo: 'boolean', label: 'Canais: Medicação intracanal' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'presencaMaterialObturador', tipo: 'boolean', label: 'Canais: Material obturador presente' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'linhaFraturaLocalizacao', tipo: 'text', label: 'Canais: Linha de fratura - Localização' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'limaFraturadaLocalizacao', tipo: 'text', label: 'Canais: Lima fraturada - Localização' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'perfuracaoLocalizacao', tipo: 'text', label: 'Canais: Perfuração - Localização' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'tipoRetentor', tipo: 'text', label: 'Canais: Tipo de retentor intrarradicular (Metálico/Fibra de vidro)' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'reabsorpcao', tipo: 'text', label: 'Canais: Reabsorção (Externa, Interna, Lateral, Apical, Anquilose)' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'localizacaoReabsorpcao', tipo: 'text', label: 'Canais: Localização da reabsorção' },
  { grupo: '09) Radiografia Inicial - Canais Radiculares', nome: 'regiaoFurca', tipo: 'text', label: 'Canais: Região de furca' },

  // Exame Radiográfico Inicial – Região Periapical
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalSemAlteracao', tipo: 'boolean', label: 'Região Periapical: Sem alteração' },
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalAumentoDeEspaco', tipo: 'boolean', label: 'Região Periapical: Aumento de espaço do ligamento periodontal' },
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalRadiolucidezApical', tipo: 'boolean', label: 'Região Periapical: Sem alteração' },
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalRadiolucidezApical', tipo: 'boolean', label: 'Região Periapical: Sem alteração' },
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalHipercementose', tipo: 'boolean', label: 'Região Periapical: Hipercementose' },
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalOsteite', tipo: 'boolean', label: 'Região Periapical: Osteíte condensante' },
  { grupo: '10) Radiografia Inicial - Região Periapical', nome: 'PeriapicalExtravasamento', tipo: 'boolean', label: 'Região Periapical: Material obturador extravasado ' },

  // Teste de Sensibilidade
  { grupo: '11) Teste de Sensibilidade', nome: 'denteControle', tipo: 'text', label: 'Sensibilidade: Dente controle' },
  { grupo: '11) Teste de Sensibilidade', nome: 'denteSuspeito', tipo: 'text', label: 'Sensibilidade: Dente suspeito' },

  { grupo: '12) Teste de Sensibilidade: Resposta', nome: 'respostaTestePositiva', tipo: 'boolean', label: 'Sensibilidade: Resposta positiva' },
  { grupo: '12) Teste de Sensibilidade: Resposta', nome: 'respostaTesteNegativa', tipo: 'boolean', label: 'Sensibilidade: Resposta negativa' },

  { grupo: '13) Teste de Sensibilidade: Duração', nome: 'duracaoIgualControle', tipo: 'boolean', label: 'Sensibilidade: Duração igual ao controle' },
  { grupo: '13) Teste de Sensibilidade: Duração', nome: 'duracaoMaisLenta', tipo: 'boolean', label: 'Sensibilidade: Retorno mais lento que o controle' },

  { grupo: '14) Teste de Sensibilidade: Intensidade', nome: 'intensidadeIgualControle', tipo: 'boolean', label: 'Sensibilidade: Intensidade igual ao controle' },
  { grupo: '14) Teste de Sensibilidade: Intensidade', nome: 'intensidadeMaisAgudo', tipo: 'boolean', label: 'Sensibilidade: Intensidade mais aguda que o controle' },

  // Testes Clínicos
  { grupo: '15) Testes', nome: 'testeMobilidade', tipo: 'boolean', label: 'Mobilidade' },
  { grupo: '15) Testes', nome: 'testePalpacao', tipo: 'boolean', label: 'Palpação' },
  { grupo: '15) Testes', nome: 'testePercussaoVertical', tipo: 'boolean', label: 'Percussão vertical' },
  { grupo: '15) Testes', nome: 'testePercussaoHorizontal', tipo: 'boolean', label: 'Percussão horizontal' },
  { grupo: '15) Testes', nome: 'testeSondagem', tipo: 'boolean', label: 'Sondagem: Bolsa Periodontal' },

  // Diagnóstico Pulpar
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar', tipo: 'boolean', label: 'Diagnóstico Pulpar: ' },
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar', tipo: 'boolean', label: 'Diagnóstico Pulpar: ' },
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar', tipo: 'boolean', label: 'Diagnóstico Pulpar: ' },
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar', tipo: 'boolean', label: 'Diagnóstico Pulpar: ' },
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar', tipo: 'boolean', label: 'Diagnóstico Pulpar: ' },
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar', tipo: 'boolean', label: 'Diagnóstico Pulpar: ' },
  { grupo: '16) Diagnóstico Pulpar', nome: 'diagnosticoPulpar', tipo: 'boolean', label: 'Diagnóstico Pulpar: ' },
  
  // Diagnóstico Perirradicular
  { grupo: '17) Diagnóstico Perirradicular', nome: 'diagnosticoPerirradicular', tipo: 'text', label: 'Diagnóstico Perirradicular: ' },
  { grupo: '17) Diagnóstico Perirradicular', nome: 'diagnosticoPerirradicular', tipo: 'text', label: 'Diagnóstico Perirradicular: ' },
  { grupo: '17) Diagnóstico Perirradicular', nome: 'diagnosticoPerirradicular', tipo: 'text', label: 'Diagnóstico Perirradicular: ' },
  { grupo: '17) Diagnóstico Perirradicular', nome: 'diagnosticoPerirradicular', tipo: 'text', label: 'Diagnóstico Perirradicular: ' },
  { grupo: '17) Diagnóstico Perirradicular', nome: 'diagnosticoPerirradicular', tipo: 'text', label: 'Diagnóstico Perirradicular: ' },
  { grupo: '17) Diagnóstico Perirradicular', nome: 'diagnosticoPerirradicular', tipo: 'text', label: 'Diagnóstico Perirradicular: ' },

  // Plano de Tratamento
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento', tipo: 'boolean', label: 'Plano de Tratamento' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento', tipo: 'boolean', label: 'Plano de Tratamento' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento', tipo: 'boolean', label: 'Plano de Tratamento' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento', tipo: 'boolean', label: 'Plano de Tratamento' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento', tipo: 'boolean', label: 'Plano de Tratamento' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento', tipo: 'boolean', label: 'Plano de Tratamento' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento', tipo: 'boolean', label: 'Plano de Tratamento' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento', tipo: 'boolean', label: 'Plano de Tratamento' },
  { grupo: '18) Plano de Tratamento', nome: 'planoTratamento', tipo: 'boolean', label: 'Plano de Tratamento' },

  // Grampo do Isolamento
  { grupo: '19) Grampo do Isolamento', nome: 'grampoIsolamento', tipo: 'text', label: 'Grampo do Isolamento Absoluto' },

  // Preparo Químico-Mecânico
  { grupo: '20) Preparo Químico-Mecânico', nome: 'tecnicaInstrumentacao', tipo: 'text', label: 'Técnica de instrumentação' },

  // Irrigação
  { grupo: 'Irrigação', nome: 'hipoclorito', tipo: 'text', label: 'Hipoclorito de sódio (%)' },
  { grupo: 'Irrigação', nome: 'clorexidina', tipo: 'text', label: 'Clorexidina (2%)' },
  { grupo: 'Irrigação', nome: 'edta', tipo: 'text', label: 'EDTA (17%)' },

  // Potencialização da substância química
  { grupo: 'Potencialização da substância química', nome: 'potencializacao', tipo: 'boolean', label: 'Potencialização da substância química?' },
  { grupo: 'Potencialização da substância química', nome: 'tecnicaPotencializacao', tipo: 'text', label: 'Técnica de potencialização' },

  // Medicação Intracanal
  { grupo: 'Medicação Intracanal', nome: 'medicacaoIntracanalConsulta', tipo: 'text', label: 'Medicação Intracanal (por consulta)' },

  // Técnica de Obturação
  { grupo: 'Técnica de Obturação', nome: 'tecnicaObturação', tipo: 'text', label: 'Técnica de Obturação' },
  { grupo: 'Técnica de Obturação', nome: 'coneSelecionado', tipo: 'text', label: 'Cone selecionado' },
  { grupo: 'Técnica de Obturação', nome: 'cimentoObturador', tipo: 'text', label: 'Cimento obturador' },

  // Selamento Coronar Provisório
  { grupo: 'Selamento Coronar Provisório', nome: 'selamentoCoronarProvisorio', tipo: 'text', label: 'Selamento Coronar Provisório' },

  // Extras
  { grupo: 'Extras', nome: 'extras', tipo: 'text', label: 'Extras (ex.: remoção de retentor, instrumentação, etc.)' },

  // Tomografia
  { grupo: 'Tomografia', nome: 'tomografiaNecessaria', tipo: 'boolean', label: 'Tomografia necessária?' },
  { grupo: 'Tomografia', nome: 'motivoTomografia', tipo: 'text', label: 'Motivo para tomografia' },
  { grupo: 'Tomografia', nome: 'resultadoTomografia', tipo: 'text', label: 'Resultado da tomografia' },

  // Procedimentos
  { grupo: 'Procedimentos', nome: 'procedimentos', tipo: 'text', label: 'Procedimentos realizados' },
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
