import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { DashboardAgentComponent } from './components/dashboard-agent/dashboard-agent.component';
import { DashboardCitoyenComponent } from './components/dashboard-citoyen/dashboard-citoyen.component';
import { ProjetsComponent } from './components/citoyen/projets/projets.component';
import { EtablissementsComponent } from './components/citoyen/etablissements/etablissements.component';
import { MesReclamationsComponent } from './components/citoyen/mes-reclamations/mes-reclamations.component';
import { ChatbotComponent } from './components/citoyen/chatbot/chatbot.component';
import { ProfilComponent } from './components/citoyen/profil/profil.component';
import { ProjetsAgentComponent } from './components/agent/projets-agent/projets-agent.component';
import { ReclamationsAgentComponent } from './components/agent/reclamations-agent/reclamations-agent.component';
import { ProfilAgentComponent } from './components/agent/profil-agent/profil-agent.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    DashboardAdminComponent,
    DashboardAgentComponent,
    DashboardCitoyenComponent,
    ProjetsComponent,
    EtablissementsComponent,
    MesReclamationsComponent,
    ChatbotComponent,
    ProfilComponent,
    ProjetsAgentComponent,
    ReclamationsAgentComponent,
    ProfilAgentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
