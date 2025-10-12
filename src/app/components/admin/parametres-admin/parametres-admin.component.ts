import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-parametres-admin',
  templateUrl: './parametres-admin.component.html',
  styleUrls: ['./parametres-admin.component.css']
})
export class ParametresAdminComponent implements OnInit {
  currentUser: User | null = null;
  isSaving = false;

  parametres = {
    maintenanceMode: false,
    newUserRegistration: true,
    emailNotifications: true,
    sessionTimeout: 60,
    twoFactorAuth: false,
    passwordComplexity: true,
    adminNotifications: true,
    weeklyReports: false,
    errorAlerts: true,
    autoBackup: true,
    backupFrequency: 'daily'
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Vérifier que l'utilisateur est bien un admin
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.authService.logout();
      return;
    }

    this.loadParametres();
  }

  loadParametres(): void {
    // Charger les paramètres sauvegardés
    const saved = localStorage.getItem('adminParametres');
    if (saved) {
      this.parametres = { ...this.parametres, ...JSON.parse(saved) };
    }
  }

  saveParametres(): void {
    this.isSaving = true;
    
    // Simuler la sauvegarde
    setTimeout(() => {
      localStorage.setItem('adminParametres', JSON.stringify(this.parametres));
      this.isSaving = false;
      alert('Paramètres sauvegardés avec succès !');
    }, 1000);
  }

  resetParametres(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      this.parametres = {
        maintenanceMode: false,
        newUserRegistration: true,
        emailNotifications: true,
        sessionTimeout: 60,
        twoFactorAuth: false,
        passwordComplexity: true,
        adminNotifications: true,
        weeklyReports: false,
        errorAlerts: true,
        autoBackup: true,
        backupFrequency: 'daily'
      };
      localStorage.removeItem('adminParametres');
      alert('Paramètres réinitialisés !');
    }
  }

  exportParametres(): void {
    const config = {
      parametres: this.parametres,
      dateExport: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paris-citizen-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Configuration exportée avec succès !');
  }

  getLastUpdate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Il y a une semaine
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  logout(): void {
    this.authService.logout();
  }
}