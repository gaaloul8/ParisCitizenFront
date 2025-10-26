import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PageResponse } from './api.service';

export interface Municipalite {
  id: number;
  nom: string;
  region: string;
  codePostal: string;
  nombreAgents: number;
  nombreCitoyens: number;
  nombreProjets: number;
  tauxSatisfaction: number;
  budgetAnnuel: number;
  dateCreation: string;
  statut: 'active' | 'inactive' | 'maintenance';
}

export interface AgentMunicipal {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  municipalite: string;
  poste: string;
  dateEmbauche: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  nombreReclamationsTraitees: number;
  noteSatisfaction: number;
}

export interface CitoyenAdmin {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  age: number;
  commune: string;
  dateInscription: string;
  nombreReclamations: number;
  nombreProjetsParticipes: number;
  statut: 'actif' | 'inactif' | 'suspendu';
  derniereActivite: string;
}

export interface StatistiquesGlobales {
  totalCitoyens: number;
  moyenneAge: number;
  totalMunicipalites: number;
  totalAgents: number;
  totalProjets: number;
  totalReclamations: number;
  tauxSatisfactionGlobal: number;
  activiteMensuelle: Array<{
    mois: string;
    nouveauxCitoyens: number;
    nouvellesReclamations: number;
    projetsLances: number;
  }>;
  topMunicipalites: Array<{
    nom: string;
    tauxSatisfaction: number;
    nombreReclamations: number;
  }>;
  repartitionParAge: Array<{
    tranche: string;
    nombre: number;
    pourcentage: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  constructor(private apiService: ApiService) {}

  // Méthodes pour les municipalités
  getMunicipalites(page: number = 0, limit: number = 10): Observable<PageResponse<Municipalite>> {
    return this.apiService.getPage<Municipalite>('/municipalites', { page, limit });
  }

  getMunicipaliteById(id: number): Observable<Municipalite> {
    return this.apiService.get<Municipalite>(`/municipalites/${id}`);
  }

  ajouterMunicipalite(municipalite: {
    nom: string;
    region: string;
    codePostal: string;
    budgetAnnuel: number;
    adresse?: string;
    telephone?: string;
    email?: string;
    siteWeb?: string;
  }): Observable<Municipalite> {
    return this.apiService.post<Municipalite>('/municipalites', municipalite);
  }

  supprimerMunicipalite(id: number): Observable<any> {
    return this.apiService.delete(`/municipalites/${id}`);
  }

  // Méthodes pour les agents
  getAgents(page: number = 0, limit: number = 10, municipaliteId?: number): Observable<PageResponse<AgentMunicipal>> {
    const params: any = { page, limit };
    if (municipaliteId) {
      params.municipaliteId = municipaliteId;
    }
    return this.apiService.getPage<AgentMunicipal>('/agents', params);
  }

  getAgentsByMunicipalite(municipalite: string, page: number = 0, limit: number = 10): Observable<PageResponse<AgentMunicipal>> {
    return this.apiService.getPage<AgentMunicipal>('/agents', { page, limit, municipalite });
  }

  getAgentById(id: number): Observable<AgentMunicipal> {
    return this.apiService.get<AgentMunicipal>(`/agents/${id}`);
  }

  ajouterAgent(agent: {
    username: string;
    password: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    municipaliteId: number;
    poste: string;
  }): Observable<AgentMunicipal> {
    return this.apiService.post<AgentMunicipal>('/agents', agent);
  }

  getMunicipalitesForAgents(): Observable<Municipalite[]> {
    return this.apiService.get<Municipalite[]>('/agents/municipalites');
  }

  supprimerAgent(id: number): Observable<any> {
    return this.apiService.delete(`/agents/${id}`);
  }

  // Méthodes pour les citoyens
  getCitoyens(page: number = 0, limit: number = 10, municipaliteId?: number, statut?: string): Observable<PageResponse<CitoyenAdmin>> {
    const params: any = { page, limit };
    if (municipaliteId) {
      params.municipaliteId = municipaliteId;
    }
    if (statut) {
      params.statut = statut;
    }
    return this.apiService.getPage<CitoyenAdmin>('/citoyens', params);
  }

  getCitoyensByCommune(commune: string, page: number = 0, limit: number = 10): Observable<PageResponse<CitoyenAdmin>> {
    return this.apiService.getPage<CitoyenAdmin>('/citoyens', { page, limit, commune });
  }

  getCitoyenById(id: number): Observable<CitoyenAdmin> {
    return this.apiService.get<CitoyenAdmin>(`/citoyens/${id}`);
  }

  supprimerCitoyen(id: number): Observable<any> {
    return this.apiService.delete(`/citoyens/${id}`);
  }

  // Statistiques globales
  getStatistiquesGlobales(): Observable<any> {
    return this.apiService.get('/admin/stats');
  }

  // Utilitaires
  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'maintenance':
        return 'Maintenance';
      case 'actif':
        return 'Actif';
      case 'inactif':
        return 'Inactif';
      case 'suspendu':
        return 'Suspendu';
      default:
        return statut;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
}