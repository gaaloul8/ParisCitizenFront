import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CitoyenAdmin, AgentMunicipal, Municipalite } from '../../../services/admin.service';

export type ModalDataType = CitoyenAdmin | AgentMunicipal | Municipalite;
export type ModalType = 'citoyen' | 'agent' | 'municipalite';

@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.css']
})
export class DetailModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() data: ModalDataType | null = null;
  @Input() type: ModalType = 'citoyen';
  @Output() closeModal = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onClose(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  getCitoyenData(): CitoyenAdmin | null {
    return this.type === 'citoyen' ? this.data as CitoyenAdmin : null;
  }

  getAgentData(): AgentMunicipal | null {
    return this.type === 'agent' ? this.data as AgentMunicipal : null;
  }

  getMunicipaliteData(): Municipalite | null {
    return this.type === 'municipalite' ? this.data as Municipalite : null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

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

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'active':
      case 'actif':
        return 'statut-active';
      case 'inactive':
      case 'inactif':
        return 'statut-inactive';
      case 'maintenance':
      case 'suspendu':
        return 'statut-warning';
      default:
        return 'statut-default';
    }
  }

  getStars(note: number): string[] {
    const stars = [];
    const fullStars = Math.floor(note);
    const hasHalfStar = note % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if (hasHalfStar) {
      stars.push('☆');
    }
    
    // Compléter jusqu'à 5 étoiles
    while (stars.length < 5) {
      stars.push('☆');
    }
    
    return stars;
  }

  getBadgeClass(nombre: number): string {
    if (nombre === 0) return 'badge-zero';
    if (nombre <= 2) return 'badge-low';
    if (nombre <= 5) return 'badge-medium';
    return 'badge-high';
  }
}
