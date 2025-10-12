import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  commune: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: RegisterData = {
    nom: '',
    prenom: '',
    email: '',
    commune: '',
    password: '',
    confirmPassword: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Validation côté client
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      this.isLoading = false;
      return;
    }

    if (!this.registerData.nom || !this.registerData.prenom || !this.registerData.email || !this.registerData.commune || !this.registerData.password) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      this.isLoading = false;
      return;
    }

    // Tentative d'inscription
    try {
      const success = this.authService.register(
        this.registerData.nom,
        this.registerData.prenom,
        this.registerData.email,
        this.registerData.password,
        this.registerData.commune
      );

      if (success) {
        this.successMessage = 'Inscription réussie ! Redirection en cours...';
        // La redirection est gérée par le service d'authentification
      } else {
        this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
      }
    } catch (error) {
      this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    } finally {
      this.isLoading = false;
    }
  }
}