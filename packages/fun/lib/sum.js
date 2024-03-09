const { forEach } = require('./for-each');

function sum(...nums) {
  const items = nums.length === 1 ? nums[0] : nums;
  let result = 0;
  forEach(items, (n) => {
    result += Number(n);
  });
  return result;
}

module.exports = { sum };
