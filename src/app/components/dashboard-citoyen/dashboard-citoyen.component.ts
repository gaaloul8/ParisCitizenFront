import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-citoyen',
  templateUrl: './dashboard-citoyen.component.html',
  styleUrls: ['./dashboard-citoyen.component.css']
})
export class DashboardCitoyenComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Vérifier que l'utilisateur est bien un citoyen
    if (!this.currentUser || this.currentUser.role?.toLowerCase() !== 'citoyen') {
      console.log('Utilisateur non autorisé, redirection vers home');
      // Rediriger vers la page d'accueil si pas de citoyen
      this.authService.logout();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
