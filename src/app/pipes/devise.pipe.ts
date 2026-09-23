import { Pipe, PipeTransform } from '@angular/core';
import { DEVISE_SYMBOLES, Devise } from '../models/devise.model';

@Pipe({
  name: 'devise',
  standalone: true
})
export class DevisePipe implements PipeTransform {
  transform(montant: number | null | undefined, devise: Devise | string | null | undefined): string {
    if (montant === null || montant === undefined) return '-';

    const montantFormate = Number(montant).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const symbole = devise ? DEVISE_SYMBOLES[devise as Devise] ?? devise : '';

    // EUR et USD s'affichent après le montant en usage français ("1 989,00 €"), TND aussi par convention locale
    return `${montantFormate} ${symbole}`;
  }
}