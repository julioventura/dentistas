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

export const CAMPOS_FICHAS_PAGAMENTOS: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Titulo' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
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
  { nome: 'nome', tipo: 'text', label: 'Dente' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
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

export const CAMPOS_FICHAS_RISCO_CARIE: Campo[] = [
  { nome: 'nome', tipo: 'text', label: 'Dente' },
  { nome: 'data', tipo: 'date', label: 'Criado em' },
  { nome: 'obs', tipo: 'textarea', label: 'Observações' },
  { nome: 'nuvem', tipo: 'url', label: 'Arquivos na nuvem' },
];