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
    console.log('=== INIT ReclamationsAgentComponent ===');
    
    // Vérifier que l'utilisateur est bien un agent
    this.currentUser = this.authService.getCurrentUser();
    console.log('Utilisateur récupéré:', this.currentUser);
    
    if (!this.currentUser || this.currentUser.role?.toLowerCase() !== 'agent') {
      console.error('Utilisateur non autorisé ou non connecté');
      console.error('Rôle actuel:', this.currentUser?.role);
      this.authService.logout();
      return;
    }

    console.log('Utilisateur autorisé, chargement des réclamations...');
    this.loadReclamations();
  }

  loadReclamations(): void {
    console.log('=== DÉBUT loadReclamations ===');
    console.log('currentUser:', this.currentUser);
    console.log('currentUser.id:', this.currentUser?.id);
    
    if (!this.currentUser || !this.currentUser.id) {
      console.error('Utilisateur non connecté ou ID manquant');
      console.log('Tentative de chargement de toutes les réclamations...');
      this.loadAllReclamations();
      return;
    }

    console.log('Tentative de chargement des réclamations pour l\'agent ID:', this.currentUser.id);
    
    // Essayer d'abord les réclamations assignées à l'agent
    this.agentService.getReclamationsByAgent(this.currentUser.id).subscribe({
      next: (response) => {
        console.log('Réponse des réclamations assignées:', response);
        this.reclamations = response.content;
        this.filteredReclamations = [...this.reclamations];
        console.log('Réclamations assignées à l\'agent:', this.reclamations);
        console.log('Nombre de réclamations assignées:', this.reclamations.length);
        
        // Vérifier la structure des réclamations
        if (this.reclamations.length > 0) {
          console.log('Structure de la première réclamation:', this.reclamations[0]);
          console.log('Citoyen de la première réclamation:', this.reclamations[0].citoyen);
        }
        
        // Si aucune réclamation assignée, charger toutes les réclamations
        if (this.reclamations.length === 0) {
          console.log('Aucune réclamation assignée, chargement de toutes les réclamations...');
          this.loadAllReclamations();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réclamations assignées:', error);
        console.log('Tentative de chargement de toutes les réclamations...');
        // En cas d'erreur, charger toutes les réclamations
        this.loadAllReclamations();
      }
    });
  }

  loadAllReclamations(): void {
    console.log('=== DÉBUT loadAllReclamations ===');
    console.log('Chargement de toutes les réclamations...');
    
    this.agentService.getReclamations().subscribe({
      next: (response) => {
        console.log('Réponse de toutes les réclamations:', response);
        this.reclamations = response.content;
        this.filteredReclamations = [...this.reclamations];
        console.log('Toutes les réclamations chargées:', this.reclamations);
        console.log('Nombre total de réclamations:', this.reclamations.length);
      },
      error: (error) => {
        console.error('Erreur lors du chargement de toutes les réclamations:', error);
        console.error('Détails de l\'erreur:', error);
        alert('Erreur lors du chargement des réclamations');
      }
    });
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

  // Méthode pour obtenir la classe CSS du statut
  getStatutClass(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'nouvelle':
        return 'statut-nouvelle';
      case 'en_cours':
        return 'statut-en-cours';
      case 'traitee':
        return 'statut-traitee';
      case 'rejetee':
        return 'statut-rejetee';
      default:
        return 'statut-default';
    }
  }

  // Méthode pour modifier le statut d'une réclamation
  updateStatut(reclamation: ReclamationAgent, newStatut: string, commentaires?: string): void {
    console.log('=== Mise à jour du statut ===');
    console.log('Réclamation ID:', reclamation.id);
    console.log('Nouveau statut:', newStatut);
    console.log('Commentaires:', commentaires);

    this.agentService.mettreAJourStatutReclamation(reclamation.id, newStatut, commentaires).subscribe({
      next: (updatedReclamation) => {
        console.log('Statut mis à jour avec succès:', updatedReclamation);
        
        // Mettre à jour la réclamation dans la liste
        const index = this.reclamations.findIndex(r => r.id === reclamation.id);
        if (index !== -1) {
          this.reclamations[index] = updatedReclamation;
          this.filteredReclamations = [...this.reclamations];
        }
        
        // Mettre à jour la réclamation sélectionnée si c'est la même
        if (this.selectedReclamation && this.selectedReclamation.id === reclamation.id) {
          this.selectedReclamation = updatedReclamation;
        }
        
        alert('Statut mis à jour avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
  }

  // Méthode pour obtenir les options de statut disponibles
  getStatutOptions(): Array<{value: string, label: string}> {
    return [
      { value: 'nouvelle', label: 'Nouvelle' },
      { value: 'en_cours', label: 'En cours' },
      { value: 'traitee', label: 'Traitée' },
      { value: 'rejetee', label: 'Rejetée' }
    ];
  }

  // Méthode pour mettre à jour le statut via le sélecteur
  updateReclamationStatus(reclamationId: number, event: any): void {
    const newStatut = event.target.value;
    if (!newStatut) return;

    console.log('=== Mise à jour du statut via sélecteur ===');
    console.log('Réclamation ID:', reclamationId);
    console.log('Nouveau statut:', newStatut);

    // Trouver la réclamation dans la liste
    const reclamation = this.reclamations.find(r => r.id === reclamationId);
    if (!reclamation) {
      console.error('Réclamation non trouvée');
      return;
    }

    this.agentService.mettreAJourStatutReclamation(reclamationId, newStatut).subscribe({
      next: (updatedReclamation) => {
        console.log('Statut mis à jour avec succès:', updatedReclamation);
        
        // Mettre à jour la réclamation dans la liste
        const index = this.reclamations.findIndex(r => r.id === reclamationId);
        if (index !== -1) {
          this.reclamations[index] = updatedReclamation;
          this.filteredReclamations = [...this.reclamations];
        }
        
        // Mettre à jour la réclamation sélectionnée si c'est la même
        if (this.selectedReclamation && this.selectedReclamation.id === reclamationId) {
          this.selectedReclamation = updatedReclamation;
        }
        
        // Réinitialiser le sélecteur
        event.target.value = '';
        
        alert('Statut mis à jour avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        alert('Erreur lors de la mise à jour du statut');
        // Réinitialiser le sélecteur en cas d'erreur
        event.target.value = '';
      }
    });
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
