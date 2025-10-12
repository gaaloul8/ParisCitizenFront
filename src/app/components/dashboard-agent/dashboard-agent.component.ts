import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-agent',
  templateUrl: './dashboard-agent.component.html',
  styleUrls: ['./dashboard-agent.component.css']
})
export class DashboardAgentComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Vérifier que l'utilisateur est bien un agent
    if (!this.currentUser || this.currentUser.role !== 'agent') {
      // Rediriger vers la page de connexion si pas d'agent
      this.authService.logout();
    }
  }
}