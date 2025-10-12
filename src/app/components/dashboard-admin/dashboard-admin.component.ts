import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { AdminService, StatistiquesGlobales } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  currentUser: User | null = null;
  statistiques: StatistiquesGlobales | null = null;

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Vérifier que l'utilisateur est bien un admin
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      // Rediriger vers la page de connexion si pas d'admin
      this.authService.logout();
      return;
    }

    this.loadStatistiques();
  }

  loadStatistiques(): void {
    this.statistiques = this.adminService.getStatistiquesGlobales();
  }

  getBarHeight(value: number): number {
    // Normaliser la valeur pour l'affichage (max 100%)
    const maxValue = 60; // Valeur maximale pour normaliser
    return Math.min((value / maxValue) * 100, 100);
  }

  logout(): void {
    this.authService.logout();
  }
}