export interface Societe {
  id: number;
  nom: string;
  adresse?: string;
  telephone: string;
  email: string;
  personne_contact?: string;
  date_creation: string;
}