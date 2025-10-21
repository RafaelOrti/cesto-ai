import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { DateTimePickerDialogComponent } from './datetime-picker-dialog.component';

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ]
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = 'Fecha y Hora';
  @Input() placeholder: string = 'Seleccionar fecha y hora';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() showTime: boolean = true;
  @Input() format: string = 'dd/MM/yyyy HH:mm';
  
  @Output() dateTimeChange = new EventEmitter<Date | null>();

  value: Date | null = null;
  displayValue: string = '';

  private onChange = (value: Date | null) => {};
  private onTouched = () => {};

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.updateDisplayValue();
  }

  writeValue(value: Date | null): void {
    this.value = value;
    this.updateDisplayValue();
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  openDateTimePicker(): void {
    if (this.disabled) return;

    const dialogRef = this.dialog.open(DateTimePickerDialogComponent, {
      width: '400px',
      data: {
        selectedDate: this.value,
        minDate: this.minDate,
        maxDate: this.maxDate,
        showTime: this.showTime,
        label: this.label
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.value = result;
        this.updateDisplayValue();
        this.onChange(this.value);
        this.onTouched();
        this.dateTimeChange.emit(this.value);
      }
    });
  }

  clearValue(): void {
    this.value = null;
    this.updateDisplayValue();
    this.onChange(this.value);
    this.onTouched();
    this.dateTimeChange.emit(this.value);
  }

  private updateDisplayValue(): void {
    if (this.value) {
      this.displayValue = this.formatDateTime(this.value);
    } else {
      this.displayValue = '';
    }
  }

  private formatDateTime(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (this.showTime) {
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } else {
      return `${day}/${month}/${year}`;
    }
  }
}

