import { Devise } from './devise.model';
export interface Societe {
  id: number;
  nom: string;
  adresse?: string;
  telephone: string;
  email: string;
  personne_contact?: string;
    devise: Devise;

  date_creation: string;
}