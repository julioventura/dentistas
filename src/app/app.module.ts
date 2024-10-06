import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // RouterModule para rotas

// Firebase e Firestore
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

// Componentes da aplicação
import { AppComponent } from './app.component';
import { PacientesComponent } from './pacientes/pacientes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';  // Componente de usuários
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { EditComponent } from './edit/edit.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ViewComponent } from './view/view.component';
import { ConfigComponent } from './shared/config/config.component';  // Importando o ConfigComponent

// Serviços
import { FirestoreService } from './shared/firestore.service';  // Serviço Firestore genérico
import { ConfigService } from './shared/config.service';  // Importando o ConfigService

@NgModule({
  declarations: [
    AppComponent,
    PacientesComponent,  // Componente para pacientes
    UsuariosComponent,   // Componente para usuários
    HomeComponent,       // Página inicial
    LoginComponent,      // Tela de login
    ChatbotComponent,    // Componente de chatbot
    EditComponent,       // Tela de edição
    FooterComponent,     // Rodapé
    MenuComponent,       // Menu de navegação
    ResetPasswordComponent,  // Componente de redefinição de senha
    ViewComponent,        // Tela de visualização de registro
    ConfigComponent       // Componente de configuração
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },           // Rota principal
      { path: 'pacientes', component: PacientesComponent },  // Rota para pacientes
      { path: 'usuarios', component: UsuariosComponent },    // Rota para usuários
      { path: 'login', component: LoginComponent },          // Rota de login
      { path: 'chatbot', component: ChatbotComponent },      // Rota para o chatbot
      { path: 'menu', component: MenuComponent },            // Rota para o menu
      { path: 'reset-password', component: ResetPasswordComponent }, // Rota para redefinir senha
      { path: 'view/:collection/:id', component: ViewComponent },  // Passa a coleção dinamicamente
      { path: 'edit/:collection/:id', component: EditComponent },  // Passa a coleção dinamicamente
      { path: 'config', component: ConfigComponent },        // Adiciona a rota para o componente Config
      { path: '**', redirectTo: '' }  // Redireciona qualquer rota não encontrada para a página inicial
    ]),
    AngularFireModule.initializeApp(environment.firebaseConfig),  // Inicializa Firebase
    AngularFirestoreModule,  // Importa Firestore
    AngularFireAuthModule     // Importa módulo de autenticação do Firebase
  ],
  providers: [FirestoreService, ConfigService],  
  bootstrap: [AppComponent]
})
export class AppModule { }
