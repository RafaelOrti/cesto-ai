import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Services
import { I18nService } from '../core/services/i18n.service';

// Pipes
import { TranslatePipe } from './pipes/translate.pipe';

// Directives
import { ClickOutsideDirective } from './directives/click-outside.directive';

// Components
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';

@NgModule({
  declarations: [
    TranslatePipe,
    ClickOutsideDirective,
    LanguageSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    ClickOutsideDirective,
    LanguageSelectorComponent
  ],
  providers: [
    I18nService
  ]
})
export class SharedModule { }

