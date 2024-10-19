import { TestBed } from '@angular/core/testing';

import { VfxAdminService } from './vfx-admin.service';

describe('VfxAdminService', () => {
  let service: VfxAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VfxAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
