import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  pure: false // Make it impure so it updates when language changes
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription: Subscription = new Subscription();

  constructor(private i18nService: I18nService) {}

  transform(key: string, params?: { [key: string]: any }): string {
    return this.i18nService.translate(key, params);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

