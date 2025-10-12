import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface LoginData {
  role: 'admin' | 'agent' | 'citoyen' | '';
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginData = {
    role: '',
    username: '',
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
    if (!this.loginData.role || !this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.isLoading = false;
      return;
    }

    // Tentative de connexion
    try {
      const success = this.authService.login(
        this.loginData.username,
        this.loginData.password,
        this.loginData.role as 'admin' | 'agent' | 'citoyen'
      );

      if (!success) {
        this.errorMessage = 'Identifiants incorrects. Veuillez vérifier vos informations.';
      }
      // Si la connexion réussit, la redirection est gérée par le service
    } catch (error) {
      this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    } finally {
      this.isLoading = false;
    }
  }
}