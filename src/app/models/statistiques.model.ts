export interface ConsommationParClient {
  societeId: number;
  nom: string;
  quantiteTotale: number;
  montantTotal: number;
}

export interface ConsommationParRessource {
  ressourceCloud: string;
  unite: string;
  quantiteTotale: number;
  montantTotal: number;
}