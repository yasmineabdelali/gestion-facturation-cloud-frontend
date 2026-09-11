import { Facture } from './facture.model';
import { TypePeriode } from './facture.model';

export interface FactureConsolidee {
  id: number;
  societe_id: number;
  type_periode: TypePeriode;
  annee: number;
  numero_periode: number;
  montant_total: number;
  factures: Facture[];
  date_creation: string;
}