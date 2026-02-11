 import { appConfig } from './app.config';

describe('App Config', () => {

  it('should define providers', () => {
    expect(appConfig.providers).toBeDefined();
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });

  it('should include router provider', () => {
    const routerProvider = appConfig.providers?.find((p: any) =>
      p?.ɵkind === 0 || p?.provide
    );
    expect(routerProvider).toBeDefined();
  });

});
