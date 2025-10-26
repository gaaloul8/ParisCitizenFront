import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CitoyenService, MessageChatbot } from '../../../services/citoyen.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  
  selectedAgent: string = '';
  currentMessage: string = '';
  isTyping: boolean = false;

  constructor(
    private authService: AuthService,
    private citoyenService: CitoyenService
  ) {}

  ngOnInit(): void {
    // Vérifier que l'utilisateur est bien un citoyen
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role?.toLowerCase() !== 'citoyen') {
      this.authService.logout();
      return;
    }
  }

  selectAgent(agent: string): void {
    this.selectedAgent = agent;
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || !this.selectedAgent) return;

    // Ajouter le message de l'utilisateur
    this.citoyenService.ajouterMessageUtilisateur(this.currentMessage, this.selectedAgent);
    
    // Simuler la frappe du bot
    this.isTyping = true;
    this.scrollToBottom();
    
    // Utiliser n8n pour tous les agents
    console.log('Agent sélectionné:', this.selectedAgent);
    console.log('Type d\'agent:', typeof this.selectedAgent);
    console.log('Comparaison avec "projet":', this.selectedAgent === 'projet');
    console.log('Comparaison avec "reclamation":', this.selectedAgent === 'reclamation');
    console.log('Comparaison avec "etablissement":', this.selectedAgent === 'etablissement');
    
    if (this.selectedAgent === 'reclamation' || this.selectedAgent === 'projet' || this.selectedAgent === 'etablissement') {
      console.log('Utilisation de n8n pour l\'agent:', this.selectedAgent);
      console.log('Envoi du message à n8n:', this.currentMessage);
      this.citoyenService.getReponseChatbotN8n(this.currentMessage, this.selectedAgent).subscribe({
        next: (response) => {
          console.log('=== RÉPONSE N8N ===');
          console.log('Réponse complète:', response);
          console.log('Type de réponse:', typeof response);
          console.log('Contenu de la réponse:', response.contenu);
          console.log('==================');
          
          // Vérifier que le contenu n'est pas vide
          if (response.contenu && response.contenu.trim() !== '') {
            this.citoyenService.ajouterMessage(response.contenu, this.selectedAgent);
            console.log('Message ajouté au chat:', response.contenu);
          } else {
            console.warn('Contenu vide reçu de n8n');
            this.citoyenService.ajouterMessage('Désolé, je n\'ai pas reçu de réponse valide.', this.selectedAgent);
          }
          
          this.isTyping = false;
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Erreur avec le chatbot n8n:', error);
          // Fallback vers la réponse simulée en cas d'erreur
          const fallbackResponse = this.citoyenService.getReponseChatbot(this.currentMessage, this.selectedAgent);
          console.log('Utilisation du fallback:', fallbackResponse.contenu);
          this.citoyenService.ajouterMessage(fallbackResponse.contenu, this.selectedAgent);
          this.isTyping = false;
          this.scrollToBottom();
        }
      });
    } else {
      // Simuler une réponse après 1-2 secondes pour les autres agents
      setTimeout(() => {
        const response = this.citoyenService.getReponseChatbot(this.currentMessage, this.selectedAgent);
        this.citoyenService.ajouterMessage(response.contenu, this.selectedAgent);
        this.isTyping = false;
        this.scrollToBottom();
      }, 1500);
    }

    this.currentMessage = '';
  }

  sendSuggestion(suggestion: string): void {
    this.currentMessage = suggestion;
    this.sendMessage();
  }

  getMessages(agent: string): MessageChatbot[] {
    return this.citoyenService.getMessages(agent);
  }

  getAgentName(agent: string): string {
    switch (agent) {
      case 'etablissement':
        return 'Agent Établissement';
      case 'projet':
        return 'Agent Projet Social';
      case 'reclamation':
        return 'Agent Réclamation';
      default:
        return 'Agent';
    }
  }

  getAgentDescription(agent: string): string {
    switch (agent) {
      case 'etablissement':
        return 'Je peux vous renseigner sur les écoles, hôpitaux, mairies et associations de votre quartier.';
      case 'projet':
        return 'Je vous informe sur les projets sociaux et initiatives citoyennes de votre arrondissement.';
      case 'reclamation':
        return 'Je vous aide à signaler des problèmes et vous guide dans vos réclamations.';
      default:
        return '';
    }
  }

  getAgentIcon(agent: string): string {
    switch (agent) {
      case 'etablissement':
        return '🏢';
      case 'projet':
        return '🎯';
      case 'reclamation':
        return '📋';
      default:
        return '🤖';
    }
  }

  getSuggestions(agent: string): string[] {
    switch (agent) {
      case 'etablissement':
        return [
          'Où se trouve l\'école la plus proche ?',
          'Quels sont les horaires de la mairie ?',
          'Y a-t-il un hôpital dans le quartier ?',
          'Comment contacter les associations locales ?'
        ];
      case 'projet':
        return [
          'Quels projets sont en cours dans mon quartier ?',
          'Comment participer aux jardins partagés ?',
          'Y a-t-il des événements prévus ?',
          'Comment m\'impliquer dans les projets sociaux ?'
        ];
      case 'reclamation':
        return [
          'Comment signaler un problème d\'éclairage ?',
          'Où déposer une réclamation pour la voirie ?',
          'Comment signaler des déchets non collectés ?',
          'Que faire en cas de problème dans un parc ?'
        ];
      default:
        return [];
    }
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatMessages) {
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
      }
    }, 100);
  }

  logout(): void {
    this.authService.logout();
  }
}
