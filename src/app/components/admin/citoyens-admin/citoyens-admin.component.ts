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

    this.loadCitoyens();
  }

  loadCitoyens(): void {
    this.citoyens = this.adminService.getCitoyens();
    this.filteredCitoyens = [...this.citoyens];
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
    alert(`Détails de ${citoyen.prenom} ${citoyen.nom}\nÂge: ${citoyen.age} ans\nCommune: ${citoyen.commune}\nEmail: ${citoyen.email}\nDate inscription: ${this.formatDate(citoyen.dateInscription)}\nRéclamations: ${citoyen.nombreReclamations}\nProjets participés: ${citoyen.nombreProjetsParticipes}\nDernière activité: ${this.formatDate(citoyen.derniereActivite)}`);
  }

  editCitoyen(citoyen: CitoyenAdmin): void {
    alert(`🚧 Fonctionnalité d'édition en cours de développement\nCitoyen: ${citoyen.prenom} ${citoyen.nom}`);
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