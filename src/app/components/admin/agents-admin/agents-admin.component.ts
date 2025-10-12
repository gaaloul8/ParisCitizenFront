import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/auth.service';
import { AdminService, AgentMunicipal } from '../../../services/admin.service';

@Component({
  selector: 'app-agents-admin',
  templateUrl: './agents-admin.component.html',
  styleUrls: ['./agents-admin.component.css']
})
export class AgentsAdminComponent implements OnInit {
  currentUser: User | null = null;
  agents: AgentMunicipal[] = [];
  filteredAgents: AgentMunicipal[] = [];
  municipaliteFilter: string = '';
  statutFilter: string = '';

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    // Vérifier que l'utilisateur est bien un admin
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.authService.logout();
      return;
    }

    this.loadAgents();
  }

  loadAgents(): void {
    this.agents = this.adminService.getAgents();
    this.filteredAgents = [...this.agents];
  }

  filterAgents(): void {
    let filtered = [...this.agents];

    if (this.municipaliteFilter) {
      filtered = filtered.filter(agent => agent.municipalite === this.municipaliteFilter);
    }

    if (this.statutFilter) {
      filtered = filtered.filter(agent => agent.statut === this.statutFilter);
    }

    this.filteredAgents = filtered;
  }

  clearFilters(): void {
    this.municipaliteFilter = '';
    this.statutFilter = '';
    this.filteredAgents = [...this.agents];
  }

  getTotalAgents(): number {
    return this.agents.length;
  }

  getAgentsActifs(): number {
    return this.agents.filter(a => a.statut === 'actif').length;
  }

  getAgentsInactifs(): number {
    return this.agents.filter(a => a.statut === 'inactif').length;
  }

  viewAgent(agent: AgentMunicipal): void {
    alert(`Détails de ${agent.prenom} ${agent.nom}\nMunicipalité: ${agent.municipalite}\nPoste: ${agent.poste}\nEmail: ${agent.email}\nTéléphone: ${agent.telephone}\nDate embauche: ${this.formatDate(agent.dateEmbauche)}\nRéclamations traitées: ${agent.nombreReclamationsTraitees}\nNote satisfaction: ${agent.noteSatisfaction}/5`);
  }

  editAgent(agent: AgentMunicipal): void {
    alert(`🚧 Fonctionnalité d'édition en cours de développement\nAgent: ${agent.prenom} ${agent.nom}`);
  }

  updateAgentStatus(agentId: number, event: any): void {
    const nouveauStatut = event.target.value;
    if (nouveauStatut) {
      const agent = this.agents.find(a => a.id === agentId);
      if (agent) {
        agent.statut = nouveauStatut as AgentMunicipal['statut'];
        this.loadAgents();
        alert(`Statut de ${agent.prenom} ${agent.nom} mis à jour vers: ${this.getStatutLabel(nouveauStatut)}`);
      }
      event.target.value = ''; // Reset select
    }
  }

  getStars(note: number): string[] {
    const stars = [];
    const fullStars = Math.floor(note);
    const hasHalfStar = note % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if (hasHalfStar) {
      stars.push('☆');
    }
    
    // Compléter jusqu'à 5 étoiles
    while (stars.length < 5) {
      stars.push('☆');
    }
    
    return stars;
  }

  getStatutLabel(statut: string): string {
    return this.adminService.getStatutLabel(statut);
  }

  formatDate(dateString: string): string {
    return this.adminService.formatDate(dateString);
  }

  logout(): void {
    this.authService.logout();
  }
}