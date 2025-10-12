import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/auth.service';
import { AgentService, ReclamationAgent, ProjetAgent } from '../../../services/agent.service';

@Component({
  selector: 'app-profil-agent',
  templateUrl: './profil-agent.component.html',
  styleUrls: ['./profil-agent.component.css']
})
export class ProfilAgentComponent implements OnInit {
  currentUser: User | null = null;
  editedAgent: any = {};
  isEditMode = false;
  isSaving = false;
  isSavingPreferences = false;

  preferences = {
    notificationsEmail: true,
    notificationsUrgentes: true,
    rapportsHebdo: false
  };

  constructor(
    private authService: AuthService,
    private agentService: AgentService
  ) {}

  ngOnInit(): void {
    // Vérifier que l'utilisateur est bien un agent
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'agent') {
      this.authService.logout();
      return;
    }

    this.initializeAgentData();
    this.loadPreferences();
  }

  initializeAgentData(): void {
    this.editedAgent = {
      email: this.getAgentEmail(),
      municipalite: this.getMunicipality(),
      telephone: this.getAgentPhone()
    };
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      this.cancelEdit();
    } else {
      this.isEditMode = true;
      this.initializeAgentData();
    }
  }

  saveProfile(): void {
    this.isSaving = true;
    
    // Simuler la sauvegarde
    setTimeout(() => {
      this.isEditMode = false;
      this.isSaving = false;
      alert('Profil mis à jour avec succès !');
    }, 1000);
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.initializeAgentData();
  }

  savePreferences(): void {
    this.isSavingPreferences = true;
    
    // Simuler la sauvegarde des préférences
    setTimeout(() => {
      localStorage.setItem('agentPreferences', JSON.stringify(this.preferences));
      this.isSavingPreferences = false;
      alert('Préférences sauvegardées !');
    }, 1000);
  }

  loadPreferences(): void {
    const saved = localStorage.getItem('agentPreferences');
    if (saved) {
      this.preferences = { ...this.preferences, ...JSON.parse(saved) };
    }
  }

  getAgentName(): string {
    // Simuler un nom d'agent
    return 'Jean Martin';
  }

  getAgentEmail(): string {
    return 'jean.martin@mairie15.paris.fr';
  }

  getMunicipality(): string {
    return 'Mairie du 15ème arrondissement';
  }

  getAgentPhone(): string {
    return '01 55 76 75 15';
  }

  getSpecialite(): string {
    return 'Gestion des réclamations et projets sociaux';
  }

  getMemberSince(): string {
    // Simuler une date d'embauche
    const memberSince = new Date();
    memberSince.setMonth(memberSince.getMonth() - 18); // Il y a 18 mois
    
    return memberSince.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  }

  getTotalReclamations(): number {
    return this.agentService.getReclamations().length;
  }

  getTauxResolution(): number {
    const total = this.agentService.getReclamations().length;
    const traitees = this.agentService.getReclamationsByStatut('traitee').length;
    return total > 0 ? Math.round((traitees / total) * 100) : 0;
  }

  getTotalProjets(): number {
    return this.agentService.getProjets().length;
  }

  getNoteSatisfaction(): number {
    // Simuler une note de satisfaction
    return 4.2;
  }

  getRecentReclamations(): ReclamationAgent[] {
    return this.agentService.getReclamations().slice(0, 5);
  }

  getActiveProjects(): ProjetAgent[] {
    return this.agentService.getProjets().filter(p => p.statut === 'actif');
  }

  getStatutLabel(statut: string): string {
    return this.agentService.getStatutLabel(statut);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  logout(): void {
    this.authService.logout();
  }
}