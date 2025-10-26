import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/auth.service';
import { CitoyenService } from '../../../services/citoyen.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  currentUser: User | null = null;
  editedUser: User | null = null;
  isEditMode = false;
  isSaving = false;
  isSavingPreferences = false;
  
  // Données pour les statistiques
  reclamations: any[] = [];

  preferences = {
    notificationsEmail: true,
    newsletter: false,
    projectUpdates: true
  };

  constructor(
    private authService: AuthService,
    private citoyenService: CitoyenService
  ) {}

  ngOnInit(): void {
    // Vérifier que l'utilisateur est bien un citoyen
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role?.toLowerCase() !== 'citoyen') {
      this.authService.logout();
      return;
    }

    this.editedUser = { ...this.currentUser };
    this.loadPreferences();
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.citoyenService.getReclamations().subscribe({
      next: (response) => {
        this.reclamations = response.content;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réclamations:', error);
      }
    });
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      this.cancelEdit();
    } else {
      this.isEditMode = true;
      if (this.currentUser) {
        this.editedUser = { ...this.currentUser };
      }
    }
  }

  saveProfile(): void {
    if (!this.editedUser) return;
    
    this.isSaving = true;
    
    // Simuler la sauvegarde
    setTimeout(() => {
      // En réalité, on appellerait un service pour sauvegarder
      this.currentUser = { ...this.editedUser! };
      
      // Mettre à jour dans le localStorage
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      
      this.isEditMode = false;
      this.isSaving = false;
      
      alert('Profil mis à jour avec succès !');
    }, 1000);
  }

  cancelEdit(): void {
    this.isEditMode = false;
    if (this.currentUser) {
      this.editedUser = { ...this.currentUser };
    }
  }

  savePreferences(): void {
    this.isSavingPreferences = true;
    
    // Simuler la sauvegarde des préférences
    setTimeout(() => {
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
      this.isSavingPreferences = false;
      alert('Préférences sauvegardées !');
    }, 1000);
  }

  loadPreferences(): void {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      this.preferences = { ...this.preferences, ...JSON.parse(saved) };
    }
  }

  getMemberSince(): string {
    // Simuler une date d'inscription
    const memberSince = new Date();
    memberSince.setMonth(memberSince.getMonth() - 3); // Il y a 3 mois
    
    return memberSince.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  }

  getReclamationsCount(): number {
    return this.reclamations.length;
  }

  getTreatedReclamationsCount(): number {
    return this.reclamations.filter(r => r.statut === 'traitee').length;
  }

  getParticipationsCount(): number {
    // Simuler le nombre de projets suivis
    return 2;
  }

  getChatMessagesCount(): number {
    const messages = [
      ...this.citoyenService.getMessages('etablissement'),
      ...this.citoyenService.getMessages('projet'),
      ...this.citoyenService.getMessages('reclamation')
    ];
    return messages.filter(m => m.expediteur === 'user').length;
  }

  logout(): void {
    this.authService.logout();
  }
}