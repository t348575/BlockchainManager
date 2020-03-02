import { TestBed } from '@angular/core/testing';

import { AngularGlobalsService } from './angular-globals.service';

describe('AngularGlobalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularGlobalsService = TestBed.get(AngularGlobalsService);
    expect(service).toBeTruthy();
  });
});
