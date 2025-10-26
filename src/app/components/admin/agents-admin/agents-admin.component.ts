import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/auth.service';
import { AdminService, AgentMunicipal } from '../../../services/admin.service';

@Component({
  selector: 'app-agents-admin',
  templateUrl: './agents-admin.component.html',
  styleUrls: ['./agents-admin.component.css']
})
export class AgentsAdminComponent implements OnInit {
  currentUser: User | null = null;
  agents: AgentMunicipal[] = [];
  
  // Modal properties
  showModal: boolean = false;
  selectedAgent: AgentMunicipal | null = null;
  showEditModal: boolean = false;
  editingAgent: AgentMunicipal | null = null;
  
  // Formulaire d'ajout
  showAddForm = false;
  isSubmitting = false;
  
  newAgent = {
    username: '',
    password: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    municipaliteId: 0,
    poste: ''
  };
  
  municipalites: any[] = [];

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

    this.loadAgents();
    this.loadMunicipalites();
  }

  loadAgents(): void {
    console.log('Chargement des agents (admin)...');
    this.adminService.getAgents().subscribe({
      next: (response) => {
        console.log('Réponse des agents (admin):', response);
        console.log('Type de response:', typeof response);
        console.log('response.content:', response.content);
        console.log('Est un tableau:', Array.isArray(response.content));

        if (response && response.content && Array.isArray(response.content)) {
          this.agents = response.content;
          console.log('Agents chargés (admin):', this.agents.length);
        } else {
          console.error('Structure de réponse invalide (admin agents):', response);
          this.agents = [];
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des agents (admin):', error);
        alert('Erreur lors du chargement des agents');
      }
    });
  }

  loadMunicipalites(): void {
    this.adminService.getMunicipalitesForAgents().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.municipalites = response;
        } else if (response && response.content && Array.isArray(response.content)) {
          this.municipalites = response.content;
        } else {
          this.municipalites = [];
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des municipalités:', error);
        this.municipalites = [];
      }
    });
  }

  onSubmitAgent(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Appel réel à l'API pour ajouter l'agent
    this.adminService.ajouterAgent({
      username: this.newAgent.username,
      password: this.newAgent.password,
      nom: this.newAgent.nom,
      prenom: this.newAgent.prenom,
      email: this.newAgent.email,
      telephone: this.newAgent.telephone,
      municipaliteId: this.newAgent.municipaliteId,
      poste: this.newAgent.poste
    }).subscribe({
      next: (response: any) => {
        console.log('Agent ajouté:', response);
        
        // Recharger les agents
        this.loadAgents();
        
        // Réinitialiser le formulaire
        this.resetNewAgent();
        
        // Fermer le formulaire
        this.showAddForm = false;
        
        this.isSubmitting = false;
        
        alert('Agent ajouté avec succès !');
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'ajout de l\'agent:', error);
        this.isSubmitting = false;
        
        let errorMessage = 'Erreur lors de l\'ajout de l\'agent. Veuillez réessayer.';
        
        if (error.status === 400) {
          errorMessage = 'Données invalides. Vérifiez les informations saisies.';
        } else if (error.status === 409) {
          errorMessage = 'Un agent avec ce nom d\'utilisateur ou cet email existe déjà.';
        } else if (error.status === 403) {
          errorMessage = 'Vous n\'avez pas les permissions pour ajouter un agent.';
        }
        
        alert(errorMessage);
      }
    });
  }

  resetNewAgent(): void {
    this.newAgent = {
      username: '',
      password: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      municipaliteId: 0,
      poste: ''
    };
  }

  cancelAddAgent(): void {
    this.showAddForm = false;
    this.resetNewAgent();
  }

  getTotalAgents(): number {
    return this.agents.length;
  }

  getAgentsActifs(): number {
    return this.agents.filter(a => a.statut === 'actif').length;
  }

  getAgentsInactifs(): number {
    return this.agents.filter(a => a.statut === 'inactif').length;
  }

  viewAgent(agent: AgentMunicipal): void {
    this.selectedAgent = agent;
    this.showModal = true;
  }

  editAgent(agent: AgentMunicipal): void {
    console.log('Agent à modifier:', agent);
    this.editingAgent = { ...agent }; // Créer une copie profonde
    this.showEditModal = true;
    console.log('Agent copié:', this.editingAgent);
  }

  updateAgentStatus(agentId: number, event: any): void {
    const nouveauStatut = event.target.value;
    if (nouveauStatut) {
      const agent = this.agents.find(a => a.id === agentId);
      if (agent) {
        agent.statut = nouveauStatut as AgentMunicipal['statut'];
        this.loadAgents();
        alert(`Statut de ${agent.prenom} ${agent.nom} mis à jour vers: ${this.getStatutLabel(nouveauStatut)}`);
      }
      event.target.value = ''; // Reset select
    }
  }

  supprimerAgent(agent: AgentMunicipal): void {
    const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'agent ${agent.prenom} ${agent.nom} ?\n\nCette action est irréversible et supprimera toutes les données associées.`);
    
    if (confirmation) {
      this.adminService.supprimerAgent(agent.id).subscribe({
        next: (response: any) => {
          console.log('Agent supprimé:', response);
          alert(`L'agent ${agent.prenom} ${agent.nom} a été supprimé avec succès.`);
          this.loadAgents(); // Recharger la liste
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression de l\'agent:', error);
          let errorMessage = 'Erreur lors de la suppression de l\'agent. Veuillez réessayer.';
          
          if (error.status === 500) {
            errorMessage = 'Impossible de supprimer cet agent car il est responsable de projets. Veuillez d\'abord réassigner ses projets.';
          } else if (error.status === 404) {
            errorMessage = 'Agent non trouvé.';
          } else if (error.status === 403) {
            errorMessage = 'Vous n\'avez pas les permissions pour supprimer cet agent.';
          }
          
          alert(errorMessage);
        }
      });
    }
  }

  getStars(note: number): string[] {
    const stars = [];
    const fullStars = Math.floor(note);
    const hasHalfStar = note % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if (hasHalfStar) {
      stars.push('☆');
    }
    
    // Compléter jusqu'à 5 étoiles
    while (stars.length < 5) {
      stars.push('☆');
    }
    
    return stars;
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
    this.selectedAgent = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingAgent = null;
  }

  onSaveAgentChanges(event: {type: string, data: any}): void {
    console.log('Sauvegarde des modifications:', event);
    
    // Ici, vous pouvez ajouter l'appel API pour sauvegarder les modifications
    // Pour l'instant, on simule la sauvegarde
    this.isSubmitting = true;
    
    setTimeout(() => {
      // Mettre à jour l'agent dans la liste locale
      const index = this.agents.findIndex(a => a.id === event.data.id);
      if (index !== -1) {
        this.agents[index] = { ...this.agents[index], ...event.data };
      }
      
      this.isSubmitting = false;
      this.closeEditModal();
      alert('Agent modifié avec succès !');
    }, 1000);
  }
}
