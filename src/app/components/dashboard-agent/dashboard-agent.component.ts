import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { AgentService, StatistiquesAgent } from '../../services/agent.service';

@Component({
  selector: 'app-dashboard-agent',
  templateUrl: './dashboard-agent.component.html',
  styleUrls: ['./dashboard-agent.component.css']
})
export class DashboardAgentComponent implements OnInit {
  currentUser: User | null = null;
  statistiques: StatistiquesAgent | null = null;
  showCreateProject = false;
  reclamations: any[] = [];

  constructor(
    private authService: AuthService,
    private agentService: AgentService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Vérifier que l'utilisateur est bien un agent
    if (!this.currentUser || this.currentUser.role?.toLowerCase() !== 'agent') {
      // Rediriger vers la page de connexion si pas d'agent
      this.authService.logout();
      return;
    }

    this.loadStatistiques();
    this.loadReclamations();
  }

  loadStatistiques(): void {
    this.agentService.getStatistiques().subscribe({
      next: (response) => {
        this.statistiques = response;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        alert('Erreur lors du chargement des statistiques');
      }
    });
  }

  loadReclamations(): void {
    this.agentService.getReclamations().subscribe({
      next: (response) => {
        this.reclamations = response.content;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réclamations:', error);
      }
    });
  }

  getTauxTraitement(): number {
    if (!this.statistiques || this.statistiques.reclamationsRecues === 0) {
      return 0;
    }
    return Math.round((this.statistiques.reclamationsTraitees / this.statistiques.reclamationsRecues) * 100);
  }

  getNouvellesReclamations(): number {
    return this.reclamations.filter(r => r.statut === 'nouvelle').length;
  }

  getBarHeight(value: number): number {
    // Normaliser la valeur pour l'affichage (max 100%)
    const maxValue = 20; // Valeur maximale pour normaliser
    return Math.min((value / maxValue) * 100, 100);
  }

  logout(): void {
    this.authService.logout();
  }
}
