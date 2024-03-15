const certificateVault = require('./certificate-vault');
const databaseCertificateVault = require('./database-certificate-vault');
const encryption = require('./encryption');
const fileCertificateVault = require('./file-certificate-vault');
const generateCertificate = require('./generate-certificate');
const generatePassphrase = require('./generate-passphrase');
const generateTenant = require('./generate-tenant');
const hash = require('./hash');
const jwtStrategy = require('./jwt-strategy');
const picoPassport = require('./pico-passport');

module.exports = {
  ...databaseCertificateVault,
  ...certificateVault,
  ...encryption,
  ...fileCertificateVault,
  ...generateCertificate,
  ...generatePassphrase,
  ...generateTenant,
  ...hash,
  ...jwtStrategy,
  ...picoPassport,
};
