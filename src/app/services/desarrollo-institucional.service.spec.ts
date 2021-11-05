import { TestBed } from '@angular/core/testing';

import { DesarrolloInstitucionalService } from './desarrollo-institucional.service';

describe('DesarrolloInstitucionalService', () => {
  let service: DesarrolloInstitucionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesarrolloInstitucionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
