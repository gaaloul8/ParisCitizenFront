import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/auth.service';
import { AdminService, CitoyenAdmin } from '../../../services/admin.service';

@Component({
  selector: 'app-citoyens-admin',
  templateUrl: './citoyens-admin.component.html',
  styleUrls: ['./citoyens-admin.component.css']
})
export class CitoyensAdminComponent implements OnInit {
  currentUser: User | null = null;
  citoyens: CitoyenAdmin[] = [];
  filteredCitoyens: CitoyenAdmin[] = [];
  communeFilter: string = '';
  statutFilter: string = '';
  
  // Modal properties
  showModal: boolean = false;
  selectedCitoyen: CitoyenAdmin | null = null;
  showEditModal: boolean = false;
  editingCitoyen: CitoyenAdmin | null = null;

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

    this.loadCitoyens();
  }

  loadCitoyens(): void {
    console.log('Chargement des citoyens (admin)...');
    this.adminService.getCitoyens().subscribe({
      next: (response) => {
        console.log('Réponse des citoyens (admin):', response);
        console.log('Type de response:', typeof response);
        console.log('response.content:', response.content);
        console.log('Est un tableau:', Array.isArray(response.content));

        if (response && response.content && Array.isArray(response.content)) {
          this.citoyens = response.content;
          this.filteredCitoyens = [...this.citoyens];
          console.log('Citoyens chargés (admin):', this.citoyens.length);
        } else {
          console.error('Structure de réponse invalide (admin citoyens):', response);
          this.citoyens = [];
          this.filteredCitoyens = [];
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des citoyens (admin):', error);
        alert('Erreur lors du chargement des citoyens');
      }
    });
  }

  filterCitoyens(): void {
    let filtered = [...this.citoyens];

    if (this.communeFilter) {
      filtered = filtered.filter(citoyen => citoyen.commune === this.communeFilter);
    }

    if (this.statutFilter) {
      filtered = filtered.filter(citoyen => citoyen.statut === this.statutFilter);
    }

    this.filteredCitoyens = filtered;
  }

  clearFilters(): void {
    this.communeFilter = '';
    this.statutFilter = '';
    this.filteredCitoyens = [...this.citoyens];
  }

  getTotalCitoyens(): number {
    return this.citoyens.length;
  }

  getCitoyensActifs(): number {
    return this.citoyens.filter(c => c.statut === 'actif').length;
  }

  getMoyenneAge(): number {
    const totalAge = this.citoyens.reduce((sum, c) => sum + c.age, 0);
    return Math.round(totalAge / this.citoyens.length);
  }

  getBadgeClass(nombre: number): string {
    if (nombre === 0) return 'zero';
    if (nombre <= 2) return 'low';
    if (nombre <= 5) return 'medium';
    return 'high';
  }

  viewCitoyen(citoyen: CitoyenAdmin): void {
    this.selectedCitoyen = citoyen;
    this.showModal = true;
  }

  editCitoyen(citoyen: CitoyenAdmin): void {
    console.log('Citoyen à modifier:', citoyen);
    this.editingCitoyen = { ...citoyen }; // Créer une copie profonde
    this.showEditModal = true;
    console.log('Citoyen copié:', this.editingCitoyen);
  }

  updateCitoyenStatus(citoyenId: number, event: any): void {
    const nouveauStatut = event.target.value;
    if (nouveauStatut) {
      const citoyen = this.citoyens.find(c => c.id === citoyenId);
      if (citoyen) {
        citoyen.statut = nouveauStatut as CitoyenAdmin['statut'];
        this.loadCitoyens();
        alert(`Statut de ${citoyen.prenom} ${citoyen.nom} mis à jour vers: ${this.getStatutLabel(nouveauStatut)}`);
      }
      event.target.value = ''; // Reset select
    }
  }

  supprimerCitoyen(citoyen: CitoyenAdmin): void {
    const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer définitivement le citoyen ${citoyen.prenom} ${citoyen.nom} ?\n\nCette action est irréversible et supprimera toutes les données associées.`);
    
    if (confirmation) {
      this.adminService.supprimerCitoyen(citoyen.id).subscribe({
        next: (response) => {
          console.log('Citoyen supprimé:', response);
          alert(`Le citoyen ${citoyen.prenom} ${citoyen.nom} a été supprimé avec succès.`);
          this.loadCitoyens(); // Recharger la liste
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du citoyen:', error);
          let errorMessage = 'Erreur lors de la suppression du citoyen. Veuillez réessayer.';
          
          if (error.status === 500) {
            errorMessage = 'Impossible de supprimer ce citoyen car il est lié à des projets ou réclamations. Veuillez d\'abord supprimer ses projets ou réclamations.';
          } else if (error.status === 404) {
            errorMessage = 'Citoyen non trouvé.';
          } else if (error.status === 403) {
            errorMessage = 'Vous n\'avez pas les permissions pour supprimer ce citoyen.';
          }
          
          alert(errorMessage);
        }
      });
    }
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

  // Modal methods
  closeModal(): void {
    this.showModal = false;
    this.selectedCitoyen = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingCitoyen = null;
  }

  onSaveCitoyenChanges(event: {type: string, data: any}): void {
    console.log('Sauvegarde des modifications:', event);
    
    // Simuler la sauvegarde
    setTimeout(() => {
      const index = this.citoyens.findIndex(c => c.id === event.data.id);
      if (index !== -1) {
        this.citoyens[index] = { ...this.citoyens[index], ...event.data };
      }
      
      this.closeEditModal();
      alert('Citoyen modifié avec succès !');
    }, 1000);
  }
}
