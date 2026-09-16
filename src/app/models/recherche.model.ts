import { Facture, TypePeriode } from './facture.model';
import { FactureConsolidee } from './facture-consolidee.model';

export interface RechercheFiltres {
  client?: string;
  so?: string;
  typePeriode?: TypePeriode;
  annee?: number;
  numeroPeriode?: number;
}

export interface RechercheResultats {
  factures: Facture[];
  facturesConsolidees: FactureConsolidee[];
}