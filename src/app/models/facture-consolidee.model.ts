import { Societe } from './societe.model';
import { Facture, TypePeriode } from './facture.model';

export interface FactureConsolidee {
  id: number;
  societe_id: number;
  societe?: Societe;
  type_periode: TypePeriode;
  annee: number;
  numero_periode: number;
  montant_total: number;
  factures: Facture[];
  date_creation: string;
}