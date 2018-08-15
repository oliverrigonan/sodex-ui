import { SoftwareRoutingModule } from './software-routing.module';

describe('SoftwareRoutingModule', () => {
  let softwareRoutingModule: SoftwareRoutingModule;

  beforeEach(() => {
    softwareRoutingModule = new SoftwareRoutingModule();
  });

  it('should create an instance', () => {
    expect(softwareRoutingModule).toBeTruthy();
  });
});
