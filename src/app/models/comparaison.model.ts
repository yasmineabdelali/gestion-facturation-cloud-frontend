export interface ComparaisonLigne {
  ressource_cloud: string;
  unite: string;
  quantite_prevue: number;
  quantite_reelle: number;
}

export interface ComparaisonResultat {
  facture: {
    id: number;
    type_periode: string;
    annee: number;
    numero_periode: number;
  } | null;
  comparaison: ComparaisonLigne[];
}