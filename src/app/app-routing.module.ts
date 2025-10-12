import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { DashboardAgentComponent as AgentDashboardComponent } from './components/agent/dashboard-agent/dashboard-agent.component';
import { ProjetsAgentComponent } from './components/agent/projets-agent/projets-agent.component';
import { ReclamationsAgentComponent } from './components/agent/reclamations-agent/reclamations-agent.component';
import { ProfilAgentComponent } from './components/agent/profil-agent/profil-agent.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/dashboard', component: DashboardAdminComponent },
  { path: 'agent/dashboard', component: DashboardAgentComponent },
  { path: 'agent/projets', component: ProjetsAgentComponent },
  { path: 'agent/reclamations', component: ReclamationsAgentComponent },
  { path: 'agent/profil', component: ProfilAgentComponent },
  { path: 'citoyen/dashboard', component: DashboardCitoyenComponent },
  { path: 'citoyen/projets', component: ProjetsComponent },
  { path: 'citoyen/etablissements', component: EtablissementsComponent },
  { path: 'citoyen/mes-reclamations', component: MesReclamationsComponent },
  { path: 'citoyen/chatbot', component: ChatbotComponent },
  { path: 'citoyen/profil', component: ProfilComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
