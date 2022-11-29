import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private snackBar: MatSnackBar) {}

  public openSnackBarWarn(message: string) {
    this.snackBar.open(message, '', {
      panelClass: ['mat-toolbar', 'mat-warn'],
      duration: 2500,
    });
  }

  public openSnackBarSucc(message: string) {
    this.snackBar.open(message, '', {
      panelClass: ['mat-toolbar', 'mat-primary'],
      duration: 2500,
    });
  }
}
