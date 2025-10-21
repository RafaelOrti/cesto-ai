import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface DateTimePickerData {
  selectedDate: Date | null;
  minDate?: Date;
  maxDate?: Date;
  showTime: boolean;
  label: string;
}

@Component({
  selector: 'app-datetime-picker-dialog',
  templateUrl: './datetime-picker-dialog.component.html',
  styleUrls: ['./datetime-picker-dialog.component.scss']
})
export class DateTimePickerDialogComponent implements OnInit {
  dateTimeForm: FormGroup;
  selectedDate: Date | null = null;
  selectedTime: string = '00:00';

  constructor(
    public dialogRef: MatDialogRef<DateTimePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DateTimePickerData
  ) {
    this.dateTimeForm = new FormGroup({
      date: new FormControl(null, [Validators.required]),
      time: new FormControl('00:00')
    });
  }

  ngOnInit(): void {
    if (this.data.selectedDate) {
      this.selectedDate = new Date(this.data.selectedDate);
      this.selectedTime = this.formatTime(this.selectedDate);
      this.dateTimeForm.patchValue({
        date: this.selectedDate,
        time: this.selectedTime
      });
    }
  }

  onDateChange(date: Date | null): void {
    this.selectedDate = date;
    if (date && this.data.showTime) {
      // Preserve the time if date changes
      const time = this.dateTimeForm.get('time')?.value || '00:00';
      this.updateDateTime(date, time);
    }
  }

  onTimeChange(time: string): void {
    this.selectedTime = time;
    if (this.selectedDate && this.data.showTime) {
      this.updateDateTime(this.selectedDate, time);
    }
  }

  private updateDateTime(date: Date, time: string): void {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    this.selectedDate = newDate;
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onConfirm(): void {
    if (this.selectedDate) {
      if (this.data.showTime) {
        const time = this.dateTimeForm.get('time')?.value || '00:00';
        this.updateDateTime(this.selectedDate, time);
      }
      this.dialogRef.close(this.selectedDate);
    } else {
      this.dialogRef.close(null);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onClear(): void {
    this.selectedDate = null;
    this.selectedTime = '00:00';
    this.dateTimeForm.patchValue({
      date: null,
      time: '00:00'
    });
    this.dialogRef.close(null);
  }

  get isFormValid(): boolean {
    return this.dateTimeForm.valid;
  }

  get timeOptions(): string[] {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  }

  formatSelectedDateTime(): string {
    if (!this.selectedDate) return '';
    
    const day = this.selectedDate.getDate().toString().padStart(2, '0');
    const month = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = this.selectedDate.getFullYear();
    const hours = this.selectedDate.getHours().toString().padStart(2, '0');
    const minutes = this.selectedDate.getMinutes().toString().padStart(2, '0');

    if (this.data.showTime) {
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } else {
      return `${day}/${month}/${year}`;
    }
  }
}
