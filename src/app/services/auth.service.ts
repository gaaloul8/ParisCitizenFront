import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  username: string;
  password: string;
  role: 'admin' | 'agent' | 'citoyen';
  nom?: string;
  prenom?: string;
  email?: string;
  commune?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  // Utilisateurs statiques
  private staticUsers: User[] = [
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'agent', password: 'agent', role: 'agent' },
    { username: 'citoyen', password: 'citoyen', role: 'citoyen' }
  ];

  constructor(private router: Router) {}

  login(username: string, password: string, role: 'admin' | 'agent' | 'citoyen'): boolean {
    const user = this.staticUsers.find(u => 
      u.username === username && u.password === password && u.role === role
    );
    
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Redirection selon le rôle
      switch (role) {
        case 'admin':
          this.router.navigate(['/admin/dashboard']);
          break;
        case 'agent':
          this.router.navigate(['/agent/dashboard']);
          break;
        case 'citoyen':
          this.router.navigate(['/citoyen/dashboard']);
          break;
      }
      return true;
    }
    return false;
  }

  register(nom: string, prenom: string, email: string, password: string, commune: string): boolean {
    // Pour cette démo, on simule l'inscription en créant un utilisateur citoyen
    const newUser: User = {
      username: email.split('@')[0], // Utilise la partie avant @ comme username
      password: password,
      role: 'citoyen',
      nom,
      prenom,
      email,
      commune
    };

    // Ajouter à la liste des utilisateurs statiques
    this.staticUsers.push(newUser);
    this.currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    this.router.navigate(['/citoyen/dashboard']);
    return true;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}