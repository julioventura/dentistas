import { TestBed } from '@angular/core/testing';
import { GroupSharingService } from './group-sharing.service';
import { GroupService } from './group.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggingService } from './logging.service';
import { of, throwError } from 'rxjs';

describe('GroupSharingService', () => {
  let service: GroupSharingService;
  let groupServiceSpy: jasmine.SpyObj<GroupService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let loggerSpy: jasmine.SpyObj<LoggingService>;

  beforeEach(() => {
    const groupSpy = jasmine.createSpyObj('GroupService', [
      'removeRecordSharing',
      'shareRecordWithGroup',
      'getSharingHistory',
      'getGroup'
    ]);
    
    const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const logSpy = jasmine.createSpyObj('LoggingService', ['log', 'error', 'warn']);

    TestBed.configureTestingModule({
      providers: [
        GroupSharingService,
        { provide: GroupService, useValue: groupSpy },
        { provide: MatSnackBar, useValue: snackSpy },
        { provide: LoggingService, useValue: logSpy }
      ]
    });
    
    service = TestBed.inject(GroupSharingService);
    groupServiceSpy = TestBed.inject(GroupService) as jasmine.SpyObj<GroupService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    loggerSpy = TestBed.inject(LoggingService) as jasmine.SpyObj<LoggingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return immediately when no change in sharing', (done) => {
    service.handleRecordSharing('collection', 'record1', 'group1', 'group1').subscribe({
      next: () => {
        expect(groupServiceSpy.removeRecordSharing).not.toHaveBeenCalled();
        expect(groupServiceSpy.shareRecordWithGroup).not.toHaveBeenCalled();
        expect(loggerSpy.log).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should call removeRecordSharing when removing sharing', (done) => {
    groupServiceSpy.removeRecordSharing.and.returnValue(Promise.resolve());
    
    service.handleRecordSharing('collection', 'record1', null, 'group1').subscribe({
      next: () => {
        expect(groupServiceSpy.removeRecordSharing).toHaveBeenCalledWith('collection', 'record1');
        expect(snackBarSpy.open).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should call shareRecordWithGroup when adding sharing', (done) => {
    groupServiceSpy.shareRecordWithGroup.and.returnValue(Promise.resolve());
    
    service.handleRecordSharing('collection', 'record1', 'group2', null).subscribe({
      next: () => {
        expect(groupServiceSpy.shareRecordWithGroup).toHaveBeenCalledWith('collection', 'record1', 'group2');
        expect(snackBarSpy.open).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle errors when removing sharing', (done) => {
    const testError = new Error('Test error');
    groupServiceSpy.removeRecordSharing.and.returnValue(Promise.reject(testError));
    
    service.handleRecordSharing('collection', 'record1', null, 'group1').subscribe({
      error: (error) => {
        expect(error.message).toContain('Erro ao remover compartilhamento');
        expect(loggerSpy.error).toHaveBeenCalled();
        expect(snackBarSpy.open).toHaveBeenCalled();
        done();
      }
    });
  });
});