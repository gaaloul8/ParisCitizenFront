import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CitoyenAdmin, AgentMunicipal, Municipalite } from '../../../services/admin.service';

export type EditModalDataType = CitoyenAdmin | AgentMunicipal | Municipalite;
export type EditModalType = 'citoyen' | 'agent' | 'municipalite';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() data: EditModalDataType | null = null;
  @Input() type: EditModalType = 'citoyen';
  @Input() municipalites: any[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveChanges = new EventEmitter<{type: EditModalType, data: EditModalDataType}>();

  isSubmitting = false;
  editedData: any = {};

  constructor() {}

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Réinitialiser les données quand le modal s'ouvre ou quand les données changent
    if (changes['data'] || changes['isOpen']) {
      this.initializeData();
    }
  }

  private initializeData(): void {
    if (this.data && this.isOpen) {
      // Créer une copie profonde des données
      this.editedData = JSON.parse(JSON.stringify(this.data));
      console.log('Données initialisées dans le modal:', this.editedData);
      console.log('Type:', this.type);
    } else {
      console.log('Pas de données à initialiser ou modal fermé');
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onSave(): void {
    this.isSubmitting = true;
    this.saveChanges.emit({
      type: this.type,
      data: this.editedData
    });
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
