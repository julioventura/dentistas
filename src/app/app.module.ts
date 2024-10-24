import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Firebase e Firestore
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

// Componentes da aplicação
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PerfilComponent } from './perfil/perfil.component'; // Importando o componente Perfil
import { HomepageIntroComponent } from './homepage-intro/homepage-intro.component'; // Importar o novo componente
import { ChatbotComponent } from './chatbot/chatbot.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfigComponent } from './shared/config/config.component';
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component';
import { RegistrosComponent } from './registros/registros.component';
import { CamposRegistroComponent } from './camposRegistro/camposRegistro.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { FichasComponent } from './fichas/fichas.component'; // Importe o componente Fichas
import { ViewFichaComponent } from './view-ficha/view-ficha.component';
import { EditFichaComponent } from './edit-ficha/edit-ficha.component';
import { ListFichasComponent } from './list-fichas/list-fichas.component';

// Serviços

// Guard
import { AuthGuard } from './shared/guards/auth.guard';  // Atualizado com o novo caminho
import { UsernameGuard } from './shared/guards/username.guard';  // Atualizado com o novo caminho


// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ChatbotComponent,
    FooterComponent,
    MenuComponent,
    ResetPasswordComponent,
    ConfigComponent,
    SignupDialogComponent,
    RegistrosComponent,
    CamposRegistroComponent,
    ViewComponent,
    EditComponent,
    PerfilComponent,
    HomepageIntroComponent,
    FichasComponent,
    ViewFichaComponent,
    EditFichaComponent,
    ListFichasComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent }, // Página inicial padrão
      { path: 'home', component: HomeComponent, data: { animation: '1' } },
      { path: 'login', component: LoginComponent },
      { path: 'chatbot', component: ChatbotComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'config', component: ConfigComponent },
      { path: 'perfil', component: PerfilComponent, data: { animation: '2' } }, // Rota para a página de perfil

      // Rota para o componente camposRegistro
      { path: 'camposRegistro', component: CamposRegistroComponent },
      { path: 'registros/:collection', component: RegistrosComponent, data: { animation: '3' } }, // lista os registros de uma coleção
      { path: 'view/:collection/:id', component: ViewComponent, data: { animation: '4' } },
      { path: 'edit/:collection/:id', component: EditComponent, data: { animation: '5' } },

      // Rota para o componente fichas
      { path: 'fichas', component: FichasComponent },
      { path: 'add-ficha/:collection/:id/ficha/:subCollection', component: EditFichaComponent },
      
      { path: 'list-fichas/:collection/:id/ficha/:subcollection', component: ListFichasComponent, data: { animation: '6' } },
      { path: 'view-ficha/:collection/:id/ficha/:subcollection/itens/:fichaId', component: ViewFichaComponent, data: { animation: '7' } },
      { path: 'edit-ficha/:collection/:id/ficha/:subcollection/itens/:fichaId', component: EditFichaComponent, data: { animation: '8' } },

      // HOMEPAGES
      { path: ':username/intro', component: HomepageIntroComponent },
      { path: ':username', loadChildren: () => import('./homepage/homepage.module').then(m => m.HomepageModule), canActivate: [UsernameGuard] },

      // Redireciona para a página inicial em caso de rota inválida
      { path: '**', component: HomeComponent, data: { animation: '9' } }
    ]),


    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
