import { Injectable } from '@angular/core';

export interface Projet {
  id: number;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  statut: 'en_cours' | 'termine' | 'planifie';
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
  statut: 'en_attente' | 'en_cours' | 'traitee' | 'rejetee';
  priorite: 'basse' | 'moyenne' | 'haute';
  arrondissement: string;
  localisation: string;
  type: 'voirie' | 'eclairage' | 'dechets' | 'espaces_verts' | 'transport' | 'autre';
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
  
  // Fake data pour les projets
  private projets: Projet[] = [
    {
      id: 1,
      titre: "Jardins partagés du 15ème",
      description: "Création d'espaces verts communautaires pour favoriser le lien social et l'écologie urbaine.",
      dateDebut: "2024-03-01",
      dateFin: "2024-12-31",
      statut: "en_cours",
      arrondissement: "15ème",
      responsable: "Marie Dubois",
      budget: 25000,
      participants: 45
    },
    {
      id: 2,
      titre: "Ateliers numériques seniors",
      description: "Formation à l'usage des outils numériques pour les personnes âgées du quartier.",
      dateDebut: "2024-02-15",
      dateFin: "2024-06-15",
      statut: "en_cours",
      arrondissement: "15ème",
      responsable: "Jean Martin",
      budget: 15000,
      participants: 32
    },
    {
      id: 3,
      titre: "Fête de quartier annuelle",
      description: "Organisation de la grande fête de quartier avec animations, concerts et stands associatifs.",
      dateDebut: "2024-06-01",
      dateFin: "2024-07-31",
      statut: "planifie",
      arrondissement: "15ème",
      responsable: "Sophie Laurent",
      budget: 35000,
      participants: 120
    },
    {
      id: 4,
      titre: "Soutien scolaire bénévole",
      description: "Accompagnement scolaire gratuit pour les enfants en difficulté.",
      dateDebut: "2023-09-01",
      dateFin: "2024-06-30",
      statut: "termine",
      arrondissement: "15ème",
      responsable: "Pierre Moreau",
      budget: 8000,
      participants: 28
    }
  ];

  // Fake data pour les établissements
  private etablissements: Etablissement[] = [
    {
      id: 1,
      nom: "École élémentaire Voltaire",
      type: "ecole",
      adresse: "25 Rue Voltaire, 75015 Paris",
      telephone: "01 45 32 15 67",
      email: "contact@ecole-voltaire15.fr",
      horaires: "Lun-Ven 8h30-16h30",
      description: "École élémentaire publique avec cantine et garderie",
      arrondissement: "15ème",
      siteWeb: "www.ecole-voltaire15.fr"
    },
    {
      id: 2,
      nom: "Hôpital Necker-Enfants malades",
      type: "hopital",
      adresse: "149 Rue de Sèvres, 75015 Paris",
      telephone: "01 44 49 40 00",
      email: "contact@hopital-necker.fr",
      horaires: "24h/24, 7j/7",
      description: "Hôpital pédiatrique de référence",
      arrondissement: "15ème",
      siteWeb: "www.hopital-necker.fr"
    },
    {
      id: 3,
      nom: "Mairie du 15ème arrondissement",
      type: "mairie",
      adresse: "31 Rue Péclet, 75015 Paris",
      telephone: "01 55 76 75 15",
      email: "contact@mairie15.paris.fr",
      horaires: "Lun-Ven 8h30-17h, Sam 9h-12h",
      description: "Mairie d'arrondissement - Services administratifs",
      arrondissement: "15ème",
      siteWeb: "www.mairie15.paris.fr"
    },
    {
      id: 4,
      nom: "Association Solidarité 15ème",
      type: "association",
      adresse: "12 Avenue Félix Faure, 75015 Paris",
      telephone: "01 42 50 23 45",
      email: "contact@solidarite15.fr",
      horaires: "Lun-Ven 9h-18h",
      description: "Association d'aide aux personnes en difficulté",
      arrondissement: "15ème",
      siteWeb: "www.solidarite15.fr"
    },
    {
      id: 5,
      nom: "Centre culturel Beaugrenelle",
      type: "culturel",
      adresse: "8 Rue Linois, 75015 Paris",
      telephone: "01 56 58 42 00",
      email: "info@centre-beaugrenelle.fr",
      horaires: "Mar-Sam 10h-19h, Dim 14h-18h",
      description: "Centre culturel avec expositions et ateliers",
      arrondissement: "15ème",
      siteWeb: "www.centre-beaugrenelle.fr"
    },
    {
      id: 6,
      nom: "Complexe sportif Suzanne Lenglen",
      type: "sportif",
      adresse: "2 Rue du Commandant Guilbaud, 75015 Paris",
      telephone: "01 45 67 89 01",
      email: "contact@suzanne-lenglen.fr",
      horaires: "Lun-Dim 6h-23h",
      description: "Complexe sportif avec piscine, tennis et fitness",
      arrondissement: "15ème",
      siteWeb: "www.suzanne-lenglen.fr"
    }
  ];

  // Fake data pour les réclamations
  private reclamations: Reclamation[] = [
    {
      id: 1,
      sujet: "Éclairage défaillant",
      description: "L'éclairage public de la rue de la Convention ne fonctionne plus depuis 3 jours, créant un problème de sécurité.",
      dateCreation: "2024-01-15",
      statut: "traitee",
      priorite: "haute",
      arrondissement: "15ème",
      localisation: "Rue de la Convention, 75015 Paris",
      type: "eclairage"
    },
    {
      id: 2,
      sujet: "Nid-de-poule dangereux",
      description: "Grand trou dans la chaussée avenue Émile Zola, près du métro La Motte-Picquet.",
      dateCreation: "2024-01-10",
      statut: "en_cours",
      priorite: "moyenne",
      arrondissement: "15ème",
      localisation: "Avenue Émile Zola, 75015 Paris",
      type: "voirie"
    },
    {
      id: 3,
      sujet: "Poubelles débordantes",
      description: "Les poubelles du square Saint-Lambert sont pleines et débordent depuis plusieurs jours.",
      dateCreation: "2024-01-08",
      statut: "en_attente",
      priorite: "basse",
      arrondissement: "15ème",
      localisation: "Square Saint-Lambert, 75015 Paris",
      type: "dechets"
    },
    {
      id: 4,
      sujet: "Banc cassé dans le parc",
      description: "Un banc du parc Georges Brassens est cassé et représente un danger pour les enfants.",
      dateCreation: "2024-01-05",
      statut: "traitee",
      priorite: "moyenne",
      arrondissement: "15ème",
      localisation: "Parc Georges Brassens, 75015 Paris",
      type: "espaces_verts"
    }
  ];

  // Messages du chatbot
  private messagesChatbot: MessageChatbot[] = [];

  constructor() { }

  // Méthodes pour les projets
  getProjets(): Projet[] {
    return this.projets;
  }

  getProjetById(id: number): Projet | undefined {
    return this.projets.find(p => p.id === id);
  }

  // Méthodes pour les établissements
  getEtablissements(): Etablissement[] {
    return this.etablissements;
  }

  getEtablissementsByType(type: string): Etablissement[] {
    return this.etablissements.filter(e => e.type === type);
  }

  getEtablissementById(id: number): Etablissement | undefined {
    return this.etablissements.find(e => e.id === id);
  }

  // Méthodes pour les réclamations
  getReclamations(): Reclamation[] {
    return this.reclamations;
  }

  getReclamationsByStatut(statut: string): Reclamation[] {
    return this.reclamations.filter(r => r.statut === statut);
  }

  ajouterReclamation(reclamation: Omit<Reclamation, 'id'>): Reclamation {
    const nouvelleReclamation: Reclamation = {
      ...reclamation,
      id: this.reclamations.length + 1
    };
    this.reclamations.unshift(nouvelleReclamation);
    return nouvelleReclamation;
  }

  // Méthodes pour le chatbot
  getMessages(agent: string): MessageChatbot[] {
    return this.messagesChatbot.filter(m => m.agent === agent);
  }

  ajouterMessage(contenu: string, agent: string): MessageChatbot {
    const message: MessageChatbot = {
      id: this.messagesChatbot.length + 1,
      contenu,
      expediteur: 'user',
      timestamp: new Date(),
      agent: agent as 'etablissement' | 'projet' | 'reclamation'
    };
    this.messagesChatbot.push(message);
    return message;
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
      id: this.messagesChatbot.length + 1,
      contenu: reponse,
      expediteur: 'bot',
      timestamp: new Date(),
      agent: agent as 'etablissement' | 'projet' | 'reclamation'
    };
    this.messagesChatbot.push(messageReponse);
    return messageReponse;
  }

  private getReponseEtablissement(message: string): string {
    const msg = message.toLowerCase();
    
    if (msg.includes('école') || msg.includes('ecole')) {
      return "Voici les écoles du 15ème : École élémentaire Voltaire (25 Rue Voltaire). Pour plus d'informations, contactez-les au 01 45 32 15 67.";
    }
    if (msg.includes('hôpital') || msg.includes('hopital')) {
      return "L'hôpital de référence du 15ème est Necker-Enfants malades (149 Rue de Sèvres). Téléphone : 01 44 49 40 00.";
    }
    if (msg.includes('mairie')) {
      return "La mairie du 15ème est située 31 Rue Péclet. Ouverte Lun-Ven 8h30-17h, Sam 9h-12h. Tél: 01 55 76 75 15.";
    }
    if (msg.includes('association')) {
      return "L'Association Solidarité 15ème aide les personnes en difficulté. Adresse : 12 Avenue Félix Faure. Tél: 01 42 50 23 45.";
    }
    
    return "Je peux vous renseigner sur les écoles, hôpitaux, mairies et associations du 15ème arrondissement. Que souhaitez-vous savoir ?";
  }

  private getReponseProjet(message: string): string {
    const msg = message.toLowerCase();
    
    if (msg.includes('jardin') || msg.includes('vert')) {
      return "Le projet 'Jardins partagés du 15ème' est en cours ! Il crée des espaces verts communautaires. Contact : Marie Dubois.";
    }
    if (msg.includes('senior') || msg.includes('numérique') || msg.includes('numerique')) {
      return "Les 'Ateliers numériques seniors' forment les personnes âgées aux outils numériques. Responsable : Jean Martin.";
    }
    if (msg.includes('fête') || msg.includes('fete') || msg.includes('événement')) {
      return "La 'Fête de quartier annuelle' est planifiée pour juin-juillet 2024 avec animations et concerts !";
    }
    if (msg.includes('soutien') || msg.includes('scolaire')) {
      return "Le projet 'Soutien scolaire bénévole' est terminé. Il a aidé 28 enfants en difficulté pendant l'année scolaire.";
    }
    
    return "Je peux vous renseigner sur les projets sociaux du 15ème : jardins partagés, ateliers numériques, fête de quartier, soutien scolaire. Que vous intéresse ?";
  }

  private getReponseReclamation(message: string): string {
    const msg = message.toLowerCase();
    
    if (msg.includes('éclairage') || msg.includes('eclairage')) {
      return "Pour signaler un problème d'éclairage, contactez les services techniques au 01 55 76 75 15 ou utilisez le formulaire en ligne.";
    }
    if (msg.includes('route') || msg.includes('trou') || msg.includes('nid')) {
      return "Pour les problèmes de voirie (nids-de-poule, chaussée dégradée), signalez au service des routes : 01 55 76 75 20.";
    }
    if (msg.includes('poubelle') || msg.includes('déchet') || msg.includes('dechet')) {
      return "Pour les problèmes de collecte des déchets, contactez le service propreté au 01 55 76 75 25.";
    }
    if (msg.includes('parc') || msg.includes('jardin') || msg.includes('arbre')) {
      return "Pour les espaces verts et parcs, contactez le service des espaces verts au 01 55 76 75 30.";
    }
    
    return "Je peux vous aider à signaler des problèmes d'éclairage, voirie, déchets ou espaces verts. Quel est le problème que vous rencontrez ?";
  }
}