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
    if (!currentUser || currentUser.role !== 'citoyen') {
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
    this.citoyenService.ajouterMessage(this.currentMessage, this.selectedAgent);
    
    // Simuler la frappe du bot
    this.isTyping = true;
    this.scrollToBottom();
    
    // Simuler une réponse après 1-2 secondes
    setTimeout(() => {
      const response = this.citoyenService.getReponseChatbot(this.currentMessage, this.selectedAgent);
      this.isTyping = false;
      this.scrollToBottom();
    }, 1500);

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