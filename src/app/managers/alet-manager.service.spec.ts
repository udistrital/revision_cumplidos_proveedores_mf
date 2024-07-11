import { TestBed } from '@angular/core/testing';

import { AletManagerService } from './alet-manager.service';

describe('AletManagerService', () => {
  let service: AletManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AletManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
