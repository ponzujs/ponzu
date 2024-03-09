function atPath(path) {
  const pathArr = [];
  path.split('.').forEach((token) => {
    token.split('[').forEach((newtoken) => {
      if (newtoken) {
        pathArr.push(newtoken.endsWith(']') ? `[${newtoken}` : newtoken);
      }
    });
  });
  return pathArr;
}

module.exports = { atPath };
