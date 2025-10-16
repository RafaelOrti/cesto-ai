import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig extends MatSnackBarConfig {
  type?: NotificationType;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  private readonly typeConfigs: Record<NotificationType, Partial<MatSnackBarConfig>> = {
    success: {
      panelClass: ['success-snackbar'],
      duration: 3000
    },
    error: {
      panelClass: ['error-snackbar'],
      duration: 7000
    },
    warning: {
      panelClass: ['warning-snackbar'],
      duration: 5000
    },
    info: {
      panelClass: ['info-snackbar'],
      duration: 4000
    }
  };

  constructor(private snackBar: MatSnackBar) {}

  show(message: string, type: NotificationType = 'info', config?: Partial<NotificationConfig>): void {
    const finalConfig = {
      ...this.defaultConfig,
      ...this.typeConfigs[type],
      ...config
    };

    this.snackBar.open(message, 'Close', finalConfig);
  }

  success(message: string, config?: Partial<NotificationConfig>): void {
    this.show(message, 'success', config);
  }

  error(message: string, config?: Partial<NotificationConfig>): void {
    this.show(message, 'error', config);
  }

  warning(message: string, config?: Partial<NotificationConfig>): void {
    this.show(message, 'warning', config);
  }

  info(message: string, config?: Partial<NotificationConfig>): void {
    this.show(message, 'info', config);
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}

