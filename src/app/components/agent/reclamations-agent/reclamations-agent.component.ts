import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/auth.service';
import { AgentService, ReclamationAgent } from '../../../services/agent.service';

@Component({
  selector: 'app-reclamations-agent',
  templateUrl: './reclamations-agent.component.html',
  styleUrls: ['./reclamations-agent.component.css']
})
export class ReclamationsAgentComponent implements OnInit {
  currentUser: User | null = null;
  reclamations: ReclamationAgent[] = [];
  filteredReclamations: ReclamationAgent[] = [];
  statutFilter: string = '';
  prioriteFilter: string = '';
  selectedReclamation: ReclamationAgent | null = null;

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

    this.loadReclamations();
  }

  loadReclamations(): void {
    this.reclamations = this.agentService.getReclamations();
    this.filteredReclamations = [...this.reclamations];
  }

  filterReclamations(): void {
    let filtered = [...this.reclamations];

    if (this.statutFilter) {
      filtered = filtered.filter(reclamation => reclamation.statut === this.statutFilter);
    }

    if (this.prioriteFilter) {
      filtered = filtered.filter(reclamation => reclamation.priorite === this.prioriteFilter);
    }

    this.filteredReclamations = filtered;
  }

  clearFilters(): void {
    this.statutFilter = '';
    this.prioriteFilter = '';
    this.filteredReclamations = [...this.reclamations];
  }

  viewReclamation(reclamation: ReclamationAgent): void {
    this.selectedReclamation = reclamation;
  }

  closeModal(): void {
    this.selectedReclamation = null;
  }

  markAsTreated(reclamationId: number): void {
    const success = this.agentService.traiterReclamation(
      reclamationId, 
      'Réclamation traitée avec succès'
    );
    
    if (success) {
      this.loadReclamations();
      if (this.selectedReclamation && this.selectedReclamation.id === reclamationId) {
        this.selectedReclamation.statut = 'traitee';
        this.selectedReclamation.dateTraitement = new Date().toISOString().split('T')[0];
        this.selectedReclamation.commentaires = 'Réclamation traitée avec succès';
      }
      alert('Réclamation marquée comme traitée !');
    }
  }

  updateReclamationStatus(reclamationId: number, event: any): void {
    const nouveauStatut = event.target.value;
    if (nouveauStatut) {
      const success = this.agentService.mettreAJourStatutReclamation(
        reclamationId, 
        nouveauStatut as ReclamationAgent['statut']
      );
      
      if (success) {
        this.loadReclamations();
        if (this.selectedReclamation && this.selectedReclamation.id === reclamationId) {
          this.selectedReclamation.statut = nouveauStatut as ReclamationAgent['statut'];
          if (nouveauStatut === 'traitee') {
            this.selectedReclamation.dateTraitement = new Date().toISOString().split('T')[0];
          }
        }
        alert('Statut de la réclamation mis à jour !');
      }
      event.target.value = ''; // Reset select
    }
  }

  getNouvellesReclamations(): number {
    return this.reclamations.filter(r => r.statut === 'nouvelle').length;
  }

  getEnCoursReclamations(): number {
    return this.reclamations.filter(r => r.statut === 'en_cours').length;
  }

  getTraiteesReclamations(): number {
    return this.reclamations.filter(r => r.statut === 'traitee').length;
  }

  getTypeLabel(type: string): string {
    return this.agentService.getTypeLabel(type);
  }

  getStatutLabel(statut: string): string {
    return this.agentService.getStatutLabel(statut);
  }

  getPrioriteLabel(priorite: string): string {
    return this.agentService.getPrioriteLabel(priorite);
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