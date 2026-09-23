export enum Devise {
  TND = 'TND',
  EUR = 'EUR',
  USD = 'USD',
}

export const DEVISE_SYMBOLES: Record<Devise, string> = {
  [Devise.TND]: 'TND',
  [Devise.EUR]: '€',
  [Devise.USD]: '$',
};