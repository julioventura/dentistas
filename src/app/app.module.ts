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
import { PerfilComponent } from './perfil/perfil.component'; 
import { HomepageComponent } from './homepage/homepage.component';
import { HomepageIntroComponent } from './homepage-intro/homepage-intro.component'; 
import { ChatbotComponent } from './chatbot/chatbot.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfigComponent } from './shared/config/config.component';
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { CamposRegistroComponent } from './camposRegistro/camposRegistro.component';
import { FichasComponent } from './fichas/fichas.component'; 
import { MenuConfigComponent } from './menu-config/menu-config.component';
import { HomeConfigComponent } from './home-config/home-config.component';
import { ImportarCadastroComponent } from './importar-cadastro/importar-cadastro.component';
import { ErupcoesComponent } from './erupcoes/erupcoes.component';
import { EditComponent as ErupcoesEditComponent } from './erupcoes/edit/edit.component';
import { BackupComponent } from './backup/backup.component'; 
import { AutoFocusDirective } from './shared/directives/auto-focus.directive';

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



const routes: Routes = [
  { path: '', component: HomeComponent }, // Página inicial padrão
  { path: 'home', component: HomeComponent, data: { animation: '1' } },
  { path: 'login', component: LoginComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'perfil', component: PerfilComponent, data: { animation: '2' } }, 
  { path: 'homepage', component: HomepageComponent, data: { animation: '2' } }, 
  { path: 'homepage-intro', component: HomepageIntroComponent, data: { animation: '2' } }, 
  { path: 'menu-config', component: MenuConfigComponent },
  { path: 'home-config', component: HomeConfigComponent },
  { path: 'importar-cadastro', component: ImportarCadastroComponent },
  { path: 'erupcoes', component: ErupcoesComponent }, 

  // Rota para o componente camposRegistro
  { path: 'camposRegistro', component: CamposRegistroComponent },
  { path: 'list/:collection', component: ListComponent, data: { animation: '3' } }, 
  { path: 'view/:collection/:id', component: ViewComponent, data: { animation: '4' } },
  { path: 'edit/:collection/:id', component: EditComponent, data: { animation: '5' } },

  // Rota para o componente fichas
  { path: 'fichas', component: FichasComponent },
  { path: 'list-fichas/:collection/:id/fichas/:subcollection', component: ListComponent, data: { animation: '6' } },
  { path: 'view-ficha/:collection/:id/fichas/:subcollection/itens/:fichaId', component: ViewComponent, data: { animation: '7' } },
  { path: 'edit-ficha/:collection/:id/fichas/:subcollection/itens/:fichaId', component: EditComponent, data: { animation: '8' } },
  { path: 'add-ficha/:collection/:id/fichas/:subcollection', component: EditComponent },
  
    // Rota para o componente Backup
    { path: 'backup', component: BackupComponent },
  
  // HOMEPAGES
  { path: ':username/intro', component: HomepageIntroComponent },
  { path: ':username', loadChildren: () => import('./homepage/homepage.module').then(m => m.HomepageModule), canActivate: [UsernameGuard] },

  // Redireciona para a página inicial em caso de rota inválida
  { path: '**', component: HomeComponent, data: { animation: '9' } }
];


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
    ListComponent,
    CamposRegistroComponent,
    ViewComponent,
    EditComponent,
    PerfilComponent,
    HomepageIntroComponent,
    FichasComponent,
    MenuConfigComponent,
    HomeConfigComponent,
    ImportarCadastroComponent,
    ErupcoesComponent,
    MenuComponent,
    ErupcoesEditComponent,
    AutoFocusDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes), // Configurar roteamento diretamente
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BackupComponent // Import the standalone component
  ],
  providers: [
    AuthGuard, DatePipe, provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }