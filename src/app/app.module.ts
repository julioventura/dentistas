import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
import { PerfilComponent } from './perfil/perfil.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { ConfigComponent } from './config/config.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { CamposRegistroComponent } from './camposRegistro/camposRegistro.component';
import { FichasComponent } from './fichas/fichas.component';
import { MenuConfigComponent } from './menu/menu-config/menu-config.component';
import { HomeConfigComponent } from './home/home-config/home-config.component';
import { ImportarCadastroComponent } from './shared/utils/importar-cadastro/importar-cadastro.component';
import { ErupcoesComponent } from './erupcoes/erupcoes.component';
import { AutoFocusDirective } from './shared/directives/auto-focus.directive';
import { GroupManagerComponent } from './shared/components/group-manager/group-manager.component';
import { RequestJoinDialog } from './shared/dialogs/request-join-dialog/request-join-dialog.component';

// Serviços
import { FirestoreService } from './shared/services/firestore.service';
import { GroupService } from './shared/services/group.service';
import { GroupSharingService } from './shared/services/group-sharing.service';
import { LoggingService } from './shared/services/logging.service';
import { GroupSharingComponent } from './shared/components/group-sharing/group-sharing.component';

// Guard
import { AuthGuard } from './shared/guards/auth.guard';

// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Standalone components
import { HomepageComponent } from './homepage/homepage.component';
import { BackupComponent } from './backup/backup.component';
import { ChatbotWidgetComponent } from "./chatbot-widget/chatbot-widget.component";
import { WhatsappButtonComponent } from './homepage/whatsapp-button/whatsapp-button.component';
import { TabelaReferenciaDialogComponent } from './erupcoes/tabela-referencia-dialog.component';

import { AppRoutingModule } from './app-routing.module';
import { AiHomepageService } from './homepage/chatbot-homepage/ai-homepage.service';
import { EditModule } from './edit/edit.module';
import { MaterialModule } from './shared/material.module';
import { DatePipe } from '@angular/common';

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
    AutoFocusDirective,
    GroupManagerComponent
  ], 
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    // Standalone components
    BackupComponent,
    ChatbotWidgetComponent,
    HomepageComponent,
    TabelaReferenciaDialogComponent,
    WhatsappButtonComponent,
    GroupSharingComponent, // Adicionar o novo componente standalone
    // Feature modules
    EditModule,
    MaterialModule
  ], 
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    FirestoreService,
    AiHomepageService,
    GroupService,
    GroupSharingService,
    LoggingService,
    AuthGuard, 
    DatePipe, 
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }