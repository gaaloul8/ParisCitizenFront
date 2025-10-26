import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PageResponse } from './api.service';

export interface ProjetAgent {
  id: number;
  titre: string;
  description: string;
  dateCreation: string;
  dateDebut: string;
  dateFin: string;
  statut: 'brouillon' | 'actif' | 'termine' | 'suspendu';
  budget: number;
  responsable: string;
  participants: number;
  arrondissement: string;
  localisation?: string;
  objectifs?: string;
  beneficiaires?: string;
}

export interface ReclamationAgent {
  id: number;
  sujet: string;
  description: string;
  dateCreation: string;
  dateTraitement?: string;
  statut: 'nouvelle' | 'en_cours' | 'traitee' | 'rejetee';
  priorite: 'basse' | 'moyenne' | 'haute' | 'urgente';
  type: 'voirie' | 'eclairage' | 'dechets' | 'espaces_verts' | 'transport' | 'autre';
  citoyen: {
    nom: string;
    prenom: string;
    email: string;
  };
  localisation: string;
  arrondissement: string;
  commentaires?: string;
}

export interface StatistiquesAgent {
  tauxSatisfaction: number;
  reclamationsRecues: number;
  reclamationsTraitees: number;
  projetsActifs: number;
  projetsTermines: number;
  sujetsPopulaires: Array<{
    sujet: string;
    nombre: number;
    pourcentage: number;
  }>;
  tendanceMensuelle: Array<{
    mois: string;
    reclamations: number;
    projets: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  
  constructor(private apiService: ApiService) {}

  // Méthodes pour les projets
  getProjets(page: number = 0, limit: number = 10, statut?: string): Observable<PageResponse<ProjetAgent>> {
    const params: any = { page, limit };
    if (statut) {
      params.statut = statut;
    }
    return this.apiService.getPage<ProjetAgent>('/projets', params);
  }

  getProjetById(id: number): Observable<ProjetAgent> {
    return this.apiService.get<ProjetAgent>(`/projets/${id}`);
  }

  ajouterProjet(projet: Omit<ProjetAgent, 'id'>): Observable<ProjetAgent> {
    return this.apiService.post<ProjetAgent>('/projets', projet);
  }

  mettreAJourStatutProjet(id: number, nouveauStatut: string): Observable<ProjetAgent> {
    return this.apiService.patch<ProjetAgent>(`/projets/${id}/statut?statut=${nouveauStatut}`);
  }

  // Méthodes pour les réclamations
  getReclamations(page: number = 0, limit: number = 10, statut?: string, agentId?: number): Observable<PageResponse<ReclamationAgent>> {
    const params: any = { page, limit };
    if (statut) {
      params.statut = statut;
    }
    if (agentId) {
      params.agentId = agentId;
    }
    return this.apiService.getPage<ReclamationAgent>('/reclamations', params);
  }

  // Méthode spécifique pour obtenir les réclamations d'un agent
  getReclamationsByAgent(agentId: number, page: number = 0, limit: number = 10): Observable<PageResponse<ReclamationAgent>> {
    return this.apiService.getPage<ReclamationAgent>(`/reclamations/agent/${agentId}`, { page, limit });
  }

  getReclamationsByStatut(statut: string, page: number = 0, limit: number = 10): Observable<PageResponse<ReclamationAgent>> {
    return this.getReclamations(page, limit, statut);
  }

  getReclamationById(id: number): Observable<ReclamationAgent> {
    return this.apiService.get<ReclamationAgent>(`/reclamations/${id}`);
  }

  traiterReclamation(id: number, commentaires?: string): Observable<ReclamationAgent> {
    const params = commentaires ? `?commentaires=${encodeURIComponent(commentaires)}` : '';
    return this.apiService.patch<ReclamationAgent>(`/reclamations/${id}/statut?statut=TRAITEE${params}`);
  }

  mettreAJourStatutReclamation(id: number, nouveauStatut: string, commentaires?: string): Observable<ReclamationAgent> {
    const params = commentaires ? `&commentaires=${encodeURIComponent(commentaires)}` : '';
    return this.apiService.patch<ReclamationAgent>(`/reclamations/${id}/statut?statut=${nouveauStatut}${params}`);
  }

  // Statistiques
  getStatistiques(): Observable<any> {
    return this.apiService.get('/projets/stats');
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'voirie':
        return 'Voirie';
      case 'eclairage':
        return 'Éclairage';
      case 'dechets':
        return 'Déchets';
      case 'espaces_verts':
        return 'Espaces verts';
      case 'transport':
        return 'Transport';
      case 'autre':
        return 'Autre';
      default:
        return type;
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'nouvelle':
        return 'Nouvelle';
      case 'en_cours':
        return 'En cours';
      case 'traitee':
        return 'Traitée';
      case 'rejetee':
        return 'Rejetée';
      default:
        return statut;
    }
  }

  getPrioriteLabel(priorite: string): string {
    switch (priorite) {
      case 'basse':
        return 'Basse';
      case 'moyenne':
        return 'Moyenne';
      case 'haute':
        return 'Haute';
      case 'urgente':
        return 'Urgente';
      default:
        return priorite;
    }
  }
}