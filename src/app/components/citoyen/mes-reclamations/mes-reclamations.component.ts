import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CitoyenService, Reclamation } from '../../../services/citoyen.service';

@Component({
  selector: 'app-mes-reclamations',
  templateUrl: './mes-reclamations.component.html',
  styleUrls: ['./mes-reclamations.component.css']
})
export class MesReclamationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  statutFilter: string = '';
  currentUser: any = null;
  selectedReclamation: Reclamation | null = null;
  
  showNewReclamationForm = false;
  isSubmitting = false;
  
  newReclamation = {
    sujet: '',
    type: '',
    localisation: '',
    description: '',
    priorite: 'moyenne'
  };

  constructor(
    private authService: AuthService,
    private citoyenService: CitoyenService
  ) {}

  ngOnInit(): void {
    // Vérifier que l'utilisateur est bien un citoyen
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role?.toLowerCase() !== 'citoyen') {
      console.error('Utilisateur non autorisé ou non connecté');
      this.authService.logout();
      return;
    }

    this.loadReclamations();
  }

  loadReclamations(): void {
    if (!this.currentUser) {
      console.error('Utilisateur non disponible pour charger les réclamations');
      return;
    }

    console.log('Chargement des réclamations pour le citoyen:', this.currentUser.id);
    
    this.citoyenService.getReclamationsByCitoyen(this.currentUser.id).subscribe({
      next: (response) => {
        console.log('Réclamations chargées:', response);
        this.reclamations = response.content || [];
        this.filteredReclamations = [...this.reclamations];
        console.log('Nombre de réclamations:', this.reclamations.length);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réclamations:', error);
        alert('Erreur lors du chargement des réclamations');
      }
    });
  }

  filterReclamations(): void {
    if (!this.statutFilter) {
      this.filteredReclamations = [...this.reclamations];
    } else {
      this.filteredReclamations = this.reclamations.filter(
        reclamation => reclamation.statut === this.statutFilter
      );
    }
  }

  clearFilters(): void {
    this.statutFilter = '';
    this.filteredReclamations = [...this.reclamations];
  }

  toggleNewReclamationForm(): void {
    this.showNewReclamationForm = !this.showNewReclamationForm;
    if (!this.showNewReclamationForm) {
      this.resetNewReclamation();
    }
  }

  resetNewReclamation(): void {
    this.newReclamation = {
      sujet: '',
      type: '',
      localisation: '',
      description: '',
      priorite: 'moyenne'
    };
  }

  submitNewReclamation(): void {
    if (!this.newReclamation.sujet || !this.newReclamation.type || !this.newReclamation.localisation || !this.newReclamation.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isSubmitting = true;
    
    const reclamationData = {
      ...this.newReclamation,
      citoyenId: this.currentUser.id
    };

    this.citoyenService.ajouterReclamation(reclamationData).subscribe({
      next: (response) => {
        console.log('Réclamation ajoutée:', response);
        alert('Réclamation ajoutée avec succès !');
        this.resetNewReclamation();
        this.showNewReclamationForm = false;
        this.loadReclamations(); // Recharger la liste
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de la réclamation:', error);
        alert('Erreur lors de l\'ajout de la réclamation');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  cancelNewReclamation(): void {
    this.resetNewReclamation();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Méthode pour afficher le détail d'une réclamation
  viewReclamation(reclamation: Reclamation): void {
    this.selectedReclamation = reclamation;
  }

  // Méthode pour fermer le modal
  closeModal(): void {
    this.selectedReclamation = null;
  }

  // Méthode pour obtenir la classe CSS du statut
  getStatutClass(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'nouvelle':
      case 'en_attente':
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

  // Méthode pour obtenir le label du statut
  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'nouvelle':
      case 'en_attente':
        return 'En attente';
      case 'en_cours':
        return 'En cours';
      case 'traitee':
        return 'Traitée';
      case 'rejetee':
        return 'Rejetée';
      default:
        return statut;
    }
  }

  // Méthode pour obtenir le label du type
  getTypeLabel(type: string): string {
    switch (type) {
      case 'voirie':
        return 'Voirie';
      case 'eclairage':
        return 'Éclairage';
      case 'dechets':
        return 'Déchets';
      case 'espaces_verts':
        return 'Espaces verts';
      case 'transport':
        return 'Transport';
      case 'autre':
        return 'Autre';
      default:
        return type;
    }
  }

  // Méthode pour obtenir le label de la priorité
  getPrioriteLabel(priorite: string): string {
    switch (priorite) {
      case 'basse':
        return 'Basse';
      case 'moyenne':
        return 'Moyenne';
      case 'haute':
        return 'Haute';
      case 'urgente':
        return 'Urgente';
      default:
        return priorite;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}