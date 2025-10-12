import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Vérifier que l'utilisateur est bien un admin
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      // Rediriger vers la page de connexion si pas d'admin
      this.authService.logout();
    }
  }
}