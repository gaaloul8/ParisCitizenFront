import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginData = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Validation côté client
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.isLoading = false;
      return;
    }

    // Tentative de connexion
    console.log('Tentative de connexion avec:', this.loginData.email);
    this.authService.login(
      this.loginData.email,
      this.loginData.password
    ).subscribe({
      next: (response) => {
        // La redirection est gérée par le service
        console.log('Connexion réussie:', response);
        console.log('Rôle détecté:', response.user.role);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur de connexion complète:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Error body:', error.error);
        
        // Message d'erreur plus spécifique
        if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        } else {
          this.errorMessage = `Erreur de connexion (${error.status}): ${error.message || 'Veuillez vérifier vos informations.'}`;
        }
        this.isLoading = false;
      }
    });
  }
}