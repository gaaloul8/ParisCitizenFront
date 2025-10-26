import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, PageResponse } from './api.service';
import { N8nChatbotService } from './n8n-chatbot.service';

export interface Projet {
  id: number;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  statut: 'ACTIF' | 'TERMINE' | 'PLANIFIE' | 'BROUILLON';
  arrondissement: string;
  responsable: string;
  budget: number;
  participants: number;
  image?: string;
}

export interface Etablissement {
  id: number;
  nom: string;
  type: 'ecole' | 'hopital' | 'mairie' | 'association' | 'culturel' | 'sportif' | 'social';
  adresse: string;
  telephone: string;
  email?: string;
  horaires: string;
  description: string;
  arrondissement: string;
  siteWeb?: string;
}

export interface Reclamation {
  id: number;
  sujet: string;
  description: string;
  dateCreation: string;
  dateTraitement?: string;
  statut: 'en_attente' | 'en_cours' | 'traitee' | 'rejetee';
  priorite: 'basse' | 'moyenne' | 'haute';
  arrondissement: string;
  localisation: string;
  type: 'voirie' | 'eclairage' | 'dechets' | 'espaces_verts' | 'transport' | 'autre';
  commentaires?: string;
}

export interface MessageChatbot {
  id: number;
  contenu: string;
  expediteur: 'user' | 'bot';
  timestamp: Date;
  agent: 'etablissement' | 'projet' | 'reclamation';
}

@Injectable({
  providedIn: 'root'
})
export class CitoyenService {
  private messages: { [agent: string]: MessageChatbot[] } = {};
  
  constructor(
    private apiService: ApiService,
    private n8nChatbotService: N8nChatbotService
  ) {}

  // Méthodes pour les projets
  getProjets(page: number = 0, limit: number = 10, statut?: string): Observable<PageResponse<Projet>> {
    const params: any = { page, limit };
    if (statut) {
      params.statut = statut;
    }
    return this.apiService.getPage<Projet>('/projets', params);
  }

  getProjetById(id: number): Observable<Projet> {
    return this.apiService.get<Projet>(`/projets/${id}`);
  }

  // Méthodes pour les établissements
  getEtablissements(page: number = 0, limit: number = 10, type?: string, arrondissement?: string): Observable<PageResponse<Etablissement>> {
    const params: any = { page, limit };
    if (type) {
      params.type = type;
    }
    if (arrondissement) {
      params.arrondissement = arrondissement;
    }
    return this.apiService.getPage<Etablissement>('/etablissements', params);
  }

  getEtablissementsByType(type: string, page: number = 0, limit: number = 10): Observable<PageResponse<Etablissement>> {
    return this.getEtablissements(page, limit, type);
  }

  getEtablissementById(id: number): Observable<Etablissement> {
    return this.apiService.get<Etablissement>(`/etablissements/${id}`);
  }

  // Méthodes pour les réclamations
  getReclamations(page: number = 0, limit: number = 10, statut?: string, citoyenId?: number): Observable<PageResponse<Reclamation>> {
    const params: any = { page, limit };
    if (statut) {
      params.statut = statut;
    }
    if (citoyenId) {
      params.citoyenId = citoyenId;
    }
    return this.apiService.getPage<Reclamation>('/reclamations', params);
  }

  getReclamationsByStatut(statut: string, page: number = 0, limit: number = 10): Observable<PageResponse<Reclamation>> {
    return this.getReclamations(page, limit, statut);
  }

  // Récupérer les réclamations d'un citoyen spécifique
  getReclamationsByCitoyen(citoyenId: number, page: number = 0, limit: number = 10): Observable<PageResponse<Reclamation>> {
    return this.apiService.getPage<Reclamation>(`/citoyens/${citoyenId}/reclamations`, { page, limit });
  }

  ajouterReclamation(reclamation: any): Observable<any> {
    return this.apiService.post('/reclamations-simple', reclamation);
  }

  // Méthodes pour le chatbot (simulation locale)
  getMessages(agent: string): MessageChatbot[] {
    return this.messages[agent] || [];
  }

  ajouterMessage(contenu: string, agent: string): MessageChatbot {
    const message: MessageChatbot = {
      id: Date.now(),
      contenu,
      expediteur: 'bot',
      timestamp: new Date(),
      agent: agent as 'etablissement' | 'projet' | 'reclamation'
    };
    
    // Initialiser le tableau pour cet agent s'il n'existe pas
    if (!this.messages[agent]) {
      this.messages[agent] = [];
    }
    
    // Ajouter le message
    this.messages[agent].push(message);
    
    console.log('Message ajouté pour l\'agent', agent, ':', message);
    console.log('Messages actuels pour', agent, ':', this.messages[agent]);
    
    return message;
  }

  ajouterMessageUtilisateur(contenu: string, agent: string): MessageChatbot {
    const message: MessageChatbot = {
      id: Date.now(),
      contenu,
      expediteur: 'user',
      timestamp: new Date(),
      agent: agent as 'etablissement' | 'projet' | 'reclamation'
    };
    
    // Initialiser le tableau pour cet agent s'il n'existe pas
    if (!this.messages[agent]) {
      this.messages[agent] = [];
    }
    
    // Ajouter le message
    this.messages[agent].push(message);
    
    console.log('Message utilisateur ajouté pour l\'agent', agent, ':', message);
    
    return message;
  }

  // Méthodes pour la participation aux projets
  participerAuProjet(projetId: number, citoyenId: number): Observable<any> {
    return this.apiService.post(`/projets/${projetId}/participants/${citoyenId}`, {});
  }

  annulerParticipation(projetId: number, citoyenId: number): Observable<any> {
    return this.apiService.delete(`/projets/${projetId}/participants/${citoyenId}`);
  }

  getProjetsParticipes(citoyenId: number, page: number = 0, limit: number = 10): Observable<PageResponse<Projet>> {
    return this.apiService.getPage<Projet>(`/projets/citoyen/${citoyenId}`, { page, limit });
  }

  // Vérifier si un citoyen participe à un projet
  verifierParticipation(projetId: number, citoyenId: number): Observable<boolean> {
    return this.apiService.get<boolean>(`/projets/${projetId}/participants/${citoyenId}/check`);
  }

  // Obtenir tous les projets où un citoyen participe
  getProjetsParticipesByCitoyen(citoyenId: number): Observable<number[]> {
    return this.apiService.get<any>(`/citoyens/${citoyenId}/projets-participes`).pipe(
      map(response => {
        // L'API retourne { success, message, data: Long[] }
        return response.data || [];
      })
    );
  }

  // Obtenir les participants d'un projet
  getParticipantsProjet(projetId: number): Observable<any[]> {
    return this.apiService.get<any[]>(`/projets/${projetId}/participants`);
  }

  // Simulation de réponse du chatbot
  getReponseChatbot(message: string, agent: string): MessageChatbot {
    let reponse = '';
    
    switch (agent) {
      case 'etablissement':
        reponse = this.getReponseEtablissement(message);
        break;
      case 'projet':
        reponse = this.getReponseProjet(message);
        break;
      case 'reclamation':
        reponse = this.getReponseReclamation(message);
        break;
      default:
        reponse = "Je ne comprends pas votre demande. Pouvez-vous reformuler ?";
    }

    const messageReponse: MessageChatbot = {
      id: Date.now(),
      contenu: reponse,
      expediteur: 'bot',
      timestamp: new Date(),
      agent: agent as 'etablissement' | 'projet' | 'reclamation'
    };
    return messageReponse;
  }

  // Nouvelle méthode pour utiliser le webhook n8n pour les agents
  getReponseChatbotN8n(message: string, agent: string): Observable<MessageChatbot> {
    console.log('=== getReponseChatbotN8n ===');
    console.log('Message:', message);
    console.log('Agent:', agent);
    console.log('Agent === "projet":', agent === 'projet');
    console.log('Agent === "reclamation":', agent === 'reclamation');
    console.log('Condition (agent === "reclamation" || agent === "projet"):', agent === 'reclamation' || agent === 'projet');
    
    if (agent === 'reclamation' || agent === 'projet' || agent === 'etablissement') {
      console.log('Utilisation de n8n pour l\'agent:', agent);
      // Utiliser le webhook n8n pour tous les agents
      return this.n8nChatbotService.sendSimpleMessage(message, agent).pipe(
        map(response => ({
          id: Date.now(),
          contenu: response,
          expediteur: 'bot' as const,
          timestamp: new Date(),
          agent: agent as 'etablissement' | 'projet' | 'reclamation'
        }))
      );
    } else {
      console.log('Utilisation de la simulation pour l\'agent:', agent);
      // Utiliser les réponses simulées pour les autres agents
      const reponse = this.getReponseChatbot(message, agent);
      console.log('Réponse simulée:', reponse);
      return new Observable(observer => {
        observer.next(reponse);
        observer.complete();
      });
    }
  }

  private getReponseEtablissement(message: string): string {
    const msg = message.toLowerCase();
    
    if (msg.includes('école') || msg.includes('ecole')) {
      return "Je peux vous renseigner sur les écoles du 15ème arrondissement. Utilisez la recherche d'établissements pour trouver les écoles près de chez vous.";
    }
    if (msg.includes('hôpital') || msg.includes('hopital')) {
      return "Pour les hôpitaux du 15ème, consultez la liste des établissements de santé dans notre annuaire.";
    }
    if (msg.includes('mairie')) {
      return "La mairie du 15ème arrondissement est située 31 Rue Péclet. Consultez les horaires et services sur notre site.";
    }
    if (msg.includes('association')) {
      return "De nombreuses associations sont actives dans le 15ème. Consultez notre annuaire des établissements pour les découvrir.";
    }
    
    return "Je peux vous renseigner sur les établissements du 15ème arrondissement. Que souhaitez-vous savoir ?";
  }

  private getReponseProjet(message: string): string {
    const msg = message.toLowerCase();
    
    if (msg.includes('jardin') || msg.includes('vert')) {
      return "Découvrez les projets liés aux espaces verts dans la section projets. Vous pouvez aussi proposer vos propres idées !";
    }
    if (msg.includes('senior') || msg.includes('numérique') || msg.includes('numerique')) {
      return "Consultez les projets numériques et d'aide aux seniors dans notre catalogue de projets.";
    }
    if (msg.includes('fête') || msg.includes('fete') || msg.includes('événement')) {
      return "Les événements et fêtes de quartier sont organisés par la mairie. Consultez les projets en cours !";
    }
    if (msg.includes('soutien') || msg.includes('scolaire')) {
      return "Les projets d'aide scolaire sont régulièrement proposés. Consultez la liste des projets terminés et en cours.";
    }
    
    return "Je peux vous renseigner sur les projets du 15ème. Consultez la section projets pour découvrir toutes les initiatives !";
  }

  private getReponseReclamation(message: string): string {
    const msg = message.toLowerCase();
    
    if (msg.includes('éclairage') || msg.includes('eclairage')) {
      return "Pour signaler un problème d'éclairage, utilisez le formulaire de réclamation en ligne. C'est plus rapide et efficace !";
    }
    if (msg.includes('route') || msg.includes('trou') || msg.includes('nid')) {
      return "Les problèmes de voirie peuvent être signalés via notre formulaire de réclamation. Nous traiterons votre demande rapidement.";
    }
    if (msg.includes('poubelle') || msg.includes('déchet') || msg.includes('dechet')) {
      return "Pour les problèmes de collecte des déchets, utilisez le formulaire de réclamation. Nous nous en occupons !";
    }
    if (msg.includes('parc') || msg.includes('jardin') || msg.includes('arbre')) {
      return "Les espaces verts sont importants ! Signalez tout problème via notre formulaire de réclamation.";
    }
    
    return "Je peux vous aider à signaler des problèmes. Utilisez le formulaire de réclamation pour une prise en charge rapide !";
  }
}