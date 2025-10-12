import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CitoyenService, Projet } from '../../../services/citoyen.service';

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css']
})
export class ProjetsComponent implements OnInit {
  projets: Projet[] = [];
  filteredProjects: Projet[] = [];
  statutFilter: string = '';

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

    this.loadProjects();
  }

  loadProjects(): void {
    this.projets = this.citoyenService.getProjets();
    this.filteredProjects = [...this.projets];
  }

  filterProjects(): void {
    if (!this.statutFilter) {
      this.filteredProjects = [...this.projets];
    } else {
      this.filteredProjects = this.projets.filter(projet => projet.statut === this.statutFilter);
    }
  }

  clearFilters(): void {
    this.statutFilter = '';
    this.filteredProjects = [...this.projets];
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'en_cours':
        return 'En cours';
      case 'planifie':
        return 'Planifié';
      case 'termine':
        return 'Terminé';
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