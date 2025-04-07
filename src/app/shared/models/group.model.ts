import firebase from 'firebase/compat/app';

export interface Group {
  id: string;                   // ID único do grupo
  name: string;                 // Nome do grupo (ex: "Turma de Ortodontia")
  description?: string;         // Descrição opcional
  clinica?: string;             // Clínica relacionada
  adminIds: string[];           // IDs dos professores/administradores
  memberIds: string[];          // IDs dos alunos/membros
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  createdBy: string;            // Consistência com os modelos existentes
}

// Interface para o campo de grupo que será adicionado aos registros
export interface GroupAccess {
  groupId: string;              // ID do grupo ao qual o registro pertence
  // Não precisamos adicionar createdBy pois já existe nos modelos como visto no crm.model.ts
}

// Adicione esta interface ao arquivo group.model.ts
export interface SharingMetadata {
  groupId: string;              // ID do grupo com o qual foi compartilhado
  sharedBy: string;             // ID do usuário que compartilhou
  sharedAt: firebase.firestore.Timestamp; // Data/hora do compartilhamento
  lastModifiedBy?: string;      // Quem alterou o compartilhamento por último
  lastModifiedAt?: firebase.firestore.Timestamp; // Quando foi alterado por último
}

// Adicione isso ao arquivo group.model.ts existente
export interface GroupJoinRequest {
  id?: string;
  userId: string;
  groupId: string;
  requestedAt: firebase.firestore.Timestamp;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  responseMessage?: string;
  respondedBy?: string;
  respondedAt?: firebase.firestore.Timestamp;
}