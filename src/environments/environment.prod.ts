import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  API_URL: 'http://localhost:3000',
  FRONT_URL: 'http://tiketwifizone.gn:4200' 
};
