import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NotificationsComponent } from './components/notifications/notifications.component';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [
    NotificationsComponent,
    TranslatePipe,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  exports: [
    NotificationsComponent,
    TranslatePipe,
  ]
})
export class CoreModule {}


