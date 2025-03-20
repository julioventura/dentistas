import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';  // Importe o CommonModule
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
import { ChatbotComponent } from './chatbot/chatbot.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfigComponent } from './config/config.component';
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { CamposRegistroComponent } from './camposRegistro/camposRegistro.component';
import { FichasComponent } from './fichas/fichas.component'; // Importe o componente Fichas
import { MenuConfigComponent } from './menu/menu-config/menu-config.component';
import { HomeConfigComponent } from './home/home-config/home-config.component';
import { HomepageIntroComponent } from './homepage/homepage-intro/homepage-intro.component';
import { ImportarCadastroComponent } from './importar-cadastro/importar-cadastro.component';
import { ErupcoesComponent } from './erupcoes/erupcoes.component';
import { BackupComponent } from './backup/backup.component'; // Import the standalone component
import { AutoFocusDirective } from './shared/directives/auto-focus.directive';
import { WhatsappButtonComponent } from './homepage/whatsapp-button/whatsapp-button.component';
import { TabelaReferenciaDialogComponent } from './erupcoes/tabela-referencia-dialog.component';
import { ChatbotWidgetComponent } from "./homepage/chatbot-widget/chatbot-widget.component";
import { CanDeactivateGuard } from './shared/guards/can-deactivate.guard';

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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Importar o HomepageComponent como componente standalone
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'perfil', component: PerfilComponent, canDeactivate: [CanDeactivateGuard], data: { animation: '2' } },
  { path: 'homepage-intro', component: HomepageIntroComponent, data: { animation: '3' } },
  { path: 'menu-config', component: MenuConfigComponent },
  { path: 'home-config', component: HomeConfigComponent },
  { path: 'importar-cadastro', component: ImportarCadastroComponent },
  { path: 'erupcoes', component: ErupcoesComponent },

  // Rota para o componente camposRegistro
  { path: 'camposRegistro', component: CamposRegistroComponent },
  { path: 'list/:collection', component: ListComponent, data: { animation: '4' } },
  { path: 'view/:collection/:id', component: ViewComponent, data: { animation: '5' } },
  { path: 'edit/:collection/:id', component: EditComponent, canDeactivate: [CanDeactivateGuard], data: { animation: '6' } },

  // Rota para o componente fichas
  { path: 'fichas', component: FichasComponent },
  { path: 'list-fichas/:collection/:id/fichas/:subcollection', component: ListComponent, data: { animation: '7' } },
  { path: 'view-ficha/:collection/:id/fichas/:subcollection/itens/:fichaId', component: ViewComponent, data: { animation: '8' } },
  { path: 'edit-ficha/:collection/:id/fichas/:subcollection/itens/:fichaId', component: EditComponent, canDeactivate: [CanDeactivateGuard], data: { animation: '9' } },
  { path: 'add-ficha/:collection/:id/fichas/:subcollection', component: EditComponent, canDeactivate: [CanDeactivateGuard], data: { animation: '10' } },

  // Rota para o componente Backup
  { path: 'backup', component: BackupComponent },

  // HOMEPAGES
  { path: ':username', component: HomepageComponent, canActivate: [UsernameGuard] },

  // Redireciona para a página inicial em caso de rota inválida
  { path: '**', component: HomeComponent, data: { animation: '11' } }
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ChatbotComponent,
    FooterComponent,
    MenuComponent, // Este componente estava duplicado
    ResetPasswordComponent,
    ConfigComponent,
    SignupDialogComponent,
    ListComponent,
    CamposRegistroComponent,
    ViewComponent,
    EditComponent,
    PerfilComponent,
    FichasComponent,
    MenuConfigComponent,
    HomeConfigComponent,
    ImportarCadastroComponent,
    ErupcoesComponent,
    // MenuComponent, - Removi a duplicata
    AutoFocusDirective
  ], // Faltava este colchete de fechamento para declarations
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BackupComponent,
    ChatbotWidgetComponent,
    HomepageComponent,
    TabelaReferenciaDialogComponent,
    WhatsappButtonComponent
  ], 
  providers: [
    AuthGuard, DatePipe, provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }