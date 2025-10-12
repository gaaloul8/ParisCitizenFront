import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CitoyenService, Etablissement } from '../../../services/citoyen.service';

@Component({
  selector: 'app-etablissements',
  templateUrl: './etablissements.component.html',
  styleUrls: ['./etablissements.component.css']
})
export class EtablissementsComponent implements OnInit {
  etablissements: Etablissement[] = [];
  filteredEtablissements: Etablissement[] = [];
  typeFilter: string = '';

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

    this.loadEtablissements();
  }

  loadEtablissements(): void {
    this.etablissements = this.citoyenService.getEtablissements();
    this.filteredEtablissements = [...this.etablissements];
  }

  filterEtablissements(): void {
    if (!this.typeFilter) {
      this.filteredEtablissements = [...this.etablissements];
    } else {
      this.filteredEtablissements = this.etablissements.filter(etablissement => etablissement.type === this.typeFilter);
    }
  }

  clearFilters(): void {
    this.typeFilter = '';
    this.filteredEtablissements = [...this.etablissements];
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'ecole':
        return 'École';
      case 'hopital':
        return 'Hôpital';
      case 'mairie':
        return 'Mairie';
      case 'association':
        return 'Association';
      case 'culturel':
        return 'Établissement culturel';
      case 'sportif':
        return 'Établissement sportif';
      case 'social':
        return 'Établissement social';
      default:
        return type;
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'ecole':
        return '🏫';
      case 'hopital':
        return '🏥';
      case 'mairie':
        return '🏛️';
      case 'association':
        return '🤝';
      case 'culturel':
        return '🎭';
      case 'sportif':
        return '⚽';
      case 'social':
        return '🏠';
      default:
        return '📍';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}