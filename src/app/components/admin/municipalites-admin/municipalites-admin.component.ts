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
  
  showAddForm = false;
  isSubmitting = false;
  
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
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.authService.logout();
      return;
    }

    this.loadMunicipalites();
  }

  loadMunicipalites(): void {
    this.municipalites = this.adminService.getMunicipalites();
  }

  onSubmitMunicipalite(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simuler l'ajout de la municipalité
    setTimeout(() => {
      const nouvelleMunicipalite = this.adminService.ajouterMunicipalite({
        nom: this.newMunicipalite.nom,
        region: this.newMunicipalite.region,
        codePostal: this.newMunicipalite.codePostal,
        nombreAgents: 0,
        nombreCitoyens: 0,
        nombreProjets: 0,
        tauxSatisfaction: 85,
        budgetAnnuel: this.newMunicipalite.budgetAnnuel,
        dateCreation: new Date().toISOString().split('T')[0],
        statut: 'active'
      });

      // Recharger les municipalités
      this.loadMunicipalites();
      
      // Réinitialiser le formulaire
      this.resetNewMunicipalite();
      
      this.isSubmitting = false;
      
      alert('Municipalité ajoutée avec succès !');
    }, 1000);
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
    alert(`Détails de ${municipalite.nom}\nRégion: ${municipalite.region}\nCode Postal: ${municipalite.codePostal}\nBudget: ${this.formatCurrency(municipalite.budgetAnnuel)}\nAgents: ${municipalite.nombreAgents}\nCitoyens: ${municipalite.nombreCitoyens}\nProjets: ${municipalite.nombreProjets}\nSatisfaction: ${municipalite.tauxSatisfaction}%`);
  }

  editMunicipalite(municipalite: Municipalite): void {
    alert(`🚧 Fonctionnalité d'édition en cours de développement\nMunicipalité: ${municipalite.nom}`);
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

  getStatutLabel(statut: string): string {
    return this.adminService.getStatutLabel(statut);
  }

  formatCurrency(amount: number): string {
    return this.adminService.formatCurrency(amount);
  }

  logout(): void {
    this.authService.logout();
  }
}