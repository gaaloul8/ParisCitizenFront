import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface User {
  id?: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'AGENT' | 'CITOYEN';
  nom?: string;
  prenom?: string;
  commune?: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  commune: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {
    // Vérifier si un utilisateur est déjà connecté au démarrage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && storedUser !== 'null' && storedUser !== 'undefined') {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Erreur lors du parsing de l\'utilisateur stocké:', error);
        // Nettoyer les données corrompues
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const loginRequest: LoginRequest = { email, password };
    
    return this.apiService.post<any>('/auth/login', loginRequest).pipe(
      map(response => {
        console.log('Réponse complète de l\'API:', response);
        
        // L'API retourne { success, message, data: { token, type, user } }
        const authData = response.data || response;
        const authResponse: AuthResponse = {
          token: authData.token,
          user: authData.user
        };
        
        console.log('Données d\'authentification extraites:', authResponse);
        
        // Stocker le token
        localStorage.setItem('token', authResponse.token);
        localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
        this.currentUserSubject.next(authResponse.user);
        
        // Redirection selon le rôle
        this.redirectByRole(authResponse.user.role);
        
        return authResponse;
      })
    );
  }

  register(nom: string, prenom: string, email: string, password: string, commune: string): Observable<AuthResponse> {
    const registerRequest: RegisterRequest = { nom, prenom, email, password, commune };
    
    return this.apiService.post<any>('/auth/register', registerRequest).pipe(
      map(response => {
        console.log('Réponse complète de l\'API (register):', response);
        
        // L'API retourne { success, message, data: { token, type, user } }
        const authData = response.data || response;
        const authResponse: AuthResponse = {
          token: authData.token,
          user: authData.user
        };
        
        console.log('Données d\'authentification extraites (register):', authResponse);
        
        // Stocker le token
        localStorage.setItem('token', authResponse.token);
        localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
        this.currentUserSubject.next(authResponse.user);
        
        // Redirection vers le dashboard citoyen
        this.router.navigate(['/citoyen/dashboard']);
        
        return authResponse;
      })
    );
  }

  logout(): Observable<any> {
    return this.apiService.post('/auth/logout', {}).pipe(
      map(() => {
        // Nettoyer le stockage local
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/home']);
      })
    );
  }

  getCurrentUser(): User | null {
    const user = this.currentUserSubject.value;
    console.log('getCurrentUser() appelé, utilisateur:', user);
    
    // Si pas d'utilisateur dans le subject, essayer de le récupérer du localStorage
    if (!user) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('Utilisateur récupéré du localStorage:', parsedUser);
        this.currentUserSubject.next(parsedUser);
        return parsedUser;
      }
    }
    
    return user;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && !!localStorage.getItem('token');
  }

  private redirectByRole(role: string): void {
    console.log('Redirection pour le rôle:', role);
    switch (role.toLowerCase()) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'agent':
        this.router.navigate(['/agent/dashboard']);
        break;
      case 'citoyen':
        this.router.navigate(['/citoyen/dashboard']);
        break;
      default:
        console.log('Rôle non reconnu, redirection vers home');
        this.router.navigate(['/home']);
    }
  }
}