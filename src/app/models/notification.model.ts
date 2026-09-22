import { Facture } from './facture.model';

export interface NotificationsFacturesEnAttente {
  estFinDeMois: boolean;
  count: number;
  factures: Facture[];
}