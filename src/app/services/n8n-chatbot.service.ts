import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface N8nChatbotRequest {
  message: string;
  agent: string;
  userId?: string;
  sessionId?: string;
}

export interface N8nChatbotResponse {
  response: string;
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class N8nChatbotService {
  private n8nWebhookUrlReclamation = 'http://localhost:5678/webhook-test/chatbot3';
  private n8nWebhookUrlProjet = 'http://localhost:5678/webhook-test/chatbot2';
  private n8nWebhookUrlEtablissement = 'http://localhost:5678/webhook-test/chatbot1';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Envoie un message au chatbot n8n et récupère la réponse
   */
  sendMessage(request: N8nChatbotRequest): Observable<N8nChatbotResponse> {
    console.log('Envoi du message à n8n:', request);
    
    return this.http.post<any>(this.n8nWebhookUrlReclamation, request, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        console.log('Réponse reçue de n8n:', response);
        
        // Adapter la réponse selon le format retourné par n8n
        if (typeof response === 'string') {
          return {
            response: response,
            success: true
          };
        } else if (response && response.response) {
          return {
            response: response.response,
            success: true
          };
        } else if (response && response.message) {
          return {
            response: response.message,
            success: true
          };
        } else {
          return {
            response: 'Désolé, je n\'ai pas pu traiter votre demande.',
            success: false,
            error: 'Format de réponse inattendu'
          };
        }
      }),
      catchError(error => {
        console.error('Erreur lors de l\'appel au webhook n8n:', error);
        return throwError(() => new Error('Erreur de communication avec le chatbot'));
      })
    );
  }

  /**
   * Envoie un message simple au chatbot n8n (en tant que texte)
   */
  sendSimpleMessage(message: string, agent: string = 'reclamation'): Observable<string> {
    console.log('Envoi du message texte à n8n pour l\'agent:', agent);
    
    // Choisir l'URL selon l'agent
    let webhookUrl: string;
    
    if (agent === 'projet') {
      webhookUrl = this.n8nWebhookUrlProjet;
    } else if (agent === 'etablissement') {
      webhookUrl = this.n8nWebhookUrlEtablissement;
    } else {
      webhookUrl = this.n8nWebhookUrlReclamation;
    }
    
    console.log('URL du webhook:', webhookUrl);
    console.log('Méthode HTTP: POST');
    
    // Utiliser POST pour les deux agents
    const request$ = this.http.post<any>(webhookUrl, message, {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain'
      })
    });
    
    return request$.pipe(
      map(response => {
        console.log('=== RÉPONSE N8N DÉTAILLÉE ===');
        console.log('Réponse brute:', response);
        console.log('Type de réponse:', typeof response);
        console.log('Est null:', response === null);
        console.log('Est undefined:', response === undefined);
        console.log('Est vide:', response === '');
        console.log('Propriétés de l\'objet:', response ? Object.keys(response) : 'N/A');
        console.log('================================');
        
        // Gérer différents formats de réponse de n8n
        let responseText = '';
        
        if (response === null || response === undefined) {
          console.log('Réponse null/undefined détectée');
          responseText = 'Désolé, je n\'ai pas reçu de réponse valide.';
        } else if (typeof response === 'string') {
          // Si c'est déjà du texte
          console.log('Réponse de type string:', response);
          responseText = response;
        } else if (response && typeof response === 'object') {
          console.log('Réponse de type object, propriétés:', Object.keys(response));
          // Si n8n retourne un objet JSON
          if (response.output) {
            console.log('Propriété output trouvée:', response.output);
            responseText = response.output;
          } else if (response.text) {
            console.log('Propriété text trouvée:', response.text);
            responseText = response.text;
          } else if (response.message) {
            console.log('Propriété message trouvée:', response.message);
            responseText = response.message;
          } else if (response.response) {
            console.log('Propriété response trouvée:', response.response);
            responseText = response.response;
          } else {
            console.log('Aucune propriété texte trouvée, conversion en JSON');
            // Si c'est un objet complexe, le convertir en string
            responseText = JSON.stringify(response);
          }
        } else {
          console.log('Réponse de type inconnu:', typeof response);
          responseText = String(response);
        }
        
        console.log('Texte final extrait:', responseText);
        return responseText;
      }),
      catchError(error => {
        console.error('Erreur lors de l\'appel au webhook n8n:', error);
        return throwError(() => new Error('Erreur de communication avec le chatbot'));
      })
    );
  }

  /**
   * Génère un ID de session unique
   */
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
