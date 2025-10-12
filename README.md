# ParisCitizen - Plateforme Citoyenne Intelligente

ParisCitizen est une application citoyenne intelligente qui vise à rapprocher les habitants de Paris de leurs municipalités. Cette plateforme permet aux citoyens de signaler des problèmes, découvrir des projets sociaux, et échanger avec leur mairie de manière moderne et accessible.

## 🎯 Fonctionnalités Implémentées

### Interface Citoyenne Complète
- **Dashboard Citoyen** : Vue d'ensemble personnalisée avec informations utilisateur
- **Projets** : Consultation des projets sociaux locaux avec filtres par statut
- **Établissements** : Annuaire des établissements publics (écoles, hôpitaux, mairies, associations)
- **Mes Réclamations** : Gestion des signalements avec création de nouvelles réclamations
- **Chatbot Multi-Agent** : Interface de chat avec 3 agents spécialisés (Établissement, Projet Social, Réclamation)
- **Profil** : Gestion du profil citoyen avec édition des informations

### Interface Agent Municipal Complète
- **Dashboard Agent** : Statistiques détaillées avec KPIs (taux de satisfaction, réclamations, projets)
- **Gestion des Projets** : Création, modification et suivi des projets sociaux
- **Gestion des Réclamations** : Traitement et suivi des réclamations citoyennes
- **Profil Agent** : Gestion du profil et préférences de l'agent municipal

### Interface Administrateur Complète
- **Dashboard Admin** : Vue globale avec statistiques consolidées et KPIs
- **Gestion des Municipalités** : Supervision et gestion de toutes les municipalités
- **Gestion des Agents** : Administration des agents municipaux avec filtres et statistiques
- **Gestion des Citoyens** : Supervision de tous les citoyens avec données détaillées
- **Paramètres Système** : Configuration complète de la plateforme

### Authentification et Sécurité
- **Système d'authentification** avec 3 rôles : Admin, Agent Municipal, Citoyen
- **Utilisateurs statiques** pour la démonstration
- **Gestion des sessions** avec localStorage
- **Protection des routes** selon le rôle utilisateur

## 🏗️ Structure du Projet

```
src/app/
├── components/
│   ├── home/                    # Page d'accueil
│   ├── register/                # Inscription citoyen
│   ├── login/                   # Connexion multi-rôles
│   ├── dashboard-admin/         # Dashboard administrateur
│   ├── dashboard-agent/         # Dashboard agent municipal
│   ├── dashboard-citoyen/       # Dashboard citoyen
│   ├── citoyen/                 # Interface citoyenne
│   │   ├── projets/            # Consultation projets
│   │   ├── etablissements/     # Annuaire établissements
│   │   ├── mes-reclamations/   # Gestion réclamations
│   │   ├── chatbot/            # Chat multi-agent
│   │   └── profil/             # Profil citoyen
│   ├── agent/                   # Interface agent municipal
│   │   ├── dashboard-agent/     # Dashboard avec statistiques
│   │   ├── projets-agent/       # Gestion projets
│   │   ├── reclamations-agent/  # Gestion réclamations
│   │   └── profil-agent/        # Profil agent
│   └── admin/                   # Interface administrateur
│       ├── municipalites-admin/ # Gestion municipalités
│       ├── agents-admin/        # Gestion agents
│       ├── citoyens-admin/      # Gestion citoyens
│       └── parametres-admin/    # Paramètres système
├── services/
│   ├── auth.service.ts          # Gestion authentification
│   ├── citoyen.service.ts       # Données citoyen
│   ├── agent.service.ts         # Données agent municipal
│   └── admin.service.ts         # Données administrateur
└── app-routing.module.ts        # Configuration routing
```

## 🎨 Design et UX

### Interface Citoyenne
- **Navbar horizontale** avec navigation fluide
- **Design moderne et épuré** avec palette de couleurs claire
- **Cartes interactives** pour projets et établissements
- **Interface chatbot** intuitive avec agents spécialisés
- **Formulaires réactifs** avec validation

### Interface Agent Municipal
- **Sidebar fixe** avec navigation verticale
- **Layout professionnel** avec statistiques visuelles
- **Tableaux de gestion** pour projets et réclamations
- **Graphiques et KPIs** pour le suivi de performance
- **Modal détaillée** pour les réclamations

### Interface Administrateur
- **Sidebar sombre** avec navigation administrative
- **Vue d'ensemble globale** avec statistiques consolidées
- **Tableaux de gestion** pour municipalités, agents et citoyens
- **Interface de paramètres** complète avec configuration système
- **Graphiques avancés** pour l'analyse des données

### Responsive Design
- **Mobile-first** approach
- **Adaptation automatique** sur tous les écrans
- **Navigation optimisée** pour mobile et desktop

## 🔧 Technologies Utilisées

- **Angular 15** : Framework principal
- **TypeScript** : Langage de développement
- **CSS3** : Styling pur (pas de framework CSS)
- **Angular Router** : Navigation SPA
- **Reactive Forms** : Gestion des formulaires
- **RxJS** : Programmation réactive

## 🚀 Installation et Utilisation

### Prérequis
- Node.js (version 16 ou supérieure)
- Angular CLI
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [url-du-repo]
cd paris

# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve

# L'application sera disponible sur http://localhost:4200
```

### Comptes de Test

#### Administrateur
- **Username** : `admin`
- **Password** : `admin`

#### Agent Municipal
- **Username** : `agent`
- **Password** : `agent`

#### Citoyen
- **Username** : `citoyen`
- **Password** : `citoyen`

## 📊 Données Simulées

### Interface Citoyenne
- **Projets** : 8 projets sociaux variés avec différents statuts
- **Établissements** : 12 établissements (écoles, hôpitaux, mairies, associations)
- **Réclamations** : Historique des réclamations du citoyen connecté

### Interface Agent Municipal
- **Statistiques** : KPIs calculés dynamiquement
- **Projets** : 4 projets avec gestion complète des statuts
- **Réclamations** : 5 réclamations avec priorités et statuts
- **Analytics** : Sujets populaires et tendances mensuelles

## 🎯 Fonctionnalités Clés

### Pour les Citoyens
- ✅ **Navigation intuitive** entre toutes les sections
- ✅ **Consultation projets** avec filtres et recherche
- ✅ **Découverte établissements** par type et localisation
- ✅ **Création réclamations** avec formulaire complet
- ✅ **Chat multi-agent** avec réponses simulées
- ✅ **Gestion profil** avec édition des informations

### Pour les Agents Municipaux
- ✅ **Dashboard analytique** avec statistiques en temps réel
- ✅ **Gestion projets** complète (création, modification, statuts)
- ✅ **Traitement réclamations** avec priorités et commentaires
- ✅ **Suivi performance** avec KPIs et graphiques
- ✅ **Interface professionnelle** avec sidebar dédiée

### Pour les Administrateurs
- ✅ **Vue globale** avec statistiques consolidées de toutes les municipalités
- ✅ **Gestion municipalités** complète (ajout, modification, statuts)
- ✅ **Supervision agents** avec filtres et statistiques de performance
- ✅ **Administration citoyens** avec données détaillées et activité
- ✅ **Configuration système** avec paramètres avancés et monitoring

## 🔮 Prochaines Étapes

### Phase 2 - Backend et Base de Données
- [ ] Intégration base de données PostgreSQL
- [ ] API REST avec Node.js/Express
- [ ] Authentification JWT
- [ ] Upload de fichiers (photos réclamations)
- [ ] Notifications push

### Phase 3 - Fonctionnalités Avancées
- [ ] Géolocalisation des réclamations
- [ ] Chatbot IA avec NLP
- [ ] Système de notifications email/SMS
- [ ] Rapports PDF automatisés
- [ ] Interface administrateur complète

### Phase 4 - Optimisations
- [ ] Tests unitaires et d'intégration
- [ ] Optimisation performances
- [ ] Sécurité renforcée
- [ ] Monitoring et logs
- [ ] Déploiement production

## 📝 Notes de Développement

- **CSS Pur** : Aucun framework CSS utilisé, styles personnalisés
- **TypeScript Strict** : Configuration stricte pour la qualité du code
- **Architecture Modulaire** : Composants réutilisables et services séparés
- **Responsive Design** : Adaptation automatique mobile/desktop
- **Accessibilité** : Respect des standards WCAG

## 👥 Équipe de Développement

Projet développé avec Angular 15, TypeScript et CSS3 pur pour une expérience utilisateur moderne et professionnelle.

---

**ParisCitizen** - Connecter les citoyens à leur municipalité 🏛️✨