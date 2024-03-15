const { v4 } = require('@ponzujs/core');
const { generatePassphrase } = require('./generate-passphrase');
const { generateCertificate } = require('./generate-certificate');

function generateTenant(name, options = {}) {
  const tenantId = options.tenantId || v4();
  const passphrase = options.passphrase || generatePassphrase();
  const cert = options.cert || generateCertificate(passphrase);
  const result = {
    publicKey: cert.publicKey,
    privateKey: cert.privateKey,
    jwtOptions: {
      id: tenantId,
      name,
      algorithm: options.algorithm || 'RS256',
      lifetime: options.lifetime || '15m',
      lifetimeSeconds: options.lifetimeSeconds || '900',
      passphrase,
    },
  };
  return result;
}

module.exports = {
  generateTenant,
};
