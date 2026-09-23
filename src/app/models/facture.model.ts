import { Projet } from './projet.model';
import { Devise } from './devise.model';

export enum TypePeriode {
  MENSUELLE = 'mensuelle',
  TRIMESTRIELLE = 'trimestrielle',
  SEMESTRIELLE = 'semestrielle',
}

export enum StatutFacture {
  BROUILLON = 'brouillon',
  VALIDEE = 'validee',
}

export interface LigneFacture {
  id: number;
  facture_id: number;
  ressource_offre_id: number;
  ressource_cloud: string;
  unite: string;
  prix_unitaire: number;
  quantite_consommee: number;
  montant_ligne: number;
}

export interface Facture {
  id: number;
  projet_id: number;
  projet?: Projet;
  type_periode: TypePeriode;
  annee: number;
  numero_periode: number;
  statut: StatutFacture;
  montant_total: number;
  devise: Devise;
  date_validation: string | null;
  lignes: LigneFacture[];
  date_creation: string;
}