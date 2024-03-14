const Excel = require('exceljs');
const S = require('@ponzujs/fun');
const {
  ConstantsTable,
  DatatypeTable,
  MethodTable,
  RulesTable,
  SpreadsheetTable,
} = require('./tables');
const {
  coord2excel,
  getRect,
  getCellText,
  splitBlock,
} = require('./book-utils');

class XBook {
  constructor() {
    this.tables = [];
    this.tablesByName = {};
  }

  processSheet(sheet) {
    const rect = getRect(sheet);
    let pendingBlocks = [];
    let currentBlock = [];
    for (let j = rect.top; j <= rect.bottom; j += 1) {
      const currentRow = [];
      currentBlock.push(currentRow);
      for (let i = rect.left; i <= rect.right; i += 1) {
        const cellRef = coord2excel({ row: j - 1, column: i - 1 });
        currentRow.push(getCellText(sheet.getCell(cellRef)));
      }
    }
    pendingBlocks.push(currentBlock);
    let modified = true;
    while (modified) {
      modified = false;
      const oldBlocks = pendingBlocks;
      pendingBlocks = [];
      for (let i = 0; i < oldBlocks.length; i += 1) {
        currentBlock = oldBlocks[i];
        const newBlocks = splitBlock(currentBlock);
        if (newBlocks.length > 1 && !modified) {
          modified = true;
        }
        for (let j = 0; j < newBlocks.length; j += 1) {
          pendingBlocks.push(newBlocks[j]);
        }
      }
    }
    for (let i = 0; i < pendingBlocks.length; i += 1) {
      this.tables.push(pendingBlocks[i]);
    }
  }

  async buildTable(tableType, table) {
    const instance = this.getInstanceOf(`${tableType}Table`, table);
    if (instance) {
      await instance.init();
    }
    return instance;
  }

  async read(filename) {
    const workbook = new Excel.Workbook();
    try {
      if (typeof filename === 'string') {
        await workbook.xlsx.readFile(filename);
      } else {
        await workbook.xlsx.load(filename);
      }
    } catch (err) {
      throw new Error(`Invalid excel file`);
    }
    workbook.eachSheet((worksheet) => {
      this.processSheet(worksheet);
    });
    for (let i = 0; i < this.tables.length; i += 1) {
      const table = this.tables[i];
      const title = table[0][0].trim();
      const tableType = title.split(' ')[0].trim();
      // eslint-disable-next-line no-await-in-loop
      const builtTable = await this.buildTable(tableType, table);
      if (builtTable) {
        this.tables[i] = builtTable;
        if (this.tablesByName[builtTable.name]) {
          throw new Error(`Table ${builtTable.name} was already defined`);
        }
        this.tablesByName[builtTable.name] = builtTable;
      }
    }
    this.buildDefaultContext();
  }

  toJSON() {
    return this.tables.map((table) =>
      Array.isArray(table) ? table : table.toJSON()
    );
  }

  getInstanceOf(className, table = undefined) {
    switch (className) {
      case 'RulesTable':
        return new RulesTable(this, table);
      case 'MultiTable':
        return new RulesTable(this, table, true);
      case 'DatatypeTable':
        return new DatatypeTable(this, table);
      case 'SpreadsheetTable':
        return new SpreadsheetTable(this, table);
      case 'MethodTable':
        return new MethodTable(this, table);
      case 'ConstantsTable':
        return new ConstantsTable(this, table);
      default:
        return undefined;
    }
  }

  fromJSON(json) {
    this.tables = [];
    this.tablesByName = {};
    for (let i = 0; i < json.length; i += 1) {
      const current = json[i];
      if (current.className) {
        const instance = this.getInstanceOf(current.className);
        instance.fromJSON(current);
        this.tables.push(instance);
        this.tablesByName[instance.name] = instance;
      } else {
        this.tables.push(current);
      }
    }
    this.buildDefaultContext();
  }

  buildDefaultContext() {
    this.defaultContext = {};
    this.defaultContext.Math = Math;
    this.defaultContext.console = console;
    this.defaultContext.Date = Date;
    this.defaultContext.S = S;
    for (let i = 0; i < this.tables.length; i += 1) {
      const table = this.tables[i];
      if (table instanceof ConstantsTable) {
        for (let j = 0; j < table.params.length; j += 1) {
          const param = table.params[j];
          this.defaultContext[param.name] = param.value;
        }
      } else if (table.name) {
        this.defaultContext[table.name] = table.getFn ? table.getFn() : table;
      }
    }
  }

  buildContext(params, args) {
    const context = { ...this.defaultContext };
    if (params) {
      for (let i = 0; i < params.length; i += 1) {
        const name = params[i].name || params[i];
        if (name) {
          context[name] = args[i];
        }
      }
    }
    return context;
  }
}

module.exports = { XBook };
