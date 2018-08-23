import { TestBed, inject } from '@angular/core/testing';

import { SoftwareUserFormsService } from './software.user.forms.service';

describe('SoftwareUserFormsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SoftwareUserFormsService]
    });
  });

  it('should be created', inject([SoftwareUserFormsService], (service: SoftwareUserFormsService) => {
    expect(service).toBeTruthy();
  }));
});
