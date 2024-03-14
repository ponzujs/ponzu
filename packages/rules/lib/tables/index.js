const constantsTable = require('./constants-table');
const datatypeTable = require('./datatype-table');
const methodTable = require('./method-table');
const rulesTable = require('./rules-table');
const spreadsheetTable = require('./spreadsheet-table');

module.exports = {
  ...constantsTable,
  ...datatypeTable,
  ...methodTable,
  ...rulesTable,
  ...spreadsheetTable,
};
