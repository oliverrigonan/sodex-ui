import { TestBed, inject } from '@angular/core/testing';

import { CheckBalanceService } from './check-balance.service';

describe('CheckBalanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckBalanceService]
    });
  });

  it('should be created', inject([CheckBalanceService], (service: CheckBalanceService) => {
    expect(service).toBeTruthy();
  }));
});
