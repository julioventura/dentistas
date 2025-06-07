import { Component, OnInit, inject } from '@angular/core'; // Alteração: uso de 'inject' para dependências
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupService } from '../../services/group.service'; // Ensure this path is correct
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

export interface GroupSharingModalData {
  collection: string;
  recordId: string;
  recordName: string;
  currentGroupId?: string | null;
}

@Component({
  selector: 'app-group-sharing-modal',
  templateUrl: './group-sharing-modal.component.html',
  styleUrls: ['./group-sharing-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ]
})
export class GroupSharingModalComponent implements OnInit {
  sharingForm: FormGroup;
  groups: any[] = [];
  isLoading = true;
  isProcessing = false;
  dialogRef = inject(MatDialogRef<GroupSharingModalComponent>); // Inclusão: injeção direta do MatDialogRef
  data = inject(MAT_DIALOG_DATA) as GroupSharingModalData; // Inclusão: obtém dados via inject

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private snackBar: MatSnackBar
  ) {
    this.sharingForm = this.fb.group({
      selectedGroupId: [this.data.currentGroupId || null]
    });
  }

  ngOnInit(): void {
    this.loadAvailableGroups();
  }

  loadAvailableGroups(): void {
    this.isLoading = true;
    this.groupService.getAllUserGroups()
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar grupos:', error);
          this.snackBar.open('Erro ao carregar grupos disponíveis', 'OK', { duration: 3000 });
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(groups => {
        this.groups = groups;
      });
  }

  onShare(): void {
    if (this.isProcessing) { return; }
    const selectedGroupId = this.sharingForm.get('selectedGroupId')?.value;
    if (selectedGroupId === this.data.currentGroupId) {
      this.snackBar.open('Nenhuma alteração foi feita', 'OK', { duration: 2000 });
      this.dialogRef.close(false);
      return;
    }

    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
      const message = selectedGroupId
        ? 'Paciente compartilhado com o grupo com sucesso!'
        : 'Compartilhamento removido com sucesso!';
      this.snackBar.open(message, 'OK', { duration: 3000 });
      this.dialogRef.close({ newGroupId: selectedGroupId });
    }, 1000);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getGroupDisplayName(group: any): string {
    return group?.name || `Grupo ${group?.id || 'sem nome'}`;
  }
}