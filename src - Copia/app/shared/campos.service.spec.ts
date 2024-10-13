import { TestBed } from '@angular/core/testing';

import { CamposService } from './campos.service';

describe('CamposService', () => {
  let service: CamposService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CamposService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
