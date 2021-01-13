let protocol = window.location.protocol;
let hostname = window.location.hostname;

export const environment = {
  production: true,
  host: protocol + '//' + hostname
};
