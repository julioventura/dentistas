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

  // Encaminhamento e Dente (campos comentados não foram incluídos)

  // Queixa e Histórico Clínico
  { grupo: 'Queixa e Histórico Clínico', nome: 'queixaPrincipal', tipo: 'text', label: 'Queixa Principal' },
  { grupo: 'Queixa e Histórico Clínico', nome: 'emTratamentoMedico', tipo: 'boolean', label: 'Está em tratamento médico?' },
  { grupo: 'Queixa e Histórico Clínico', nome: 'motivoTratamentoMedico', tipo: 'text', label: 'Motivo do tratamento médico' },
  { grupo: 'Queixa e Histórico Clínico', nome: 'usaMedicamento', tipo: 'boolean', label: 'Está tomando algum medicamento?' },
  { grupo: 'Queixa e Histórico Clínico', nome: 'quaisMedicamentos', tipo: 'text', label: 'Quais medicamentos?' },
  { grupo: 'Queixa e Histórico Clínico', nome: 'motivoMedicamentos', tipo: 'text', label: 'Motivo do uso de medicamentos' },

  // Aspectos Clínicos da Coroa
  { grupo: 'Aspectos Clínicos da Coroa', nome: 'higido', tipo: 'boolean', label: 'Coroa: Hígido' },
  { grupo: 'Aspectos Clínicos da Coroa', nome: 'alteracaoCor', tipo: 'boolean', label: 'Coroa: Alteração de cor' },
  { grupo: 'Aspectos Clínicos da Coroa', nome: 'ausente', tipo: 'boolean', label: 'Coroa: Ausente' },
  { grupo: 'Aspectos Clínicos da Coroa', nome: 'carie', tipo: 'boolean', label: 'Coroa: Cárie' },
  { grupo: 'Aspectos Clínicos da Coroa', nome: 'fratura', tipo: 'boolean', label: 'Coroa: Fratura' },
  { grupo: 'Aspectos Clínicos da Coroa', nome: 'coroaPermanente', tipo: 'boolean', label: 'Coroa: Permanente' },
  { grupo: 'Aspectos Clínicos da Coroa', nome: 'restaurado', tipo: 'boolean', label: 'Coroa: Restaurado' },
  { grupo: 'Aspectos Clínicos da Coroa', nome: 'exposicaoPulpar', tipo: 'boolean', label: 'Coroa: Exposição pulpar' },
  { grupo: 'Aspectos Clínicos da Coroa', nome: 'coroaProvisoria', tipo: 'boolean', label: 'Coroa: Provisória' },
  { grupo: 'Aspectos Clínicos da Coroa', nome: 'selamentoProvisorio', tipo: 'boolean', label: 'Coroa: Selamento provisório' },

  // Aspectos Clínicos dos Tecidos Moles
  { grupo: 'Aspectos Clínicos dos Tecidos Moles', nome: 'edema', tipo: 'boolean', label: 'Tecidos moles: Edema' },
  { grupo: 'Aspectos Clínicos dos Tecidos Moles', nome: 'fistula', tipo: 'boolean', label: 'Tecidos moles: Fístula' },

  // Avaliação da Dor
  { grupo: 'Avaliação da Dor', nome: 'dorPresente', tipo: 'boolean', label: 'Dor: Presente?' },
  { grupo: 'Avaliação da Dor', nome: 'nivelDor', tipo: 'number', label: 'Dor: Nível de intensidade (1-10)' },
  { grupo: 'Avaliação da Dor', nome: 'localizacaoDor', tipo: 'text', label: 'Dor: Localização (Localizada/Difusa)' },
  { grupo: 'Avaliação da Dor', nome: 'denteLocalizado', tipo: 'text', label: 'Dente(s) com dor (se localizada)' },
  { grupo: 'Avaliação da Dor', nome: 'regiaoDor', tipo: 'text', label: 'Região da dor (se difusa)' },
  { grupo: 'Avaliação da Dor', nome: 'frequenciaDor', tipo: 'text', label: 'Dor: Frequência' },
  { grupo: 'Avaliação da Dor', nome: 'gatilhoDor', tipo: 'text', label: 'Dor: Iniciada por' },
  { grupo: 'Avaliação da Dor', nome: 'alivioDor', tipo: 'text', label: 'Dor: Aliviada por' },
  { grupo: 'Avaliação da Dor', nome: 'duracaoDor', tipo: 'text', label: 'Dor: Duração' },

  // Exame Radiográfico Inicial – Câmara Pulpar
  { grupo: 'Exame Radiográfico Inicial – Câmara Pulpar', nome: 'radioCarie', tipo: 'boolean', label: 'Câmara Pulpar: Cárie' },
  { grupo: 'Exame Radiográfico Inicial – Câmara Pulpar', nome: 'radioRestauracao', tipo: 'boolean', label: 'Câmara Pulpar: Restauração' },
  { grupo: 'Exame Radiográfico Inicial – Câmara Pulpar', nome: 'radioComunicacao', tipo: 'boolean', label: 'Câmara Pulpar: Comunicação com meio bucal' },
  { grupo: 'Exame Radiográfico Inicial – Câmara Pulpar', nome: 'radioAcessadaProvisorio', tipo: 'boolean', label: 'Câmara Pulpar: Acessada com provisório' },
  { grupo: 'Exame Radiográfico Inicial – Câmara Pulpar', nome: 'radioDensInDente', tipo: 'boolean', label: 'Câmara Pulpar: Dens in Dente' },
  { grupo: 'Exame Radiográfico Inicial – Câmara Pulpar', nome: 'radioNoduloPulpar', tipo: 'boolean', label: 'Câmara Pulpar: Nódulo pulpar' },
  { grupo: 'Exame Radiográfico Inicial – Câmara Pulpar', nome: 'radioAtresica', tipo: 'boolean', label: 'Câmara Pulpar: Atrésica' },
  { grupo: 'Exame Radiográfico Inicial – Câmara Pulpar', nome: 'radioAmpla', tipo: 'boolean', label: 'Câmara Pulpar: Ampla' },

  // Exame Radiográfico Inicial – Canais Radiculares
  { grupo: 'Exame Radiográfico Inicial – Canais Radiculares', nome: 'calcificado', tipo: 'boolean', label: 'Canais: Calcificado' },
  { grupo: 'Exame Radiográfico Inicial – Canais Radiculares', nome: 'curvaturaAcentuada', tipo: 'boolean', label: 'Canais: Curvatura acentuada' },
  { grupo: 'Exame Radiográfico Inicial – Canais Radiculares', nome: 'medicacaoIntracanal', tipo: 'boolean', label: 'Canais: Medicação intracanal' },
  { grupo: 'Exame Radiográfico Inicial – Canais Radiculares', nome: 'presencaMaterialObturador', tipo: 'boolean', label: 'Canais: Material obturador presente' },
  { grupo: 'Exame Radiográfico Inicial – Canais Radiculares', nome: 'linhaFraturaLocalizacao', tipo: 'text', label: 'Canais: Linha de fratura - Localização' },
  { grupo: 'Exame Radiográfico Inicial – Canais Radiculares', nome: 'limaFraturadaLocalizacao', tipo: 'text', label: 'Canais: Lima fraturada - Localização' },
  { grupo: 'Exame Radiográfico Inicial – Canais Radiculares', nome: 'perfuracaoLocalizacao', tipo: 'text', label: 'Canais: Perfuraçã - Localização' },
  { grupo: 'Exame Radiográfico Inicial – Canais Radiculares', nome: 'tipoRetentor', tipo: 'text', label: 'Canais: Tipo de retentor intrarradicular (Metálico/Fibra de vidro)' },
  { grupo: 'Exame Radiográfico Inicial – Canais Radiculares', nome: 'reabsorpcao', tipo: 'text', label: 'Canais: Reabsorção (Externa, Interna, Lateral, Apical, Anquilose)' },
  { grupo: 'Exame Radiográfico Inicial – Canais Radiculares', nome: 'localizacaoReabsorpcao', tipo: 'text', label: 'Canais: Localização da reabsorção' },
  { grupo: 'Exame Radiográfico Inicial – Canais Radiculares', nome: 'regiaoFurca', tipo: 'text', label: 'Canais: Região de furca' },

  // Exame Radiográfico Inicial – Região Periapical
  { grupo: 'Exame Radiográfico Inicial – Região Periapical', nome: 'regiaoPeriapical', tipo: 'text', label: 'Região Periapical' },

  // Teste de Sensibilidade
  { grupo: 'Teste de Sensibilidade', nome: 'denteControle', tipo: 'text', label: 'Dente controle (Sensibilidade)' },
  { grupo: 'Teste de Sensibilidade', nome: 'denteSuspeito', tipo: 'text', label: 'Dente suspeito (Sensibilidade)' },

  // Testes Clínicos
  { grupo: 'Testes Clínicos', nome: 'testeMobilidade', tipo: 'boolean', label: 'Teste: Mobilidade' },
  { grupo: 'Testes Clínicos', nome: 'testePalpacao', tipo: 'boolean', label: 'Teste: Palpação' },
  { grupo: 'Testes Clínicos', nome: 'testePercussao', tipo: 'boolean', label: 'Teste: Percussão' },
  { grupo: 'Testes Clínicos', nome: 'testeSondagem', tipo: 'boolean', label: 'Teste: Sondagem periodontal' },
  { grupo: 'Testes Clínicos', nome: 'respostaTeste', tipo: 'boolean', label: 'Teste: Resposta' },
  { grupo: 'Testes Clínicos', nome: 'duracaoTeste', tipo: 'text', label: 'Teste: Duração' },
  { grupo: 'Testes Clínicos', nome: 'intensidadeTeste', tipo: 'text', label: 'Teste: Intensidade' },

  // Diagnóstico
  { grupo: 'Diagnóstico', nome: 'diagnosticoPulpar', tipo: 'text', label: 'Diagnóstico: Pulpar' },
  { grupo: 'Diagnóstico', nome: 'diagnosticoPerirradicular', tipo: 'text', label: 'Diagnóstico: Perirradicular' },

  // Plano de Tratamento
  { grupo: 'Plano de Tratamento', nome: 'planoTratamento', tipo: 'textarea', label: 'Plano de Tratamento' },

  // Grampo do Isolamento
  { grupo: 'Grampo do Isolamento', nome: 'grampoIsolamento', tipo: 'text', label: 'Grampo do Isolamento Absoluto' },

  // Preparo Químico-Mecânico
  { grupo: 'Preparo Químico-Mecânico', nome: 'tecnicaInstrumentacao', tipo: 'text', label: 'Técnica de instrumentação' },

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
