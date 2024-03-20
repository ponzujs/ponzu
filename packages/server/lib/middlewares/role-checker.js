function isValidTenant(tenantId, user) {
  if (user.role === 'sa') {
    return true;
  }
  if (!user.tenants || user.tenants.length === 0) {
    return false;
  }
  if (user.tenants.indexOf('*') !== -1) {
    return true;
  }
  if (user.tenants.indexOf(tenantId) !== -1) {
    return true;
  }
  return false;
}

function getParamTenantId(req) {
  const params = [
    req.params?.tenantId,
    req.headers?.tenantid,
    req.query?.tenantId,
  ].filter(Boolean);
  if (params.length === 0) {
    return undefined;
  }
  if (params.length === 1) {
    return undefined;
  }
  for (let i = 1; i < params.length; i += 1) {
    if (params[i] !== params[0]) {
      return false;
    }
  }
  return params[0];
}

function roleChecker(req, srcRoles) {
  const paramTenantId = getParamTenantId(req);
  if (paramTenantId === false) {
    return false;
  }
  if (!isValidTenant(paramTenantId || [req.tenantId], req.user)) {
    return false;
  }
  if (!srcRoles) {
    return true;
  }
  const roles = (
    typeof srcRoles === 'string' ? srcRoles.split(',') : srcRoles
  ).map((r) => r.trim());
  if (
    roles.length === 0 ||
    roles.indexOf('*') !== -1 ||
    roles.indexOf(req.user.role) !== -1
  ) {
    return true;
  }
  return false;
}

module.exports = {
  isValidTenant,
  getParamTenantId,
  roleChecker,
};
