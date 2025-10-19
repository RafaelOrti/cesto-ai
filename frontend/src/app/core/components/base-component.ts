import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  template: ''
})
export class BaseComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();
  protected fb: FormBuilder;

  constructor(fb: FormBuilder) {
    this.fb = fb;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected showSuccess(message: string): void {
    console.log('Success:', message);
  }

  protected showError(message: string): void {
    console.error('Error:', message);
  }

  protected showWarning(message: string): void {
    console.warn('Warning:', message);
  }

  protected showInfo(message: string): void {
    console.info('Info:', message);
  }
}