import { commonEnvironment } from './environment.common';

const prodEnvironment: Partial<typeof commonEnvironment> = {
  production: true
};

export const environment = { ...commonEnvironment, ...prodEnvironment };
