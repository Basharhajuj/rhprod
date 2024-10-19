import { TestBed } from '@angular/core/testing';

import { ReelsDetailsService } from './reels-details.service';

describe('ReelsDetailsService', () => {
  let service: ReelsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReelsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
