import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { LoggingService } from '../../services/logging.service';
import { Group } from '../../models/group.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-group-sharing',
  templateUrl: './group-sharing.component.html',
  styleUrls: ['./group-sharing.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ]
})
export class GroupSharingComponent implements OnInit, OnDestroy {
  @Input() recordGroupId: string | null = null;
  @Input() collection: string = '';
  @Input() recordId: string = '';
  @Output() groupIdChange = new EventEmitter<string | null>();

  groups: Group[] = [];
  isLoading = false;
  selectedGroupId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private groupService: GroupService,
    private snackBar: MatSnackBar,
    private logger: LoggingService
  ) {}

  ngOnInit(): void {
    this.logger.log('GroupSharingComponent', 'Inicializando', { 
      collection: this.collection,
      recordId: this.recordId,
      initialGroupId: this.recordGroupId
    });

    this.selectedGroupId = this.recordGroupId;
    this.loadGroups();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadGroups(): void {
    this.isLoading = true;
    this.groupService.getAllUserGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (groups) => {
          this.groups = groups;
          this.isLoading = false;
          this.logger.log('GroupSharingComponent', `${groups.length} grupos carregados`);
        },
        error: (error) => {
          this.isLoading = false;
          this.logger.error('GroupSharingComponent', 'Erro ao carregar grupos', error);
          this.snackBar.open('Erro ao carregar grupos disponíveis', 'OK', { duration: 3000 });
        }
      });
  }

  onGroupChange(groupId: string | null): void {
    this.logger.log('GroupSharingComponent', 'Grupo alterado', { 
      previous: this.recordGroupId,
      new: groupId 
    });
    this.groupIdChange.emit(groupId);
  }
}