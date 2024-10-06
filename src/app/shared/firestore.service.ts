import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService<T extends { id?: string }> {  // Adiciona uma tipagem que exige que 'T' tenha opcionalmente a propriedade 'id'
  constructor(private firestore: AngularFirestore) {}

  // CREATE: Adicionar um novo registro à coleção
  addRegistro(collectionName: string, registro: T): Promise<void> {
    const id = registro.id ? registro.id : this.createId();  // Garante que o 'id' seja definido
    const registroComId = { ...registro, id };  // Adiciona o 'id' ao registro se não estiver presente
    return this.firestore.collection(collectionName).doc(id).set(registroComId);  // Salva o documento com o ID fornecido ou gerado
  }

  // READ: Buscar todos os registros da coleção
  getRegistros(collectionName: string): Observable<T[]> {
    return this.firestore.collection<T>(collectionName).valueChanges({ idField: 'id' });
  }

  // READ: Buscar registro por ID
  getRegistroById(collectionName: string, id: string): Observable<T | undefined> {
    return this.firestore.collection<T>(collectionName).doc(id).valueChanges();
  }

  // UPDATE: Atualizar um registro existente
  updateRegistro(collectionName: string, id: string, registro: Partial<T>): Promise<void> {
    return this.firestore.collection(collectionName).doc(id).update(registro);  // Atualiza com base no ID
  }

  // DELETE: Deletar um registro pelo ID
  deleteRegistro(collectionName: string, id: string): Promise<void> {
    return this.firestore.collection(collectionName).doc(id).delete();
  }

  // Método para criar um ID único
  createId(): string {
    return this.firestore.createId();
  }

  // Método para gerar o próximo código sequencial com dígito verificador
  gerarProximoCodigo(collectionName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getRegistros(collectionName).subscribe(registros => {
        let novoCodigo = '001'; // Começa com '001' se for o primeiro

        if (registros && registros.length > 0) {
          const codigos = registros.map((r: any) => r.codigo.split('-')[0]);
          const ultimoCodigo = Math.max(...codigos.map(c => parseInt(c, 10)));
          const proximoCodigo = (ultimoCodigo + 1).toString().padStart(3, '0');
          novoCodigo = proximoCodigo;
        }

        const digitoVerificador = this.calcularDigitoVerificador(novoCodigo);
        resolve(`${novoCodigo}-${digitoVerificador}`);
      }, error => {
        reject('Erro ao gerar o próximo código.');
      });
    });
  }

  // Função para calcular o dígito verificador
  calcularDigitoVerificador(codigo: string): number {
    return codigo.split('').reduce((acc, num) => acc + parseInt(num, 10), 0) % 10;
  }
}
