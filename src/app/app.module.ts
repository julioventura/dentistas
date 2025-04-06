import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Importe o CommonModule
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

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
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { ConfigComponent } from './config/config.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { CamposRegistroComponent } from './camposRegistro/camposRegistro.component';
import { FichasComponent } from './fichas/fichas.component'; // Importe o componente Fichas
import { MenuConfigComponent } from './menu/menu-config/menu-config.component';
import { HomeConfigComponent } from './home/home-config/home-config.component';
import { ImportarCadastroComponent } from './shared/utils/importar-cadastro/importar-cadastro.component';
import { ErupcoesComponent } from './erupcoes/erupcoes.component';
import { BackupComponent } from './backup/backup.component'; // Import the standalone component
import { AutoFocusDirective } from './shared/directives/auto-focus.directive';
import { WhatsappButtonComponent } from './homepage/whatsapp-button/whatsapp-button.component';
import { TabelaReferenciaDialogComponent } from './erupcoes/tabela-referencia-dialog.component';
import { ChatbotWidgetComponent } from "./chatbot-widget/chatbot-widget.component";
import { DatePipe } from '@angular/common';

// Serviços
import { FirestoreService } from './shared/services/firestore.service';

// Guard
import { AuthGuard } from './shared/guards/auth.guard';  // Atualizado com o novo caminho


// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Importar o HomepageComponent como componente standalone
import { HomepageComponent } from './homepage/homepage.component';
import { AppRoutingModule } from './app-routing.module';
import { AiHomepageService } from './homepage/chatbot-homepage/ai-homepage.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    FooterComponent,
    MenuComponent, 
    ResetPasswordComponent,
    ConfigComponent,
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
    AutoFocusDirective
  ], 
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule, // Importamos o módulo de rotas separado
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
    provideHttpClient(withInterceptorsFromDi()),
    FirestoreService,
    AiHomepageService,
    AuthGuard, DatePipe, provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }