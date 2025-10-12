import { Injectable } from '@angular/core';

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
  
  // Fake data pour les municipalités
  private municipalites: Municipalite[] = [
    {
      id: 1,
      nom: "Mairie du 1er arrondissement",
      region: "Île-de-France",
      codePostal: "75001",
      nombreAgents: 25,
      nombreCitoyens: 16800,
      nombreProjets: 12,
      tauxSatisfaction: 87,
      budgetAnnuel: 4500000,
      dateCreation: "2020-01-15",
      statut: "active"
    },
    {
      id: 2,
      nom: "Mairie du 15ème arrondissement",
      region: "Île-de-France",
      codePostal: "75015",
      nombreAgents: 45,
      nombreCitoyens: 236000,
      nombreProjets: 28,
      tauxSatisfaction: 92,
      budgetAnnuel: 12000000,
      dateCreation: "2019-09-01",
      statut: "active"
    },
    {
      id: 3,
      nom: "Mairie du 20ème arrondissement",
      region: "Île-de-France",
      codePostal: "75020",
      nombreAgents: 38,
      nombreCitoyens: 196000,
      nombreProjets: 22,
      tauxSatisfaction: 85,
      budgetAnnuel: 9800000,
      dateCreation: "2020-03-10",
      statut: "active"
    },
    {
      id: 4,
      nom: "Mairie du 11ème arrondissement",
      region: "Île-de-France",
      codePostal: "75011",
      nombreAgents: 32,
      nombreCitoyens: 154000,
      nombreProjets: 18,
      tauxSatisfaction: 89,
      budgetAnnuel: 8200000,
      dateCreation: "2021-01-20",
      statut: "active"
    },
    {
      id: 5,
      nom: "Mairie du 18ème arrondissement",
      region: "Île-de-France",
      codePostal: "75018",
      nombreAgents: 28,
      nombreCitoyens: 198000,
      nombreProjets: 15,
      tauxSatisfaction: 83,
      budgetAnnuel: 7500000,
      dateCreation: "2020-11-05",
      statut: "maintenance"
    }
  ];

  // Fake data pour les agents municipaux
  private agents: AgentMunicipal[] = [
    {
      id: 1,
      nom: "Martin",
      prenom: "Jean",
      email: "jean.martin@mairie15.paris.fr",
      telephone: "01 55 76 75 15",
      municipalite: "15ème arrondissement",
      poste: "Responsable réclamations",
      dateEmbauche: "2019-03-15",
      statut: "actif",
      nombreReclamationsTraitees: 156,
      noteSatisfaction: 4.2
    },
    {
      id: 2,
      nom: "Dubois",
      prenom: "Marie",
      email: "marie.dubois@mairie1.paris.fr",
      telephone: "01 42 36 13 01",
      municipalite: "1er arrondissement",
      poste: "Gestionnaire projets",
      dateEmbauche: "2020-01-10",
      statut: "actif",
      nombreReclamationsTraitees: 89,
      noteSatisfaction: 4.5
    },
    {
      id: 3,
      nom: "Moreau",
      prenom: "Pierre",
      email: "pierre.moreau@mairie20.paris.fr",
      telephone: "01 43 66 99 20",
      municipalite: "20ème arrondissement",
      poste: "Coordinateur social",
      dateEmbauche: "2018-09-01",
      statut: "actif",
      nombreReclamationsTraitees: 203,
      noteSatisfaction: 4.7
    },
    {
      id: 4,
      nom: "Laurent",
      prenom: "Sophie",
      email: "sophie.laurent@mairie11.paris.fr",
      telephone: "01 53 36 99 11",
      municipalite: "11ème arrondissement",
      poste: "Responsable communication",
      dateEmbauche: "2021-02-14",
      statut: "actif",
      nombreReclamationsTraitees: 67,
      noteSatisfaction: 4.1
    },
    {
      id: 5,
      nom: "Bernard",
      prenom: "Claude",
      email: "claude.bernard@mairie18.paris.fr",
      telephone: "01 53 41 18 18",
      municipalite: "18ème arrondissement",
      poste: "Agent de terrain",
      dateEmbauche: "2017-06-20",
      statut: "inactif",
      nombreReclamationsTraitees: 134,
      noteSatisfaction: 3.8
    }
  ];

  // Fake data pour les citoyens (échantillon)
  private citoyens: CitoyenAdmin[] = [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Marie",
      email: "marie.dupont@email.com",
      age: 34,
      commune: "15ème arrondissement",
      dateInscription: "2023-01-15",
      nombreReclamations: 3,
      nombreProjetsParticipes: 2,
      statut: "actif",
      derniereActivite: "2024-01-10"
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Jean",
      email: "jean.martin@email.com",
      age: 28,
      commune: "1er arrondissement",
      dateInscription: "2023-03-22",
      nombreReclamations: 1,
      nombreProjetsParticipes: 0,
      statut: "actif",
      derniereActivite: "2024-01-08"
    },
    {
      id: 3,
      nom: "Bernard",
      prenom: "Sophie",
      email: "sophie.bernard@email.com",
      age: 45,
      commune: "20ème arrondissement",
      dateInscription: "2022-11-10",
      nombreReclamations: 7,
      nombreProjetsParticipes: 4,
      statut: "actif",
      derniereActivite: "2024-01-12"
    },
    {
      id: 4,
      nom: "Moreau",
      prenom: "Pierre",
      email: "pierre.moreau@email.com",
      age: 52,
      commune: "11ème arrondissement",
      dateInscription: "2022-08-05",
      nombreReclamations: 2,
      nombreProjetsParticipes: 3,
      statut: "actif",
      derniereActivite: "2023-12-20"
    },
    {
      id: 5,
      nom: "Durand",
      prenom: "Claire",
      email: "claire.durand@email.com",
      age: 29,
      commune: "18ème arrondissement",
      dateInscription: "2023-06-18",
      nombreReclamations: 4,
      nombreProjetsParticipes: 1,
      statut: "actif",
      derniereActivite: "2024-01-05"
    },
    {
      id: 6,
      nom: "Leroy",
      prenom: "Michel",
      email: "michel.leroy@email.com",
      age: 61,
      commune: "15ème arrondissement",
      dateInscription: "2021-04-12",
      nombreReclamations: 1,
      nombreProjetsParticipes: 0,
      statut: "inactif",
      derniereActivite: "2023-08-15"
    },
    {
      id: 7,
      nom: "Petit",
      prenom: "Isabelle",
      email: "isabelle.petit@email.com",
      age: 38,
      commune: "20ème arrondissement",
      dateInscription: "2023-09-30",
      nombreReclamations: 5,
      nombreProjetsParticipes: 2,
      statut: "actif",
      derniereActivite: "2024-01-14"
    }
  ];

  constructor() { }

  // Méthodes pour les municipalités
  getMunicipalites(): Municipalite[] {
    return this.municipalites;
  }

  getMunicipaliteById(id: number): Municipalite | undefined {
    return this.municipalites.find(m => m.id === id);
  }

  ajouterMunicipalite(municipalite: Omit<Municipalite, 'id'>): Municipalite {
    const nouvelleMunicipalite: Municipalite = {
      ...municipalite,
      id: this.municipalites.length + 1
    };
    this.municipalites.push(nouvelleMunicipalite);
    return nouvelleMunicipalite;
  }

  // Méthodes pour les agents
  getAgents(): AgentMunicipal[] {
    return this.agents;
  }

  getAgentsByMunicipalite(municipalite: string): AgentMunicipal[] {
    return this.agents.filter(a => a.municipalite === municipalite);
  }

  getAgentById(id: number): AgentMunicipal | undefined {
    return this.agents.find(a => a.id === id);
  }

  // Méthodes pour les citoyens
  getCitoyens(): CitoyenAdmin[] {
    return this.citoyens;
  }

  getCitoyensByCommune(commune: string): CitoyenAdmin[] {
    return this.citoyens.filter(c => c.commune === commune);
  }

  getCitoyenById(id: number): CitoyenAdmin | undefined {
    return this.citoyens.find(c => c.id === id);
  }

  // Statistiques globales
  getStatistiquesGlobales(): StatistiquesGlobales {
    const totalCitoyens = this.citoyens.length;
    const moyenneAge = Math.round(
      this.citoyens.reduce((sum, c) => sum + c.age, 0) / totalCitoyens
    );
    const totalMunicipalites = this.municipalites.length;
    const totalAgents = this.agents.filter(a => a.statut === 'actif').length;
    const totalProjets = this.municipalites.reduce((sum, m) => sum + m.nombreProjets, 0);
    const totalReclamations = this.citoyens.reduce((sum, c) => sum + c.nombreReclamations, 0);
    const tauxSatisfactionGlobal = Math.round(
      this.municipalites.reduce((sum, m) => sum + m.tauxSatisfaction, 0) / totalMunicipalites
    );

    // Activité mensuelle (simulée)
    const activiteMensuelle = [
      { mois: 'Jan', nouveauxCitoyens: 45, nouvellesReclamations: 89, projetsLances: 3 },
      { mois: 'Fév', nouveauxCitoyens: 38, nouvellesReclamations: 76, projetsLances: 2 },
      { mois: 'Mar', nouveauxCitoyens: 52, nouvellesReclamations: 94, projetsLances: 4 },
      { mois: 'Avr', nouveauxCitoyens: 41, nouvellesReclamations: 82, projetsLances: 2 },
      { mois: 'Mai', nouveauxCitoyens: 48, nouvellesReclamations: 91, projetsLances: 3 },
      { mois: 'Juin', nouveauxCitoyens: 55, nouvellesReclamations: 105, projetsLances: 5 }
    ];

    // Top municipalités par satisfaction
    const topMunicipalites = this.municipalites
      .map(m => ({
        nom: m.nom,
        tauxSatisfaction: m.tauxSatisfaction,
        nombreReclamations: Math.round(m.nombreCitoyens * 0.15) // Estimation
      }))
      .sort((a, b) => b.tauxSatisfaction - a.tauxSatisfaction)
      .slice(0, 5);

    // Répartition par âge
    const repartitionParAge = [
      { tranche: '18-25 ans', nombre: 2, pourcentage: 29 },
      { tranche: '26-35 ans', nombre: 3, pourcentage: 43 },
      { tranche: '36-45 ans', nombre: 1, pourcentage: 14 },
      { tranche: '46-55 ans', nombre: 1, pourcentage: 14 },
      { tranche: '55+ ans', nombre: 0, pourcentage: 0 }
    ];

    return {
      totalCitoyens,
      moyenneAge,
      totalMunicipalites,
      totalAgents,
      totalProjets,
      totalReclamations,
      tauxSatisfactionGlobal,
      activiteMensuelle,
      topMunicipalites,
      repartitionParAge
    };
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