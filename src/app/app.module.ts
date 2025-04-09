import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DatePipe } from '@angular/common';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { ConfigComponent } from './config/config.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { PerfilComponent } from './perfil/perfil.component';
import { FichasComponent } from './fichas/fichas.component';
import { ViewComponent } from './view/view.component';
import { CamposRegistroComponent } from './camposRegistro/camposRegistro.component';
import { HomeConfigComponent } from './home/home-config/home-config.component';
import { MenuConfigComponent } from './menu/menu-config/menu-config.component';
import { ImportarCadastroComponent } from './shared/utils/importar-cadastro/importar-cadastro.component';

// Module imports
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material.module';

// Services
import { FirestoreService } from './shared/services/firestore.service';
import { LoggingService } from './shared/services/logging.service';

// Import standalone components
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { GroupSharingComponent } from './shared/components/group/group-sharing.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    FooterComponent,
    MenuComponent,
    ListComponent,
    EditComponent,
    PerfilComponent,
    FichasComponent,
    ResetPasswordComponent,
    ViewComponent,
    CamposRegistroComponent,
    HomeConfigComponent,
    MenuConfigComponent,
    ImportarCadastroComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MaterialModule,
    
    // Import standalone components
    GroupSharingComponent,
    ConfigComponent
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    FirestoreService,
    LoggingService,
    DatePipe
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }