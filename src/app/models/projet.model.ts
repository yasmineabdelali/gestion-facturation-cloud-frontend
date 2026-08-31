import { Societe } from './societe.model';

export enum StatutProjet {
  ACTIF = 'actif',
  INACTIF = 'inactif',
  TERMINE = 'termine',
}

export interface Projet {
  id: number;
  numero_so: string;
  nom_projet: string;
  date_debut: string;
  statut: StatutProjet;
  societe_id: number;
  societe?: Societe;
  date_creation: string;
}