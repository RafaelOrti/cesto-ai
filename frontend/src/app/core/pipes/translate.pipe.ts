import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Pipe({
  name: 'translate',
  pure: false // Make it impure to update when language changes
})
export class TranslatePipe implements PipeTransform {

  constructor(private i18n: I18nService) {}

  transform(key: string, params?: { [key: string]: any }): string {
    return this.i18n.translate(key, params);
  }
}