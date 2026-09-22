import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationsFacturesEnAttente } from '../models/notification.model';
import { Facture } from '../models/facture.model'; // ← à ajouter

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = 'http://localhost:3000/notifications';

  facturesEnAttente = signal<Facture[]>([]);
  estFinDeMois = signal(false);

  constructor(private http: HttpClient) {}

  charger(): void {
    this.http.get<NotificationsFacturesEnAttente>(`${this.apiUrl}/factures-en-attente`).subscribe({
      next: (data) => {
        this.facturesEnAttente.set(data.factures);
        this.estFinDeMois.set(data.estFinDeMois);
      },
      error: (error: unknown) => {
        console.error('Erreur lors du chargement des notifications', error);
        this.facturesEnAttente.set([]);
        this.estFinDeMois.set(false);
      }
    });
  }

  retirerFacture(id: number): void {
    this.facturesEnAttente.update((liste) => liste.filter((f) => f.id !== id));
  }
}