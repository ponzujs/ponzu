function always(val) {
  return function alwaysRet() {
    return val;
  };
}

module.exports = { always };
