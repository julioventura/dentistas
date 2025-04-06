import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CrmService } from '../../services/crm.service';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ]
})
export class LeadDetailComponent implements OnInit {
  collectionPath: string = '';
  leadId: string = '';
  // Fix: Initialize Observable properties
  lead$: Observable<any> = of(null);
  crmData$: Observable<any> = of(null);
  
  constructor(
    private route: ActivatedRoute,
    private crmService: CrmService,
    private dialog: MatDialog
  ) { }
  
  ngOnInit(): void {
    this.collectionPath = this.route.snapshot.params['collection'];
    this.leadId = this.route.snapshot.params['id'];
    
    // Get lead data
    this.crmData$ = this.crmService.getCrmData(this.collectionPath, this.leadId);
  }
  
  addReminder(): void {
    const dialogRef = this.dialog.open(ReminderFormComponent, {
      width: '500px',
      data: {
        parentPath: this.collectionPath,
        parentId: this.leadId
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      // Reload data if needed
    });
  }
  
  updateLeadStatus(status: string): void {
    this.crmData$.subscribe(crmData => {
      if (crmData) {
        this.crmService.updateCrmData(this.collectionPath, this.leadId, {
          ...crmData,
          leadStatus: status
        });
      }
    });
  }
}