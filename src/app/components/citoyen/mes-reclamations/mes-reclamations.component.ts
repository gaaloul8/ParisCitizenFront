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
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'citoyen') {
      this.authService.logout();
      return;
    }

    this.loadReclamations();
  }

  loadReclamations(): void {
    this.reclamations = this.citoyenService.getReclamations();
    this.filteredReclamations = [...this.reclamations];
  }

  filterReclamations(): void {
    if (!this.statutFilter) {
      this.filteredReclamations = [...this.reclamations];
    } else {
      this.filteredReclamations = this.reclamations.filter(reclamation => reclamation.statut === this.statutFilter);
    }
  }

  clearFilters(): void {
    this.statutFilter = '';
    this.filteredReclamations = [...this.reclamations];
  }

  onSubmitReclamation(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simuler l'envoi de la réclamation
    setTimeout(() => {
      const currentUser = this.authService.getCurrentUser();
      
      const nouvelleReclamation = this.citoyenService.ajouterReclamation({
        sujet: this.newReclamation.sujet,
        description: this.newReclamation.description,
        dateCreation: new Date().toISOString().split('T')[0],
        statut: 'en_attente',
        priorite: this.newReclamation.priorite as 'basse' | 'moyenne' | 'haute',
        arrondissement: currentUser?.commune || '15ème',
        localisation: this.newReclamation.localisation,
        type: this.newReclamation.type as 'voirie' | 'eclairage' | 'dechets' | 'espaces_verts' | 'transport' | 'autre'
      });

      // Recharger les réclamations
      this.loadReclamations();
      
      // Réinitialiser le formulaire
      this.resetNewReclamation();
      
      this.isSubmitting = false;
      
      alert('Réclamation envoyée avec succès !');
    }, 1000);
  }

  resetNewReclamation(): void {
    this.newReclamation = {
      sujet: '',
      type: '',
      localisation: '',
      description: '',
      priorite: 'moyenne'
    };
    this.showNewReclamationForm = false;
  }

  cancelNewReclamation(): void {
    this.resetNewReclamation();
  }

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

  getStatutLabel(statut: string): string {
    switch (statut) {
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