import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Isso faz com que o serviço seja um singleton em toda a aplicação
})
export class UserService {
  // Usamos BehaviorSubject para que outros componentes possam se inscrever e receber atualizações
  private userDataSource = new BehaviorSubject<any>(null);
  public userData$ = this.userDataSource.asObservable(); // Observable para os componentes que desejarem se inscrever

  // Método para atualizar os dados do usuário
  setUser(userData: any) {
    this.userDataSource.next(userData);
  }

  // Método para recuperar os dados do usuário diretamente
  getUser() {
    return this.userDataSource.value;
  }

  // Método para limpar os dados do usuário (por exemplo, no logout)
  clearUser() {
    this.userDataSource.next(null);
  }
}
