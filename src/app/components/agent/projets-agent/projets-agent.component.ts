import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/auth.service';
import { AgentService, ProjetAgent } from '../../../services/agent.service';

@Component({
  selector: 'app-projets-agent',
  templateUrl: './projets-agent.component.html',
  styleUrls: ['./projets-agent.component.css']
})
export class ProjetsAgentComponent implements OnInit {
  currentUser: User | null = null;
  projets: ProjetAgent[] = [];
  filteredProjects: ProjetAgent[] = [];
  statutFilter: string = '';
  
  showCreateForm = false;
  isSubmitting = false;
  
  newProject = {
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    budget: 0,
    responsable: ''
  };

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

    this.loadProjects();
  }

  loadProjects(): void {
    this.projets = this.agentService.getProjets();
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

  onSubmitProject(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simuler la création du projet
    setTimeout(() => {
      const nouveauProjet = this.agentService.ajouterProjet({
        titre: this.newProject.titre,
        description: this.newProject.description,
        dateCreation: new Date().toISOString().split('T')[0],
        dateDebut: this.newProject.dateDebut,
        dateFin: this.newProject.dateFin,
        statut: 'brouillon',
        budget: this.newProject.budget,
        responsable: this.newProject.responsable,
        participants: 0,
        arrondissement: this.currentUser?.commune || '15ème'
      });

      // Recharger les projets
      this.loadProjects();
      
      // Réinitialiser le formulaire
      this.resetNewProject();
      
      this.isSubmitting = false;
      
      alert('Projet créé avec succès !');
    }, 1000);
  }

  resetNewProject(): void {
    this.newProject = {
      titre: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      budget: 0,
      responsable: ''
    };
    this.showCreateForm = false;
  }

  cancelCreateProject(): void {
    this.resetNewProject();
  }

  viewProject(projet: ProjetAgent): void {
    alert(`Détails du projet: ${projet.titre}\nDescription: ${projet.description}\nBudget: ${projet.budget}€\nResponsable: ${projet.responsable}`);
  }

  editProject(projet: ProjetAgent): void {
    alert(`🚧 Fonctionnalité d'édition en cours de développement\nProjet: ${projet.titre}`);
  }

  updateProjectStatus(projetId: number, event: any): void {
    const nouveauStatut = event.target.value;
    if (nouveauStatut) {
      const success = this.agentService.mettreAJourStatutProjet(projetId, nouveauStatut as ProjetAgent['statut']);
      if (success) {
        this.loadProjects();
        alert('Statut du projet mis à jour avec succès !');
      }
      event.target.value = ''; // Reset select
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'brouillon':
        return 'Brouillon';
      case 'actif':
        return 'Actif';
      case 'termine':
        return 'Terminé';
      case 'suspendu':
        return 'Suspendu';
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