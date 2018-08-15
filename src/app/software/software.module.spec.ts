import { SoftwareModule } from './software.module';

describe('SoftwareModule', () => {
  let softwareModule: SoftwareModule;

  beforeEach(() => {
    softwareModule = new SoftwareModule();
  });

  it('should create an instance', () => {
    expect(softwareModule).toBeTruthy();
  });
});
