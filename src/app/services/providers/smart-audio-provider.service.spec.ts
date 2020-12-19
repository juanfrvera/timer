import { TestBed } from '@angular/core/testing';

import { SmartAudioProviderService } from './smart-audio-provider.service';

describe('SmartAudioProviderService', () => {
  let service: SmartAudioProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartAudioProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
