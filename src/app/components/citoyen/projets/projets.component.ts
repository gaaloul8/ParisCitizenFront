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
  currentUser: any = null;
  
  // Variables pour le modal de détails du projet
  selectedProjet: Projet | null = null;
  participationLoading = false;
  
  // Variables pour le modal de détails du projet
  showProjectDetailsModal = false;
  
  // Variables pour gérer l'état de participation
  projetsParticipes: Set<number> = new Set(); // IDs des projets où le citoyen participe
  participationStates: Map<number, boolean> = new Map(); // État de participation par projet
  

  constructor(
    private authService: AuthService,
    private citoyenService: CitoyenService
  ) {}

  ngOnInit(): void {
    // Vérifier que l'utilisateur est bien un citoyen
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role?.toLowerCase() !== 'citoyen') {
      console.log('Utilisateur non autorisé, redirection vers home');
      this.authService.logout();
      return;
    }

    this.loadProjects();
  }

  loadProjects(): void {
    console.log('Chargement des projets...');
    this.citoyenService.getProjets().subscribe({
      next: (response) => {
        console.log('Réponse des projets:', response);
        console.log('Type de response:', typeof response);
        console.log('response.content:', response.content);
        console.log('Est un tableau:', Array.isArray(response.content));

        if (response && response.content && Array.isArray(response.content)) {
          this.projets = response.content;
          this.filteredProjects = [...this.projets];
          console.log('Projets chargés:', this.projets.length);
          console.log('Projets chargés avec IDs:', this.projets.map(p => p.id));
          
          // Charger l'état de participation pour chaque projet
          this.loadParticipationStates();
        } else {
          console.error('Structure de réponse invalide:', response);
          this.projets = [];
          this.filteredProjects = [];
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets:', error);
        alert('Erreur lors du chargement des projets');
      }
    });
  }

  loadParticipationStates(): void {
    if (!this.currentUser) {
      console.error('Utilisateur courant non disponible pour charger les états de participation');
      return;
    }
    
    console.log('Chargement des états de participation...');
    console.log('Utilisateur courant:', this.currentUser);
    console.log('ID utilisateur:', this.currentUser.id);
    
    // Charger tous les projets où le citoyen participe
    this.citoyenService.getProjetsParticipesByCitoyen(this.currentUser.id).subscribe({
      next: (projetIds: number[]) => {
        console.log('Projets où le citoyen participe:', projetIds);
        
        // Mettre à jour les états de participation
        this.projetsParticipes = new Set(projetIds);
        this.participationStates.clear();
        
        // Initialiser l'état pour chaque projet
        this.projets.forEach(projet => {
          const isParticipating = this.projetsParticipes.has(projet.id);
          this.participationStates.set(projet.id, isParticipating);
          console.log(`Projet ${projet.id} (${projet.titre}): ${isParticipating ? 'PARTICIPE' : 'NON PARTICIPE'}`);
        });
        
        console.log('États de participation chargés:', this.participationStates);
        
        // Forcer la détection des changements
        this.filteredProjects = [...this.filteredProjects];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des états de participation:', error);
        // En cas d'erreur, initialiser tous les projets comme non participés
        this.projets.forEach(projet => {
          this.participationStates.set(projet.id, false);
        });
        this.filteredProjects = [...this.filteredProjects];
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

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'ACTIF':
        return 'En cours';
      case 'PLANIFIE':
        return 'Planifié';
      case 'TERMINE':
        return 'Terminé';
      case 'BROUILLON':
        return 'Brouillon';
      default:
        return statut;
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }


  // Ouvrir le modal de détails du projet
  openProjectDetails(projet: Projet): void {
    this.selectedProjet = projet;
    this.showProjectDetailsModal = true;
  }

  // Fermer le modal de détails du projet
  closeProjectDetailsModal(): void {
    this.showProjectDetailsModal = false;
    this.selectedProjet = null;
  }

  logout(): void {
    this.authService.logout();
  }

  // Méthodes pour la participation directe
  participerDirectement(projet: Projet): void {
    if (!this.currentUser) return;
    
    this.participationLoading = true;
    
    // Appel API pour participer au projet
    this.citoyenService.participerAuProjet(projet.id, this.currentUser.id).subscribe({
      next: (response) => {
        console.log('Participation confirmée:', response);
        this.participationLoading = false;
        
        // Mettre à jour l'état local
        this.participationStates.set(projet.id, true);
        this.projetsParticipes.add(projet.id);
        
        this.loadProjects(); // Recharger les projets pour mettre à jour le nombre de participants
        alert('Votre participation au projet a été confirmée !');
      },
      error: (error) => {
        console.error('Erreur lors de la participation:', error);
        this.participationLoading = false;
        alert('Erreur lors de la participation au projet');
      }
    });
  }

  annulerParticipationDirectement(projet: Projet): void {
    if (!this.currentUser) return;
    
    if (confirm(`Voulez-vous annuler votre participation au projet "${projet.titre}" ?`)) {
      this.participationLoading = true;
      
      this.citoyenService.annulerParticipation(projet.id, this.currentUser.id).subscribe({
        next: (response) => {
          console.log('Participation annulée:', response);
          this.participationLoading = false;
          
          // Mettre à jour l'état local
          this.participationStates.set(projet.id, false);
          this.projetsParticipes.delete(projet.id);
          
          this.loadProjects(); // Recharger les projets
          alert('Votre participation au projet a été annulée');
        },
        error: (error) => {
          console.error('Erreur lors de l\'annulation:', error);
          this.participationLoading = false;
          alert('Erreur lors de l\'annulation de la participation');
        }
      });
    }
  }

  // Vérifier si un citoyen participe à un projet
  isParticipatingInProject(projetId: number): boolean {
    // Vérifier d'abord dans participationStates
    const stateParticipation = this.participationStates.get(projetId);
    if (stateParticipation !== undefined) {
      console.log(`Participation projet ${projetId} (via states): ${stateParticipation}`);
      return stateParticipation;
    }
    
    // Fallback: vérifier dans projetsParticipes
    const setParticipation = this.projetsParticipes.has(projetId);
    console.log(`Participation projet ${projetId} (via set): ${setParticipation}`);
    console.log('États de participation actuels:', Array.from(this.participationStates.entries()));
    console.log('Projets participés:', Array.from(this.projetsParticipes));
    
    return setParticipation;
  }
}