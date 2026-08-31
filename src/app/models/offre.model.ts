export interface RessourceOffre {
  id: number;
  offre_id: number;
  ressource_cloud: string;
  type_service?: string;
  quantite: number;
  unite: string;
  prix_unitaire: number;
  description?: string;
}

export enum StatutOffre {
  ACTIVE = 'active',
  ARCHIVEE = 'archivee',
}

export interface OffreFinanciere {
  id: number;
  projet_id: number;
  version: number;
  nom_fichier_original: string;
  statut: StatutOffre;
  ressources: RessourceOffre[];
  date_import: string;
}