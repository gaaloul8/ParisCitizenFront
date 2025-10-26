import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/auth.service';
import { AdminService, Municipalite } from '../../../services/admin.service';

@Component({
  selector: 'app-municipalites-admin',
  templateUrl: './municipalites-admin.component.html',
  styleUrls: ['./municipalites-admin.component.css']
})
export class MunicipalitesAdminComponent implements OnInit {
  currentUser: User | null = null;
  municipalites: Municipalite[] = [];
  filteredMunicipalites: Municipalite[] = [];
  
  showAddForm = false;
  isSubmitting = false;
  
  // Modal properties
  showModal: boolean = false;
  selectedMunicipalite: Municipalite | null = null;
  showEditModal: boolean = false;
  editingMunicipalite: Municipalite | null = null;
  
  newMunicipalite = {
    nom: '',
    region: '',
    codePostal: '',
    budgetAnnuel: 0
  };

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    // Vérifier que l'utilisateur est bien un admin
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role?.toLowerCase() !== 'admin') {
      this.authService.logout();
      return;
    }

    this.loadMunicipalites();
  }

  loadMunicipalites(): void {
    console.log('Chargement des municipalités (admin)...');
    this.adminService.getMunicipalites().subscribe({
      next: (response) => {
        console.log('Réponse des municipalités (admin):', response);
        console.log('Type de response:', typeof response);
        console.log('response.content:', response.content);
        console.log('Est un tableau:', Array.isArray(response.content));

        if (response && response.content && Array.isArray(response.content)) {
          this.municipalites = response.content;
          this.filteredMunicipalites = [...this.municipalites];
          console.log('Municipalités chargées (admin):', this.municipalites.length);
        } else {
          console.error('Structure de réponse invalide (admin municipalités):', response);
          this.municipalites = [];
          this.filteredMunicipalites = [];
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des municipalités (admin):', error);
        alert('Erreur lors du chargement des municipalités');
      }
    });
  }

  onSubmitMunicipalite(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Appel réel à l'API pour ajouter la municipalité
    this.adminService.ajouterMunicipalite({
      nom: this.newMunicipalite.nom,
      region: this.newMunicipalite.region,
      codePostal: this.newMunicipalite.codePostal,
      budgetAnnuel: this.newMunicipalite.budgetAnnuel,
      adresse: '',
      telephone: '',
      email: '',
      siteWeb: ''
    }).subscribe({
      next: (response) => {
        console.log('Municipalité ajoutée:', response);
        
        // Recharger les municipalités
        this.loadMunicipalites();
        
        // Réinitialiser le formulaire
        this.resetNewMunicipalite();
        
        // Fermer le formulaire
        this.showAddForm = false;
        
        this.isSubmitting = false;
        
        alert('Municipalité ajoutée avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de la municipalité:', error);
        this.isSubmitting = false;
        
        let errorMessage = 'Erreur lors de l\'ajout de la municipalité. Veuillez réessayer.';
        
        if (error.status === 400) {
          errorMessage = 'Données invalides. Vérifiez les informations saisies.';
        } else if (error.status === 409) {
          errorMessage = 'Une municipalité avec ce nom existe déjà.';
        } else if (error.status === 403) {
          errorMessage = 'Vous n\'avez pas les permissions pour ajouter une municipalité.';
        }
        
        alert(errorMessage);
      }
    });
  }

  resetNewMunicipalite(): void {
    this.newMunicipalite = {
      nom: '',
      region: '',
      codePostal: '',
      budgetAnnuel: 0
    };
    this.showAddForm = false;
  }

  cancelAddMunicipalite(): void {
    this.resetNewMunicipalite();
  }

  viewMunicipalite(municipalite: Municipalite): void {
    this.selectedMunicipalite = municipalite;
    this.showModal = true;
  }

  editMunicipalite(municipalite: Municipalite): void {
    console.log('Municipalité à modifier:', municipalite);
    this.editingMunicipalite = { ...municipalite }; // Créer une copie profonde
    this.showEditModal = true;
    console.log('Municipalité copiée:', this.editingMunicipalite);
  }

  updateMunicipaliteStatus(municipaliteId: number, event: any): void {
    const nouveauStatut = event.target.value;
    if (nouveauStatut) {
      // Simuler la mise à jour du statut
      const municipalite = this.municipalites.find(m => m.id === municipaliteId);
      if (municipalite) {
        municipalite.statut = nouveauStatut as Municipalite['statut'];
        alert(`Statut de ${municipalite.nom} mis à jour vers: ${this.getStatutLabel(nouveauStatut)}`);
      }
      event.target.value = ''; // Reset select
    }
  }

  supprimerMunicipalite(municipalite: Municipalite): void {
    const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer définitivement la municipalité ${municipalite.nom} ?\n\nCette action est irréversible et supprimera toutes les données associées (agents, citoyens, projets).`);
    
    if (confirmation) {
      this.adminService.supprimerMunicipalite(municipalite.id).subscribe({
        next: (response) => {
          console.log('Municipalité supprimée:', response);
          alert(`La municipalité ${municipalite.nom} a été supprimée avec succès.`);
          this.loadMunicipalites(); // Recharger la liste
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la municipalité:', error);
          let errorMessage = 'Erreur lors de la suppression de la municipalité. Veuillez réessayer.';
          
          if (error.status === 500) {
            errorMessage = 'Impossible de supprimer cette municipalité car elle contient encore des citoyens, agents ou projets. Veuillez d\'abord supprimer tous les éléments associés.';
          } else if (error.status === 404) {
            errorMessage = 'Municipalité non trouvée.';
          } else if (error.status === 403) {
            errorMessage = 'Vous n\'avez pas les permissions pour supprimer cette municipalité.';
          }
          
          alert(errorMessage);
        }
      });
    }
  }

  getStatutLabel(statut: string): string {
    return this.adminService.getStatutLabel(statut);
  }

  formatCurrency(amount: number): string {
    return this.adminService.formatCurrency(amount);
  }

  logout(): void {
    this.authService.logout();
  }

  // Modal methods
  closeModal(): void {
    this.showModal = false;
    this.selectedMunicipalite = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingMunicipalite = null;
  }

  onSaveMunicipaliteChanges(event: {type: string, data: any}): void {
    console.log('Sauvegarde des modifications:', event);
    
    this.isSubmitting = true;
    
    setTimeout(() => {
      const index = this.municipalites.findIndex(m => m.id === event.data.id);
      if (index !== -1) {
        this.municipalites[index] = { ...this.municipalites[index], ...event.data };
      }
      
      this.isSubmitting = false;
      this.closeEditModal();
      alert('Municipalité modifiée avec succès !');
    }, 1000);
  }
}
