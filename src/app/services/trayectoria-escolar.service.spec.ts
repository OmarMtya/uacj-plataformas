import { TestBed } from '@angular/core/testing';

import { TrayectoriaEscolarService } from './trayectoria-escolar.service';

describe('TrayectoriaEscolarService', () => {
  let service: TrayectoriaEscolarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrayectoriaEscolarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
