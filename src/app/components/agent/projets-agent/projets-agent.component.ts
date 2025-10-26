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
    if (!this.currentUser || this.currentUser.role?.toLowerCase() !== 'agent') {
      console.log('Utilisateur non autorisé, redirection vers home');
      this.authService.logout();
      return;
    }

    this.loadProjects();
  }

  loadProjects(): void {
    console.log('Chargement des projets (agent)...');
    this.agentService.getProjets().subscribe({
      next: (response) => {
        console.log('Réponse des projets (agent):', response);
        console.log('Type de response:', typeof response);
        console.log('response.content:', response.content);
        console.log('Est un tableau:', Array.isArray(response.content));
        
        if (response && response.content && Array.isArray(response.content)) {
          this.projets = response.content;
          this.filteredProjects = [...this.projets];
          console.log('Projets chargés (agent):', this.projets.length);
        } else {
          console.error('Structure de réponse invalide (agent):', response);
          this.projets = [];
          this.filteredProjects = [];
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets (agent):', error);
        alert('Erreur lors du chargement des projets');
      }
    });
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
    
    // Créer le projet via l'API
    this.agentService.ajouterProjet({
      titre: this.newProject.titre,
      description: this.newProject.description,
      dateCreation: new Date().toISOString().split('T')[0],
      dateDebut: this.newProject.dateDebut,
      dateFin: this.newProject.dateFin,
      statut: 'brouillon',
      budget: this.newProject.budget,
      responsable: this.newProject.responsable,
      participants: 0,
      arrondissement: this.currentUser?.commune || '15ème',
      localisation: this.currentUser?.commune || '15ème arrondissement',
      objectifs: '',
      beneficiaires: ''
    }).subscribe({
      next: (nouveauProjet) => {
        console.log('Projet créé avec succès:', nouveauProjet);
        
        // Recharger les projets
        this.loadProjects();
        
        // Réinitialiser le formulaire
        this.resetNewProject();
        
        this.isSubmitting = false;
        this.showCreateForm = false;
        
        alert('Projet créé avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de la création du projet:', error);
        this.isSubmitting = false;
        alert('Erreur lors de la création du projet. Veuillez réessayer.');
      }
    });
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