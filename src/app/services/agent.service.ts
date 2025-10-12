import { Injectable } from '@angular/core';

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
  
  // Fake data pour les projets de l'agent
  private projetsAgent: ProjetAgent[] = [
    {
      id: 1,
      titre: "Rénovation des espaces verts",
      description: "Amélioration des parcs et jardins publics du quartier",
      dateCreation: "2024-01-15",
      dateDebut: "2024-03-01",
      dateFin: "2024-12-31",
      statut: "actif",
      budget: 45000,
      responsable: "Marie Dubois",
      participants: 12,
      arrondissement: "15ème"
    },
    {
      id: 2,
      titre: "Sécurisation des passages piétons",
      description: "Installation de feux tricolores et marquage au sol",
      dateCreation: "2024-02-01",
      dateDebut: "2024-04-15",
      dateFin: "2024-08-30",
      statut: "actif",
      budget: 28000,
      responsable: "Jean Martin",
      participants: 8,
      arrondissement: "15ème"
    },
    {
      id: 3,
      titre: "Événement culturel d'été",
      description: "Organisation d'un festival de musique dans le parc",
      dateCreation: "2024-01-20",
      dateDebut: "2024-06-15",
      dateFin: "2024-07-15",
      statut: "brouillon",
      budget: 15000,
      responsable: "Sophie Laurent",
      participants: 25,
      arrondissement: "15ème"
    },
    {
      id: 4,
      titre: "Programme d'aide aux seniors",
      description: "Services d'aide à domicile et activités sociales",
      dateCreation: "2023-09-01",
      dateDebut: "2023-10-01",
      dateFin: "2024-06-30",
      statut: "termine",
      budget: 32000,
      responsable: "Pierre Moreau",
      participants: 45,
      arrondissement: "15ème"
    }
  ];

  // Fake data pour les réclamations
  private reclamationsAgent: ReclamationAgent[] = [
    {
      id: 1,
      sujet: "Éclairage défaillant",
      description: "L'éclairage public de la rue de la Convention ne fonctionne plus",
      dateCreation: "2024-01-15",
      statut: "traitee",
      dateTraitement: "2024-01-18",
      priorite: "haute",
      type: "eclairage",
      citoyen: {
        nom: "Dupont",
        prenom: "Marie",
        email: "marie.dupont@email.com"
      },
      localisation: "Rue de la Convention, 75015 Paris",
      arrondissement: "15ème",
      commentaires: "Réparation effectuée, nouvel éclairage LED installé"
    },
    {
      id: 2,
      sujet: "Nid-de-poule dangereux",
      description: "Grand trou dans la chaussée avenue Émile Zola",
      dateCreation: "2024-01-10",
      statut: "en_cours",
      priorite: "moyenne",
      type: "voirie",
      citoyen: {
        nom: "Martin",
        prenom: "Jean",
        email: "jean.martin@email.com"
      },
      localisation: "Avenue Émile Zola, 75015 Paris",
      arrondissement: "15ème",
      commentaires: "Intervention programmée pour la semaine prochaine"
    },
    {
      id: 3,
      sujet: "Poubelles débordantes",
      description: "Les poubelles du square Saint-Lambert débordent",
      dateCreation: "2024-01-08",
      statut: "nouvelle",
      priorite: "basse",
      type: "dechets",
      citoyen: {
        nom: "Bernard",
        prenom: "Sophie",
        email: "sophie.bernard@email.com"
      },
      localisation: "Square Saint-Lambert, 75015 Paris",
      arrondissement: "15ème"
    },
    {
      id: 4,
      sujet: "Banc cassé dans le parc",
      description: "Banc cassé représentant un danger pour les enfants",
      dateCreation: "2024-01-05",
      statut: "traitee",
      dateTraitement: "2024-01-12",
      priorite: "moyenne",
      type: "espaces_verts",
      citoyen: {
        nom: "Moreau",
        prenom: "Pierre",
        email: "pierre.moreau@email.com"
      },
      localisation: "Parc Georges Brassens, 75015 Paris",
      arrondissement: "15ème",
      commentaires: "Banc remplacé par un nouveau modèle"
    },
    {
      id: 5,
      sujet: "Problème de transport",
      description: "Arrêt de bus dégradé, abri cassé",
      dateCreation: "2024-01-12",
      statut: "nouvelle",
      priorite: "haute",
      type: "transport",
      citoyen: {
        nom: "Durand",
        prenom: "Claire",
        email: "claire.durand@email.com"
      },
      localisation: "Arrêt Convention - Lecourbe, 75015 Paris",
      arrondissement: "15ème"
    }
  ];

  constructor() { }

  // Méthodes pour les projets
  getProjets(): ProjetAgent[] {
    return this.projetsAgent;
  }

  getProjetById(id: number): ProjetAgent | undefined {
    return this.projetsAgent.find(p => p.id === id);
  }

  ajouterProjet(projet: Omit<ProjetAgent, 'id'>): ProjetAgent {
    const nouveauProjet: ProjetAgent = {
      ...projet,
      id: this.projetsAgent.length + 1
    };
    this.projetsAgent.unshift(nouveauProjet);
    return nouveauProjet;
  }

  mettreAJourStatutProjet(id: number, nouveauStatut: ProjetAgent['statut']): boolean {
    const projet = this.projetsAgent.find(p => p.id === id);
    if (projet) {
      projet.statut = nouveauStatut;
      return true;
    }
    return false;
  }

  // Méthodes pour les réclamations
  getReclamations(): ReclamationAgent[] {
    return this.reclamationsAgent;
  }

  getReclamationsByStatut(statut: string): ReclamationAgent[] {
    return this.reclamationsAgent.filter(r => r.statut === statut);
  }

  getReclamationById(id: number): ReclamationAgent | undefined {
    return this.reclamationsAgent.find(r => r.id === id);
  }

  traiterReclamation(id: number, commentaires?: string): boolean {
    const reclamation = this.reclamationsAgent.find(r => r.id === id);
    if (reclamation) {
      reclamation.statut = 'traitee';
      reclamation.dateTraitement = new Date().toISOString().split('T')[0];
      if (commentaires) {
        reclamation.commentaires = commentaires;
      }
      return true;
    }
    return false;
  }

  mettreAJourStatutReclamation(id: number, nouveauStatut: ReclamationAgent['statut']): boolean {
    const reclamation = this.reclamationsAgent.find(r => r.id === id);
    if (reclamation) {
      reclamation.statut = nouveauStatut;
      if (nouveauStatut === 'traitee') {
        reclamation.dateTraitement = new Date().toISOString().split('T')[0];
      }
      return true;
    }
    return false;
  }

  // Statistiques
  getStatistiques(): StatistiquesAgent {
    const totalReclamations = this.reclamationsAgent.length;
    const reclamationsTraitees = this.reclamationsAgent.filter(r => r.statut === 'traitee').length;
    const projetsActifs = this.projetsAgent.filter(p => p.statut === 'actif').length;
    const projetsTermines = this.projetsAgent.filter(p => p.statut === 'termine').length;

    // Calcul du taux de satisfaction (simulé)
    const tauxSatisfaction = totalReclamations > 0 ? 
      Math.round((reclamationsTraitees / totalReclamations) * 85 + Math.random() * 10) : 85;

    // Sujets les plus populaires
    const sujetsCount = this.reclamationsAgent.reduce((acc, rec) => {
      acc[rec.type] = (acc[rec.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sujetsPopulaires = Object.entries(sujetsCount)
      .map(([sujet, nombre]) => ({
        sujet: this.getTypeLabel(sujet),
        nombre,
        pourcentage: Math.round((nombre / totalReclamations) * 100)
      }))
      .sort((a, b) => b.nombre - a.nombre)
      .slice(0, 5);

    // Tendance mensuelle (simulée)
    const tendanceMensuelle = [
      { mois: 'Jan', reclamations: 15, projets: 2 },
      { mois: 'Fév', reclamations: 12, projets: 3 },
      { mois: 'Mar', reclamations: 18, projets: 1 },
      { mois: 'Avr', reclamations: 14, projets: 4 },
      { mois: 'Mai', reclamations: 16, projets: 2 },
      { mois: 'Juin', reclamations: 20, projets: 3 }
    ];

    return {
      tauxSatisfaction,
      reclamationsRecues: totalReclamations,
      reclamationsTraitees,
      projetsActifs,
      projetsTermines,
      sujetsPopulaires,
      tendanceMensuelle
    };
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